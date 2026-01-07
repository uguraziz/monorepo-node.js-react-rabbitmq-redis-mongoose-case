import { useEffect } from 'react';
import { useUIStore } from '../../store/ui.store.js';

export const ThemeProvider = ({ children }) => {
  const { theme } = useUIStore();
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  return <>{children}</>;
};

