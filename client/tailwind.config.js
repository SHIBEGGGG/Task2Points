/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F2226', // main background - deep ink-teal
          panel: '#0A1719',    // nav / darker panels
          light: '#1A3338',    // raised surfaces on dark bg
        },
        parchment: {
          DEFAULT: '#F3ECDA', // ticket card surface
          dim: '#E4DAC0',      // locked / secondary ticket surface
          text: '#241C10',      // ink text on parchment
        },
        gold: {
          DEFAULT: '#E8B23D', // XP / primary accent
          deep: '#B8862A',
          glow: '#FFD873',
        },
        coral: {
          DEFAULT: '#E1573F', // locked / reject / streak-break
          deep: '#B33F2C',
        },
        sage: {
          DEFAULT: '#5B9279', // approved / success
          deep: '#3F6E58',
        },
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(2.2) rotate(-18deg)', opacity: '0' },
          '60%': { transform: 'scale(0.92) rotate(-12deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseglow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,178,61,0.55)' },
          '50%': { boxShadow: '0 0 0 10px rgba(232,178,61,0)' },
        },
        floatup: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
      },
      animation: {
        stamp: 'stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        shimmer: 'shimmer 2.2s linear infinite',
        pulseglow: 'pulseglow 2s ease-out infinite',
        floatup: 'floatup 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
