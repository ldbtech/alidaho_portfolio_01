'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaRocket } from 'react-icons/fa';
import { usePortfolioMode } from '../contexts/PortfolioModeContext';
import { useLanguage } from '../contexts/LanguageContext';

const SplitLandingGate = () => {
  const { setPortfolioMode } = usePortfolioMode();
  const { t } = useLanguage();
  const [hoveredPanel, setHoveredPanel] = useState(null); // 'job' | 'freelance' | null

  const handleSelect = (mode) => {
    setPortfolioMode(mode);
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col md:flex-row bg-[#030303] text-white font-sans overflow-hidden"
    >
      {/* Decorative center logo/badge */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
          <span className="text-xl font-black text-white">AD</span>
        </div>
      </div>

      {/* Left Column: Career Path */}
      <motion.div
        onHoverStart={() => setHoveredPanel('job')}
        onHoverEnd={() => setHoveredPanel(null)}
        onClick={() => handleSelect('job')}
        animate={{
          flex: hoveredPanel === 'job' ? 1.3 : hoveredPanel === 'freelance' ? 0.7 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className="relative flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 cursor-pointer border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950 transition-colors duration-500 group overflow-hidden"
      >
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-zinc-900 to-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Animated grid lines background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-[size:32px_32px]"
          style={{ backgroundImage: 'radial-gradient(var(--grid-dots) 1px, transparent 1px)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
          {/* Animated Icon box */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.05)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500"
          >
            <FaBriefcase className="text-3xl" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            {t('gate.careerTitle', 'Career Mode')}
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t('gate.careerDesc', 'I am a recruiter, hiring manager, or employer looking to review Ali\'s full-time employment, resume, and qualifications.')}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('job');
            }}
            className="px-8 py-3.5 bg-zinc-900 hover:bg-blue-600 text-white rounded-full font-semibold border border-zinc-800 hover:border-blue-500/40 shadow-xl transition-all duration-300 hover:scale-[1.03] group-hover:bg-blue-600 group-hover:border-blue-500/40"
          >
            {t('gate.careerCTA', 'Enter Career Portfolio')}
          </button>
        </div>
      </motion.div>

      {/* Right Column: Freelance Path */}
      <motion.div
        onHoverStart={() => setHoveredPanel('freelance')}
        onHoverEnd={() => setHoveredPanel(null)}
        onClick={() => handleSelect('freelance')}
        animate={{
          flex: hoveredPanel === 'freelance' ? 1.3 : hoveredPanel === 'job' ? 0.7 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className="relative flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 cursor-pointer bg-zinc-950 transition-colors duration-500 group overflow-hidden"
      >
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-zinc-900 to-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Animated grid lines background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-[size:32px_32px]"
          style={{ backgroundImage: 'radial-gradient(var(--grid-dots) 1px, transparent 1px)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
          {/* Animated Icon box */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.05)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-500"
          >
            <FaRocket className="text-3xl" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            {t('gate.freelanceTitle', 'Freelance Studio')}
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t('gate.freelanceDesc', 'I am a client, founder, or project stakeholder looking to hire Ali on contract to build an MVP, automation, or custom software.')}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('freelance');
            }}
            className="px-8 py-3.5 bg-zinc-900 hover:bg-emerald-600 text-white rounded-full font-semibold border border-zinc-800 hover:border-emerald-500/40 shadow-xl transition-all duration-300 hover:scale-[1.03] group-hover:bg-emerald-600 group-hover:border-emerald-500/40"
          >
            {t('gate.freelanceCTA', 'Enter Freelance Studio')}
          </button>
        </div>
      </motion.div>

      {/* Floating Center OR badge */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">OR</span>
        </div>
      </div>
    </div>
  );
};

export default SplitLandingGate;
