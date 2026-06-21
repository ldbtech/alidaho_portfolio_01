'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const PortfolioModeContext = createContext();

export const usePortfolioMode = () => {
  const context = useContext(PortfolioModeContext);
  if (!context) {
    throw new Error('usePortfolioMode must be used within a PortfolioModeProvider');
  }
  return context;
};

export const PortfolioModeProvider = ({ children }) => {
  const [portfolioMode, setPortfolioMode] = useState('job'); // 'job' | 'freelance'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('portfolio-mode');
      if (savedMode === 'job' || savedMode === 'freelance') {
        setPortfolioMode(savedMode);
      }
    } catch (_) {}
    setMounted(true);
  }, []);

  const changeMode = (mode) => {
    if (mode === 'job' || mode === 'freelance') {
      setPortfolioMode(mode);
      try {
        localStorage.setItem('portfolio-mode', mode);
      } catch (_) {}
    }
  };

  const value = {
    portfolioMode: mounted ? portfolioMode : 'job',
    setPortfolioMode: changeMode,
    isFreelance: mounted ? portfolioMode === 'freelance' : false,
    isJob: mounted ? portfolioMode === 'job' : true,
  };

  return (
    <PortfolioModeContext.Provider value={value}>
      {children}
    </PortfolioModeContext.Provider>
  );
};
