import { motion } from 'framer-motion';

// pulse={true} triggers the glow-pulse animation, used right after a level-up.
export default function LevelBadge({ level, pulse = false }) {
  return (
    <motion.div
      className={`level-badge ${pulse ? 'animate-pulseglow' : ''}`}
      initial={pulse ? { scale: 0.6, rotate: -20 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 12 }}
    >
      {level}
    </motion.div>
  );
}
