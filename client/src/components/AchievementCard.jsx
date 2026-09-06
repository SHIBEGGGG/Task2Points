import { motion } from 'framer-motion';
import PixelIcon from './PixelIcon.jsx';

export default function AchievementCard({ icon, name, description, unlocked, unlockedAt, justUnlocked }) {
  return (
    <motion.div
      className="relative [perspective:800px]"
      initial={justUnlocked ? { rotateY: 180 } : false}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div
        className={`panel flex items-start gap-3 transition-opacity ${
          unlocked ? 'border-gold/40' : 'opacity-40 grayscale'
        }`}
      >
        <div className="text-gold shrink-0">
          <PixelIcon name={unlocked ? icon : 'shield'} size={36} animate={unlocked} />
        </div>
        <div>
          <h3 className="font-display text-base tracking-wide">{name}</h3>
          <p className="text-sm text-parchment/70">{description}</p>
          {unlocked && unlockedAt && (
            <p className="font-mono text-[11px] text-gold/80 mt-1">
              UNLOCKED {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}