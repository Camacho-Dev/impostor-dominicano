import { useState, useRef, useEffect } from 'react';
import { buscarRespuesta, RESPUESTA_DEFAULT, MENSAJE_BIENVENIDA } from '../data/asistenteMenores';

const VERDE_WHATSAPP = '#075E54';
const VERDE_WHATSAPP_OSCuro = '#054D44';
const BURBUJA_BOT = '#ffffff';
const BURBUJA_USUARIO = '#D9FDD3';
const FONDO_CHAT = '#E5DDD5';

export default function AsistenteMenores() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { id: 0, texto: MENSAJE_BIENVENIDA, esBot: true, hora: new Date() },
  ]);
  const [input, setInput] = useState('');
  const listadoRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (abierto && listadoRef.current) {
      listadoRef.current.scrollTop = listadoRef.current.scrollHeight;
    }
  }, [mensajes, abierto]);

  useEffect(() => {
    if (abierto && inputRef.current) {
      inputRef.current.focus();
    }
  }, [abierto]);

  const enviar = () => {
    const texto = input.trim();
    if (!texto) return;

    setInput('');
    const idUser = Date.now();
    const idBot = idUser + 1;

    setMensajes((prev) => [
      ...prev,
      { id: idUser, texto, esBot: false, hora: new Date() },
    ]);

    const respuesta = buscarRespuesta(texto) || RESPUESTA_DEFAULT;
    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        { id: idBot, texto: respuesta, esBot: true, hora: new Date() },
      ]);
    }, 600 + Math.min(texto.length * 20, 800));
  };

  const formatearHora = (date) => {
    return date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir asistente Los Menores y Su Lío"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${VERDE_WHATSAPP} 0%, ${VERDE_WHATSAPP_OSCuro} 100%)`,
          border: 'none',
          boxShadow: '0 4px 20px rgba(7, 94, 84, 0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99990,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      {/* Overlay tipo WhatsApp */}
      {abierto && (
        <div
          role="dialog"
          aria-label="Chat Los Menores y Su Lío"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99995,
            display: 'flex',
            flexDirection: 'column',
            background: FONDO_CHAT,
            boxShadow: '0 0 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header estilo WhatsApp */}
          <div
            style={{
              background: `linear-gradient(180deg, ${VERDE_WHATSAPP} 0%, ${VERDE_WHATSAPP_OSCuro} 100%)`,
              color: '#fff',
              padding: '12px 16px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                padding: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4em',
              }}
            >
              🇩🇴
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: '1.05em' }}>
                Lo' Menore' y Su Lío
              </div>
              <div style={{ fontSize: '0.8em', opacity: 0.9 }}>
                Asistente del juego
              </div>
            </div>
          </div>

          {/* Lista de mensajes */}
          <div
            ref={listadoRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L60 30 30 60 0 30z\' fill=\'%23d4c5b5\' fill-opacity=\'.08\'/%3E%3C/svg%3E")',
            }}
          >
            {mensajes.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.esBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.esBot ? 'flex-start' : 'flex-end',
                }}
              >
                <div
                  style={{
                    background: m.esBot ? BURBUJA_BOT : BURBUJA_USUARIO,
                    color: m.esBot ? '#111' : '#111',
                    padding: '8px 12px',
                    borderRadius: m.esBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    fontSize: '0.95em',
                    lineHeight: 1.4,
                  }}
                >
                  {m.texto}
                </div>
                <span
                  style={{
                    fontSize: '0.7em',
                    opacity: 0.7,
                    marginTop: 2,
                  }}
                >
                  {formatearHora(m.hora)}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 12px 16px',
              background: '#f0f0f0',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && enviar()}
              placeholder="Escribe tu pregunta..."
              aria-label="Mensaje para el asistente"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: 24,
                fontSize: '1em',
                outline: 'none',
                background: '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
              }}
            />
            <button
              type="button"
              onClick={enviar}
              aria-label="Enviar"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: VERDE_WHATSAPP,
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
