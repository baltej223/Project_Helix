import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, padding = 'p-8', ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
      className={`bg-white rounded-3xl border border-surface-container-high shadow-sm ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
