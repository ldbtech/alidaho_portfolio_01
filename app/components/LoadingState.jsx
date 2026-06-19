"use client";

import { motion } from "framer-motion";

const LoadingState = ({ message = "Syncing portfolio..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-6 w-full min-h-[300px]">
      {/* Dynamic Orbital Rings Loader */}
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute w-16 h-16 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-indigo-500/80 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="absolute w-11 h-11 rounded-full border-[2.5px] border-transparent border-b-purple-500 border-l-pink-500/80 shadow-[0_0_10px_rgba(139,92,246,0.15)]"
        />
        {/* Glowing Center Core */}
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
        />
      </div>

      {/* Loading Message */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-1.5"
      >
        <span className="text-sm font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800 dark:from-zinc-200 dark:to-zinc-400 uppercase">
          {message}
        </span>
        <span className="text-[10px] text-tertiary uppercase tracking-widest font-bold opacity-60 animate-pulse">
          Please wait
        </span>
      </motion.div>
    </div>
  );
};

export default LoadingState;
