import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// A liquid-gold progress bar with a shimmer sweep and an animated width
// transition. `xpIntoLevel` / `xpForNextLevel` come straight from the
// backend's level calculation (server/src/utils/level.js).
export default function XPBar({ xpIntoLevel, xpForNextLevel, level }) {
  const [displayedXp, setDisplayedXp] = useState(0);
  const percent = xpForNextLevel > 0 ? Math.min(100, (xpIntoLevel / xpForNextLevel) * 100) : 100;

  // Count the number up rather than snapping straight to the new value -
  // small touch, but it's what makes gaining XP feel like it landed.
  useEffect(() => {
    const start = displayedXp;
    const end = xpIntoLevel;
    const duration = 600;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      setDisplayedXp(Math.round(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xpIntoLevel]);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-mono text-xs text-parchment/70">LEVEL {level}</span>
        <span className="font-mono text-xs text-gold">
          {displayedXp} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="xp-track">
        <motion.div
          className="xp-fill animate-shimmer"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
