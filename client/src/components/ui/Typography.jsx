import React from 'react';
import { motion } from 'framer-motion';

export const Heading = ({ children, level = 1, className = '', animate = true }) => {
  const levels = {
    1: "text-6xl font-extrabold tracking-tight",
    2: "text-4xl font-extrabold tracking-tight",
    3: "text-2xl font-bold tracking-tight",
    4: "text-xl font-bold tracking-tight",
  };

  const Component = `h${level}`;
  
  if (animate) {
    return (
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${levels[level]} text-on-surface ${className}`}
      >
        {children}
      </motion.h1>
    );
  }

  return <Component className={`${levels[level]} text-on-surface ${className}`}>{children}</Component>;
};

export const Text = ({ children, variant = 'body', className = '' }) => {
  const variants = {
    body: "text-lg text-on-surface-variant leading-relaxed",
    small: "text-sm text-on-surface-variant font-medium",
    label: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant",
    detail: "text-xs text-on-surface-variant font-medium",
  };

  return <p className={`${variants[variant]} ${className}`}>{children}</p>;
};
