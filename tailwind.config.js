module.exports = {
  theme: {
    extend: {
      interFontFeatures: {
        default: ['calt', 'liga', 'kern'],
        numeric: ['tnum', 'salt', 'ss02']
      },
    },
  },
  variants: {},
  plugins: [require('./src/index.js')({
    importFontFace: true,
    disableUnusedFeatures: false
  })],
};
