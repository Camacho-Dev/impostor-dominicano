const MAX_LOGS = 300;
let suppressConsoleCapture = false;
let fileLogEnabled = false;
let fileBuffer = [];
let fileFlushTimer = null;
let fileWriting = false;
let fileName = '';
let fileUri = '';
let uploadEnabled = false;
let uploadInterval = null;
let uploadErrors = [];
let uploadWarnings = [];
let lastPantalla = '';
let lastUploadAt = 0;

function truncString(s, max = 600) {
  try {
    const str = typeof s === 'string' ? s : String(s);
    if (str.length <= max) return str;
    return str.slice(0, max) + '…';
  } catch {
    return '';
  }
}

function pickDiagContext(context) {
  if (!context || typeof context !== 'object') return context;
  const out = {};
  if (context.pantalla) out.pantalla = context.pantalla;
  if (context.status != null) out.status = context.status;
  if (context.method) out.method = context.method;
  if (context.url) out.url = truncString(context.url, 250);
  return Object.keys(out).length ? out : undefined;
}

function parseBool(value) {
  if (value == null) return false;
  const s = String(value).toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

function safeStringify(value) {
  try {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  } catch {
    try {
      return String(value);
    } catch {
      return '[unserializable]';
    }
  }
}

function getQueryEnabled(paramName) {
  try {
    const url = new URL(window.location.href);
    return parseBool(url.searchParams.get(paramName));
  } catch {
    return false;
  }
}

export function initLogger() {
  if (typeof window === 'undefined') return;
  if (window.__IMPOSTOR_LOGGER__) return;

  const queryShowOverlay = getQueryEnabled('debugLogs');
  const localOverlay = parseBool(window.localStorage?.getItem('impostor_debug_logs'));
  const overlayEnabled = queryShowOverlay || localOverlay;

  const logs = [];
  const listeners = new Set();

  const logger = {
    overlayEnabled,
    fileUri: '',
    fileName: '',
    setUploadEnabled(enabled) {
      uploadEnabled = !!enabled;
    },
    isOverlayEnabled() {
      return !!this.overlayEnabled;
    },
    getLogs() {
      return logs.slice();
    },
    clear() {
      logs.length = 0;
      listeners.forEach((fn) => {
        try {
          fn();
        } catch {}
      });
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    _push(level, message, context) {
      const entry = {
        ts: Date.now(),
        level,
        message: safeStringify(message),
        context: context ? context : undefined
      };

      logs.push(entry);
      if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);

      // Notificar en tiempo real para el overlay
      listeners.forEach((fn) => {
        try {
          fn(entry);
        } catch {}
      });

      // Siempre loguea en consola (esto es “tiempo real” también)
      const text = `[${new Date(entry.ts).toLocaleTimeString()}] ${level.toUpperCase()}: ${entry.message}`;
      try {
        suppressConsoleCapture = true;
        if (level === 'error') console.error(text, context || '');
        else if (level === 'warn') console.warn(text, context || '');
        else console.log(text, context || '');
      } finally {
        suppressConsoleCapture = false;
      }

      // Buffer para archivo txt en Android (cuando esté listo, se escribirá por lotes)
      const ctxStr = entry.context ? `\n${safeStringify(entry.context)}` : '';
      const line = `${new Date(entry.ts).toISOString()} [${level.toUpperCase()}] ${entry.message}${ctxStr}\n`;
      fileBuffer.push(line);

      // Buffer pequeño para subir al admin (Firestore)
      try {
        if (level === 'info' && entry.message === 'cambio_pantalla' && context?.to) {
          lastPantalla = String(context.to).slice(0, 80);
        }
        if (level === 'error') {
          const stack = context?.stack ? truncString(context.stack, 500) : undefined;
          uploadErrors.push({
            ts: entry.ts,
            message: truncString(entry.message, 220),
            context: pickDiagContext(context),
            stack
          });
          if (uploadErrors.length > 15) uploadErrors.splice(0, uploadErrors.length - 15);
        } else if (level === 'warn') {
          uploadWarnings.push({
            ts: entry.ts,
            message: truncString(entry.message, 220),
            context: pickDiagContext(context)
          });
          if (uploadWarnings.length > 25) uploadWarnings.splice(0, uploadWarnings.length - 25);
        }
      } catch {}
    },
    log(level, message, context) {
      this._push(level, message, context);
    },
    error(message, context) {
      this._push('error', message, context);
    },
    warn(message, context) {
      this._push('warn', message, context);
    },
    info(message, context) {
      this._push('info', message, context);
    },
    logError(errorLike, context) {
      const err =
        errorLike instanceof Error
          ? errorLike
          : null;
      const message = err?.message || safeStringify(errorLike);
      const stack = err?.stack;
      this._push('error', message, {
        ...context,
        stack
      });
    },
    exportJSON() {
      return JSON.stringify({ exportedAt: Date.now(), logs }, null, 2);
    }
  };

  window.__IMPOSTOR_LOGGER__ = logger;

  // Activar log a archivo (.txt) en nativo (Android/iOS) sin que tú tengas que tocar nada
  try {
    // Requerimos dinámico para evitar romper web
    // eslint-disable-next-line import/no-dynamic-require
    Promise.resolve().then(async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor?.isNativePlatform?.()) return;

        const fsMod = await import('@capacitor/filesystem');
        const { Filesystem, Directory, Encoding } = fsMod;

        // Solicitar permisos si aplica (Android 10+)
        try {
          await Filesystem.requestPermissions?.();
        } catch {}

        const iso = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        fileName = `impostor-logs-${iso}.txt`;

        const header =
          `=== IMPOSITOR LOGS ===\n` +
          `createdAt: ${new Date().toISOString()}\n` +
          `device: ${safeStringify({ platform: Capacitor.getPlatform?.() })}\n` +
          `=======================\n\n`;

        // Crear/reescribir el archivo al iniciar sesión
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Documents,
          data: header,
          encoding: Encoding.UTF8
        });

        const uriRes = await Filesystem.getUri?.({
          path: fileName,
          directory: Directory.Documents
        });
        fileUri = uriRes?.uri || '';
        logger.fileUri = fileUri;
        logger.fileName = fileName;

        fileLogEnabled = true;

        // Flush cada ~2s para escribir “en tiempo real” sin bloquear
        fileFlushTimer = setInterval(async () => {
          if (!fileLogEnabled) return;
          if (fileWriting) return;
          if (fileBuffer.length === 0) return;

          fileWriting = true;
          const toWrite = fileBuffer.join('');
          fileBuffer = [];
          try {
            await Filesystem.appendFile({
              path: fileName,
              directory: Directory.Documents,
              data: toWrite,
              encoding: Encoding.UTF8
            });
          } catch (e) {
            // Si falla, re-intentamos acumulando de nuevo
            fileBuffer = [toWrite, ...fileBuffer];
          } finally {
            fileWriting = false;
          }
        }, 2000);
      } catch {}
    });
  } catch {}

  // Interceptar console.error (solo capturamos errores “reales”, con filtro)
  try {
    const originalConsoleError = console.error?.bind(console);
    if (typeof originalConsoleError === 'function') {
      console.error = (...args) => {
        if (suppressConsoleCapture) {
          originalConsoleError(...args);
          return;
        }
        try {
          originalConsoleError(...args);
        } catch {}
        try {
          const hasErrorObject = args.some((a) => a instanceof Error);
          const firstErr = args.find((a) => a instanceof Error);
          const firstString = typeof args[0] === 'string' ? args[0] : '';
          const messageToCheck = firstString || firstErr?.message || '';
          const looksLikeError = /error|exception|uncaught/i.test(String(messageToCheck));

          if (hasErrorObject || looksLikeError) {
            logger._push('error', firstErr?.message || firstString || 'console.error', {
              args: args.map((a) => {
                if (a instanceof Error) return { message: a.message, stack: a.stack };
                return a;
              }).slice(0, 6)
            });
          }
        } catch {}
      };
    }
  } catch {}

  // Errores globales del runtime
  window.addEventListener('error', (event) => {
    try {
      const msg = event?.message || 'JS runtime error';
      logger._push('error', msg, {
        filename: event?.filename,
        lineno: event?.lineno,
        colno: event?.colno,
        stack: event?.error?.stack
      });
    } catch {}
  });

  // Promesas no capturadas
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event?.reason;
      const msg =
        (reason && reason.message) ? reason.message : 'Unhandled promise rejection';
      logger._push('error', msg, {
        stack: reason?.stack,
        reason: typeof reason === 'object' ? reason : undefined
      });
    } catch {}
  });

  // Captura de errores de red via fetch
  const originalFetch = window.fetch?.bind(window);
  if (typeof originalFetch === 'function') {
    window.fetch = async (...args) => {
      let url = '';
      let method = 'GET';
      try {
        const input = args[0];
        const init = args[1] || {};
        method = init?.method ? String(init.method).toUpperCase() : method;
        url = typeof input === 'string' ? input : input?.url ? String(input.url) : '';
      } catch {}

      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          logger._push('warn', 'fetch responded !ok', {
            url,
            method,
            status: response.status
          });
        }
        return response;
      } catch (err) {
        logger._push('error', 'fetch failed', {
          url,
          method,
          message: err?.message,
          stack: err?.stack
        });
        throw err;
      }
    };
  }

  // Subida de resumen al admin (solo nativo + cuando App habilite uploadEnabled)
  try {
    Promise.resolve().then(async () => {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor?.isNativePlatform?.()) return;

      uploadInterval = setInterval(async () => {
        if (!uploadEnabled) return;
        if (Date.now() - lastUploadAt < 20000) return; // anti-spam
        lastUploadAt = Date.now();

        const deviceId = (() => {
          try {
            return window.localStorage?.getItem('deviceId') || '';
          } catch {
            return '';
          }
        })();
        if (!deviceId) return;

        try {
          const { actualizarDiagnosticoSesion } = await import('./sessionRegistry');

          const now = Date.now();
          const window30m = 30 * 60 * 1000;
          const errors30m = uploadErrors.filter((e) => now - e.ts <= window30m);
          const warnings30m = uploadWarnings.filter((w) => now - w.ts <= window30m);

          const payload = {
            lastPantalla: lastPantalla || undefined,
            lastErrors: uploadErrors.slice(-3),
            lastWarnings: uploadWarnings.slice(-5),
            counts: {
              errors30m: errors30m.length,
              warnings30m: warnings30m.length
            }
          };

          await actualizarDiagnosticoSesion(deviceId, payload);
        } catch {}
      }, 25000);
    });
  } catch {}
}

export function getLogger() {
  if (typeof window === 'undefined') return null;
  return window.__IMPOSTOR_LOGGER__ || null;
}

export function setLoggerUploadEnabled(enabled) {
  try {
    const logger = getLogger();
    if (logger?.setUploadEnabled) logger.setUploadEnabled(!!enabled);
  } catch {}
}

