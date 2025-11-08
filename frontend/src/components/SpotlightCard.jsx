import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(34, 211, 238, 0.15)",
  borderColor = "rgba(255, 255, 255, 0.1)",
  glowColor = "rgba(34, 211, 238, 0.3)",
  enableHover = true,
  enableGlow = true,
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused || !enableHover) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.8);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setOpacity(0.8);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={enableHover ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl overflow-hidden p-8 ${className}`}
      style={{
        borderColor: borderColor,
        boxShadow: enableGlow && isHovered 
          ? `0 20px 40px -20px ${glowColor}, 0 0 0 1px ${borderColor}`
          : `0 0 0 1px ${borderColor}`,
      }}
    >
      {/* Animated Border Glow */}
      {enableGlow && (
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
            scale: isHovered ? [1, 1.02, 1] : 1,
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${glowColor}, transparent)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Main Spotlight Effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />

      {/* Additional Glow Layers */}
      {enableHover && (
        <>
          {/* Secondary Glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            animate={{
              opacity: isHovered ? 0.4 : 0,
            }}
            style={{
              background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.1), transparent 50%)`,
            }}
          />

          {/* Pulse Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            animate={{
              opacity: isHovered ? [0, 0.2, 0] : 0,
              scale: isHovered ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            style={{
              background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
            }}
          />
        </>
      )}

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-tl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-br-3xl pointer-events-none" />
    </motion.div>
  );
};

export default SpotlightCard;