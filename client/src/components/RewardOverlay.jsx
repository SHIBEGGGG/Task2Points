import { AnimatePresence, motion } from 'framer-motion';
import LevelBadge from './LevelBadge.jsx';

export default function RewardOverlay({ newAchievements = [], newLevel = null, onDismissAchievement, onDismissLevelUp }) {
  return (
    <>
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {newAchievements.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: 40, rotateY: 180 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="pointer-events-auto panel !bg-ink-light border-gold/50 flex items-center gap-3 w-72 cursor-pointer shadow-lg"
              onClick={() => onDismissAchievement?.(a.id)}
            >
              <span className="text-3xl">{a.icon}</span>
              <div>
                <p className="font-mono text-[10px] text-gold uppercase tracking-widest">Achievement Unlocked</p>
                <p className="font-semibold text-sm">{a.name}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {newLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm cursor-pointer"
            onClick={onDismissLevelUp}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="text-center"
            >
              <p className="font-mono text-sm text-gold tracking-[0.3em] mb-4">LEVEL UP</p>
              <div className="scale-[2.2] mb-8">
                <LevelBadge level={newLevel} pulse />
              </div>
              <p className="text-parchment/70 text-sm">Tap anywhere to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}