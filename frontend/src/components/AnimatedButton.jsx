import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedButton({ children, onClick, className, type = 'button' }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`${className} font-semibold shadow-md rounded-lg`}
    >
      {children}
    </motion.button>
  );
}
