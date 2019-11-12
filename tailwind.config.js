module.exports = {
  theme: {
    extend: {
      interFontFeatures: {
        default: ['liga', 'kern'],
        numeric: ['tnum', 'salt'],
        disambiguation: ['ss02'],
        capital: ['csps']
      },
    },
  },
  variants: {},
  plugins: [require('./src/index.js')({
    importFontFace: true,
    disableUnusedFeatures: false
  })],
};
