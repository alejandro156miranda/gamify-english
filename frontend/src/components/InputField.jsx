import React from 'react';
import { motion } from 'framer-motion';

export default function InputField({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium">{label}</label>
      <motion.input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        whileFocus={{ scale: 1.02, borderColor: '#5A67D8' }}
        transition={{ duration: 0.2 }}
        className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none"
      />
    </div>
  );
}
