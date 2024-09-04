// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: '#854d0e',
        darkbrown: '#422006',
        beigelight: '#F5F5DC', // Light beige
        beige: '#D2B48C',       // Normal beige
        beigedark: '#A67B5B',  // Dark beige
        grey: '#E4E4E7',
        yellow: '#fefce8',
        1 : '#f8fafc',
        2 : '#f1f5f9',
        3 : '#e2e8f0',
        4 : '#cbd5e1',
        5 : '#94a3b8',
        6 : '#64748b',
        7 : '#475569',
        8 : '#334155',
        9 : '#1e293b',
        10: '#0f172a',
        11: '#020617'
      },
    },
  },
  plugins: [],
};
