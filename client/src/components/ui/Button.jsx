import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-linear-to-br from-primary to-primary-dim text-white shadow-xl shadow-primary/20 hover:opacity-90",
    secondary: "bg-white text-primary border border-primary/20 hover:bg-surface-container-low shadow-sm",
    outline: "bg-transparent border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-high",
    danger: "bg-linear-to-br from-red-600 to-red-800 text-white shadow-xl shadow-red-500/20 hover:opacity-90",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-lg",
    md: "px-6 py-3.5 text-xs rounded-xl",
    lg: "px-10 py-5 text-sm rounded-2xl",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
