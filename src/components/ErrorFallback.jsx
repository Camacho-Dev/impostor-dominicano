import { useLanguage } from '../context/LanguageContext';

export default function ErrorFallback({ onRetry }) {
  const { t } = useLanguage();
  return (
    <div
      className="pantalla activa"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--color-surface, rgba(26, 26, 46, 0.95))',
        color: 'var(--color-text)'
      }}
    >
      <div style={{ fontSize: '4em', marginBottom: '16px' }}>😅</div>
      <h2 style={{ fontSize: '1.5em', marginBottom: '12px' }}>{t('errorTitle')}</h2>
      <p style={{ opacity: 0.9, marginBottom: '24px', maxWidth: '320px' }}>
        {t('errorDesc')}
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onRetry}
        style={{ maxWidth: '280px' }}
      >
        {t('retry')}
      </button>
    </div>
  );
}
