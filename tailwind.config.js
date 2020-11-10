module.exports = {
    theme: {
        interFontFeatures: {
            numeric: ['tnum', 'salt', 'ss02'],
            disambiguation: ['ss02'],
            capital: ['cpsps']
        }
    },
    variants: {},
    plugins: [
        require('./src/index.js')({
            importFontFace: true,
            disableUnusedFeatures: false
        })
    ]
};
