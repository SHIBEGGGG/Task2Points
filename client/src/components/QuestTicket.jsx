import { motion } from 'framer-motion';
import IconBadge from './IconBadge.jsx';

export default function QuestTicket({ iconName, typeLabel, xpValue, locked, stamp, children }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`quest-ticket ${locked ? 'quest-ticket--locked' : ''}`}
    >
      <div className="quest-ticket__stub">
        <IconBadge name={iconName} className="text-parchment" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-center leading-tight">
          {typeLabel}
        </span>
        <span className="font-display text-gold text-sm mt-1">+{xpValue}</span>
      </div>

      <div className="quest-ticket__seam" />

      <div className="quest-ticket__body">
        {children}
        {stamp && (
          <span
            key={stamp}
            className={`stamp animate-stamp stamp--${stamp === 'APPROVED' || stamp === 'COMPLETED' ? 'approved' : stamp === 'REJECTED' ? 'rejected' : 'pending'}`}
          >
            {stamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}