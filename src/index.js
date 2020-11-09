const _ = require('lodash');
const { toPx } = require('./utils');
const Inter = require('../inter.json');

const mapObject = (obj, cb) => _.fromPairs(_.toPairs(obj).map(val => cb(...val)));
const filterObject = (obj, cb) => _.fromPairs(_.toPairs(obj).filter(val => cb(...val)));
const round = (num, prec = 3) => parseFloat(num.toFixed(prec));
const unquote = str => str.replace(/^['"]|['"]$/g, '').trim();
const tracking = (fontSize, a, b, c) => a + b * Math.pow(Math.E, c * fontSize);

const normalizeEntry = (key, value) => {
    value = _.isBoolean(value) ? '' + 1 * value : '' + value;
    value = value !== '1' && value !== 'undefined' ? value : '1';

    return [unquote(key), value];
};

const generateFeatures = (features, available) => {
    if (_.isPlainObject(features)) {
        features = mapObject(features, (key, value = '1') => normalizeEntry(key, value));
    } else {
        if (_.isString(features)) {
            features = _.fromPairs(features.split(',').map(f => f.trim().split(' ')));
        }

        features = _.fromPairs(
            features.map(feature => {
                let key, value;

                if (_.isString(feature)) {
                    [key, value = '1'] = feature.replace(/\s\s+/g, ' ').split(' ', 2);
                } else if (_.isArrayLike(feature)) {
                    [key, value = '1'] = feature;
                } else if (_.isPlainObject(feature)) {
                    [key, value = '1'] = _.toPairs(feature)[0];
                }

                return normalizeEntry(key, value);
            })
        );
    }

    features = filterObject(features, key => available.includes(key));

    return _.toPairs(features)
        .map(([key, value]) => `"${key}" ${value}`)
        .filter(val => !!val)
        .sort()
        .join(', ')
        .trim();
};

module.exports = function (options = {}) {
    return ({ addBase, addUtilities, variants, e, theme }) => {
        const { availableFeatures, utilities, base } = Inter;

        const defaultConfig = _.defaults(options, {
            a: -0.0223,
            b: 0.185,
            c: -0.1745,
            baseFontSize: 16,
            importFontFace: false
        });

        const defaultFontFeaturesTheme = { default: ['calt', 'kern'] };
        const defaultFontSizeVariants = ['responsive'];

        const fontSizeTheme = theme('fontSize', []);
        const fontSizeVariants = variants('fontSize', defaultFontSizeVariants);
        const fontFeaturesTheme = theme('interFontFeatures', defaultFontFeaturesTheme);

        const fontFeatures = {
            ...defaultFontFeaturesTheme,
            ...fontFeaturesTheme
        };
        const baseStyles = {
            ...(defaultConfig.importFontFace ? base : {})
        };

        const fontSizeStyles = (fontSize, { a, b, c }) => {
            const sizeInPx = toPx(fontSize, defaultConfig.baseFontSize);
            const trackingSize = tracking(sizeInPx, a, b, c);

            return {
                fontSize,
                letterSpacing: `${round(trackingSize, 7)}em`
            };
        };

        const fontFeatureStyles = value => {
            return {
                fontFeatureSettings: _.isArray(value) ? value.join(', ') : value
            };
        };

        const fontFeatureUtilities = _.fromPairs(
            _.chain(fontFeatures)
                .map((value, modifier) => {
                    const features = generateFeatures(value, availableFeatures);
                    if (!features.length) return [null];

                    return [
                        `.font-inter .${e(`font-feature-${modifier}`)}, .font-inter.${e(`font-feature-${modifier}`)}`,
                        {
                            ...fontFeatureStyles(features)
                        }
                    ];
                })
                .filter(([key]) => key !== null)
                .value()
        );

        const fontSizeUtilities = _.fromPairs(
            _.map(fontSizeTheme, (value, modifier) => {
                const { a, b, c } = defaultConfig;

                return [
                    `.font-inter .${e(`text-${modifier}`)}, .font-inter.${e(`text-${modifier}`)}`,
                    {
                        ...fontSizeStyles(value, { a, b, c })
                    }
                ];
            })
        );

        // Add @font-face if importFontFace: true
        // see https://rsms.me/inter/inter.css
        addBase(baseStyles);

        // Add .font-inter
        addUtilities(utilities);

        // Add .font-feature-{modifier} utility classes
        addUtilities(fontFeatureUtilities);

        // Add .font-inter.text-{size} utility classes
        addUtilities(fontSizeUtilities, fontSizeVariants);
    };
};
