"use client";

import { useScroll, motion } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[9999] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default ScrollProgress;
