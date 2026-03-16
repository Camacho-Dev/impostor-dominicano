import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Banner que se muestra cuando no hay conexión a internet.
 * El juego funciona offline; el mensaje informa que algunas funciones pueden no estar disponibles.
 */
export default function OfflineBanner() {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px 16px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
        fontSize: '0.85em',
        fontWeight: '600',
        textAlign: 'center',
        zIndex: 99997,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      📵 {t('offlineMessage')}
    </div>
  );
}
