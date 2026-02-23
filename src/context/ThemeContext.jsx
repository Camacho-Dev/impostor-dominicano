import { createContext, useContext, useState, useEffect } from 'react';

const THEME_KEY = 'temaApp';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTemaState] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    try {
      localStorage.setItem(THEME_KEY, tema);
    } catch (e) {
      console.warn('No se pudo guardar tema:', e);
    }
  }, [tema]);

  const setTema = (valor) => setTemaState(valor === 'light' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTema debe usarse dentro de ThemeProvider');
  }
  return ctx;
}
