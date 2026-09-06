import { motion } from 'framer-motion';

const SPRITES = {
  target: ['..XXXX..', '.X....X.', 'X.X..X.X', 'X.XXXX.X', 'X.X..X.X', 'X.X..X.X', '.X....X.', '..XXXX..'],
  star: ['...XX...', '...XX...', '..XXXX..', '.XXXXXX.', 'XXXXXXXX', '..XXXX..', '.XX..XX.', 'X......X'],
  medal: ['..XXXX..', '.XXXXXX.', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', '.XXXXXX.', '..X..X..', '.X....X.'],
  dumbbell: ['XX....XX', 'XX....XX', 'XX....XX', 'XXXXXXXX', 'XXXXXXXX', 'XX....XX', 'XX....XX', 'XX....XX'],
  book: ['XX....XX', 'XXX..XXX', 'XXXXXXXX', 'XX.XX.XX', 'XX.XX.XX', 'XXXXXXXX', 'XXX..XXX', 'XX....XX'],
  flame: ['...X....', '..XXX...', '.XXXXX..', 'XXXXXXX.', 'XXXXXXX.', '.XXXXX..', '..XXX...', '...X....'],
  crown: ['X.X..X.X', 'XXXXXXXX', '.XXXXXX.', '.XXXXXX.', '.XXXXXX.', '.XXXXXX.', 'XXXXXXXX', 'XXXXXXXX'],
  trophy: ['.XXXXXX.', 'XXXXXXXX', 'XXXXXXXX', '.XXXXXX.', '...XX...', '...XX...', '..XXXX..', '.XXXXXX.'],
  shield: ['XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', '.XXXXXX.', '.XXXXXX.', '..XXXX..', '...XX...'],
  quiz: ['.XXXXXX.', 'X......X', '......XX', '.....XX.', '....XX..', '....XX..', '........', '....XX..'],
  photo: ['XX....XX', 'XXXXXXXX', 'X.XXXX.X', 'X.X..X.X', 'X.X..X.X', 'X.XXXX.X', 'XX....XX', 'XXXXXXXX'],
};

export default function PixelIcon({ name, size = 40, animate = true, className = '' }) {
  const sprite = SPRITES[name];

  if (!sprite) {
    return <span style={{ fontSize: size * 0.6 }}>{name}</span>;
  }

  const cols = sprite[0].length;
  const rows = sprite.length;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      className={className}
      animate={animate ? { y: [0, -2, 0] } : undefined}
      transition={animate ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
      style={animate ? { filter: 'drop-shadow(0 0 5px currentColor)' } : undefined}
    >
      {sprite.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === 'X' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null
        )
      )}
    </motion.svg>
  );
}