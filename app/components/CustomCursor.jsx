"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, select, label');
      setIsHovering(!!target);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isVisible]);

  return (
    <>
      {/* Trailing ring — slower spring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border border-accent/50 hidden md:block"
        style={{ width: 36, height: 36, top: -18, left: -18 }}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: isHovering ? 1.7 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.6 }}
      />
      {/* Inner dot — snaps fast */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-accent hidden md:block"
        style={{ width: 8, height: 8, top: -4, left: -4 }}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: isHovering ? 0.4 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 35, mass: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;
