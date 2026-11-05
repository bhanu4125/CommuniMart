import React from 'react';
import { motion } from 'framer-motion';

export const ActiveTabPill: React.FC = () => {
  return (
    <motion.div
      layoutId="activeTabBadge"
      className="absolute inset-0 bg-teal-600/10 dark:bg-teal-400/10 rounded-2xl -z-10"
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
    />
  );
};
