'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaRocket } from 'react-icons/fa';
import { usePortfolioMode } from '../contexts/PortfolioModeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ModeToggle = () => {
  const { portfolioMode, setPortfolioMode, isFreelance } = usePortfolioMode();
  const { t } = useLanguage();

  return (
    <div className="fixed top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-[40] flex justify-center w-full max-w-xs px-4">
      <motion.div
        layout
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`relative w-full rounded-full p-[3px] flex items-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] border transition-all duration-500 backdrop-blur-xl ${
          isFreelance
            ? 'bg-emerald-950/80 border-emerald-500/30 dark:border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
            : 'bg-zinc-900/80 border-zinc-700/30 dark:border-zinc-800 text-zinc-400'
        }`}
      >
        {/* Toggle options wrapper */}
        <div className="relative w-full h-10 flex items-center select-none font-bold text-xs tracking-wider uppercase">
          
          {/* Career Button */}
          <button
            onClick={() => setPortfolioMode('job')}
            className={`relative z-10 flex-1 h-full flex items-center justify-center gap-2 rounded-full transition-colors duration-300 ${
              !isFreelance ? 'text-white' : 'text-emerald-400/60 hover:text-emerald-300'
            }`}
          >
            <FaBriefcase className="text-sm shrink-0" />
            <span>{t('mode.career', 'Career')}</span>
          </button>

          {/* Freelance Button */}
          <button
            onClick={() => setPortfolioMode('freelance')}
            className={`relative z-10 flex-1 h-full flex items-center justify-center gap-2 rounded-full transition-colors duration-300 ${
              isFreelance ? 'text-emerald-950 dark:text-emerald-50 font-black' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FaRocket className="text-sm shrink-0" />
            <span>{t('mode.freelance', 'Freelance')}</span>
            
            {/* Status light when offline (in Career Mode) */}
            {isFreelance && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* Lyft Sliding Background Indicator */}
          <motion.div
            layoutId="activeModeIndicator"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`absolute top-0 bottom-0 left-0 w-1/2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${
              isFreelance
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 translate-x-full'
                : 'bg-zinc-800'
            }`}
            style={{
              height: '100%',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ModeToggle;
