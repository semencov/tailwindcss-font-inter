module.exports = {
    theme: {
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1em',
            lg: '125%',
            xl: '1ex',
            xl2: '13px',
            '2xl': '1.5rem',
            '3xl': '3cm',
            '4xl': '2.25ch',
            '5xl': '3rem',
            '6xl': '4rem'
        },
        extend: {
            interFontFeatures: {
                default: ['liga', 'kern'],
                numeric: ['tnum', 'salt'],
                disambiguation: ['ss02'],
                capital: ['csps']
            }
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
