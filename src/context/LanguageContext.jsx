import { createContext, useContext, useState, useEffect } from 'react';
import { translations, defaultLang } from '../translations';

const LANG_KEY = 'idiomaApp';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [idioma, setIdiomaState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      return saved === 'en' ? 'en' : 'es';
    } catch (e) {
      return defaultLang;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, idioma);
    } catch (e) {
      console.warn('No se pudo guardar idioma:', e);
    }
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es';
  }, [idioma]);

  const t = (key) => {
    const dict = translations[idioma] || translations.es;
    return dict[key] ?? translations.es[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ idioma, setIdioma: setIdiomaState, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  }
  return ctx;
}
