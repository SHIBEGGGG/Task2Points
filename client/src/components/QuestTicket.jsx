import { motion } from 'framer-motion';

// The signature visual element of the app: a task rendered as a torn ticket
// stub. `stub` is the small left panel (icon + type label), `children` is
// the ticket body. `stamp` optionally overlays a rotated APPROVED/REJECTED/
// PENDING mark - the animation plays once when the ticket first mounts with
// a stamp, giving that "thunk" of a rubber stamp hitting paper.
export default function QuestTicket({ icon, typeLabel, xpValue, locked, stamp, children }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`quest-ticket ${locked ? 'quest-ticket--locked' : ''}`}
    >
      <div className="quest-ticket__stub">
        <span className="text-2xl">{icon}</span>
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
