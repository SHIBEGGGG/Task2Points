const GLYPHS = {
  quiz: <path d="M4 6c3-1.5 6-1.5 8 0.5 2-2 5-2 8-0.5v11c-3-1.5-6-1.5-8 0.5-2-2-5-2-8-0.5V6z" />,
  photo: (
    <>
      <path d="M8 7l1.2-2h5.6L16 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  star: <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3z" />,
  medal: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13l-2 8 5-3 5 3-2-8" />
    </>
  ),
  dumbbell: (
    <>
      <rect x="2" y="9" width="4" height="6" rx="1" />
      <rect x="18" y="9" width="4" height="6" rx="1" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </>
  ),
  book: (
    <>
      <path d="M12 6c-2.2-1.7-5-1.7-8-0.8v12c3-0.9 5.8-0.9 8 0.8 2.2-1.7 5-1.7 8-0.8V5.2c-3-0.9-5.8-0.9-8 0.8z" />
      <line x1="12" y1="6" x2="12" y2="18" />
    </>
  ),
  flame: <path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-2-1-3-1-3s2 1.2 2 4.2A5 5 0 0 1 6 12c0-5 4-6.5 3-10z" />,
  crown: <path d="M4 18h16l-1.4-8-3.8 3-2.8-5-2.8 5-3.8-3L4 18z" />,
  trophy: (
    <>
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5.5A2.5 2.5 0 0 0 8 7.5" />
      <path d="M16 5h2.5A2.5 2.5 0 0 1 16 7.5" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </>
  ),
  shield: <path d="M12 2.5l7 2.8v5.8c0 5-3.4 8.3-7 9.9-3.6-1.6-7-4.9-7-9.9V5.3l7-2.8z" />,
};

export default function IconBadge({ name, className = '', size = 'text-2xl' }) {
  const glyph = GLYPHS[name];

  if (!glyph) {
    return <span className={size}>{name}</span>;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-6 h-6 ${className}`}
    >
      {glyph}
    </svg>
  );
}