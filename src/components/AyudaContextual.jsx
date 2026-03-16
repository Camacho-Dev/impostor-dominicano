import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Botón "?" que muestra un tooltip/modal con texto de ayuda contextual.
 * @param {string} translationKey - Clave en translations (ej: 'helpJuego')
 */
export default function AyudaContextual({ translationKey }) {
  const { t } = useLanguage();
  const [abierto, setAbierto] = useState(false);

  const texto = t(translationKey);
  if (!texto) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={t('help')}
        aria-expanded={abierto}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.08)',
          color: 'var(--color-text)',
          fontSize: '1em',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}
      >
        ?
      </button>
      {abierto && (
        <div
          role="dialog"
          aria-label={t('help')}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99996,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'rgba(0,0,0,0.6)',
            boxSizing: 'border-box',
          }}
          onClick={() => setAbierto(false)}
        >
          <div
            style={{
              background: 'var(--color-bg-mid)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              padding: '20px 24px',
              maxWidth: 360,
              width: '100%',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              fontSize: '0.95em',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ margin: 0 }}>{texto}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setAbierto(false)}
              style={{ marginTop: 16, width: '100%' }}
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
