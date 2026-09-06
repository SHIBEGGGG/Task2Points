import { motion } from 'framer-motion';
import IconBadge from './IconBadge.jsx';

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
          unlocked ? 'border-gold/40' : 'opacity-45 grayscale'
        }`}
      >
        <div className="w-9 h-9 rounded-full border-2 border-gold/50 flex items-center justify-center text-gold shrink-0">
          {unlocked ? <IconBadge name={icon} /> : <IconBadge name="shield" />}
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