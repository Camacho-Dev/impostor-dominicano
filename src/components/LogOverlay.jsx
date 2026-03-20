import { useEffect, useMemo, useState } from 'react';
import { getLogger } from '../utils/logger';

export default function LogOverlay() {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logger = getLogger();
    if (!logger) return;

    setVisible(!!logger.isOverlayEnabled?.());

    const sync = () => {
      try {
        const all = logger.getLogs?.() || [];
        setLogs(all.slice(-120));
      } catch {}
    };

    sync();
    const unsub = logger.subscribe?.(() => sync());
    return () => {
      try {
        unsub?.();
      } catch {}
    };
  }, []);

  const copyText = async () => {
    const logger = getLogger();
    if (!logger) return;
    try {
      const text = logger.exportJSON?.() || '';
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    } catch {}
  };

  const clearLogs = () => {
    const logger = getLogger();
    try {
      logger?.clear?.();
    } catch {}
  };

  const header = useMemo(() => {
    const logger = getLogger();
    const total = logs.length;
    const name = logger?.fileName ? ` | TXT: ${logger.fileName}` : '';
    return `Logs (${total})${name}`;
  }, [logs.length]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column'
      }}
      role="dialog"
      aria-label="Debug logs"
    >
      <div
        style={{
          padding: '12px 14px',
          background: 'rgba(10,10,10,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0
        }}
      >
        <div style={{ fontWeight: 800, color: '#fff', flex: 1 }}>{header}</div>
        <button
          type="button"
          onClick={async () => {
            const logger = getLogger();
            const uri = logger?.fileUri || '';
            if (!uri) return;
            try {
              await navigator.clipboard.writeText(uri);
            } catch {}
          }}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            cursor: 'pointer',
            opacity: (getLogger()?.fileUri ? 1 : 0.6)
          }}
          aria-label="Copiar URI del TXT"
          title="Copiar URI del TXT"
        >
          Copiar URI TXT
        </button>
        <button
          type="button"
          onClick={copyText}
          style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
        >
          Copiar
        </button>
        <button
          type="button"
          onClick={clearLogs}
          style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
        >
          Limpiar
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px 14px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 12,
          color: '#fff'
        }}
      >
        {logs.length === 0 && (
          <div style={{ opacity: 0.8 }}>Sin logs aún.</div>
        )}
        {logs.map((l, idx) => (
          <div key={`${l.ts}-${idx}`} style={{ marginBottom: 10, borderBottom: '1px dashed rgba(255,255,255,0.12)', paddingBottom: 10 }}>
            <div style={{ fontWeight: 800, opacity: 0.95 }}>
              {new Date(l.ts).toLocaleTimeString()} [{String(l.level).toUpperCase()}] {l.message}
            </div>
            {l.context && (
              <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', opacity: 0.85 }}>
                {typeof l.context === 'string' ? l.context : JSON.stringify(l.context, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

