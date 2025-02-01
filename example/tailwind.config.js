/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      interFontFeatures: {
        numeric: ['tnum', 'salt', 'ss02'],
        case: ['case'],
        fractions: ['frac'],
        'stylistic-one': ['ss01'],
      }
    },
  },
  plugins: [require('../src/index.js')],
}
