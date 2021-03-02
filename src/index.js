const { toPx } = require('./utils');
const Inter = require('../inter.json');

const isPlainObject = val => !!val && typeof val === 'object' && val.constructor === Object;
const isArrayLike = obj => obj != null && typeof obj[Symbol.iterator] === 'function';
const isBoolean = val => typeof val === 'boolean';
const isString = val => typeof val === 'string';
const entries = obj => Object.keys(obj).map(key => [key, obj[key]]);
const fromEntries = iterable =>
    [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
    }, {});
const mapObject = (obj, cb) => fromEntries((Array.isArray(obj) ? obj : entries(obj)).map(val => cb(...val)));
const filterObject = (obj, cb) => fromEntries((Array.isArray(obj) ? obj : entries(obj)).filter(val => cb(...val)));
const defaults = (obj, ...defs) => Object.assign({}, obj, ...defs.reverse(), obj);
const round = (num, prec = 3) => parseFloat(num.toFixed(prec));
const unquote = str => str.replace(/^['"]|['"]$/g, '').trim();
const tracking = (fontSize, a, b, c) => a + b * Math.pow(Math.E, c * fontSize);

const normalizeEntry = (key, value) => {
    value = isBoolean(value) ? '' + 1 * value : '' + value;
    value = value !== '1' && value !== 'undefined' ? value : '1';

    return [unquote(key), value];
};

const generateFeatures = (features, available) => {
    if (isPlainObject(features)) {
        features = mapObject(features, (key, value = '1') => normalizeEntry(key, value));
    } else {
        if (isString(features)) {
            features = fromEntries(features.split(',').map(f => f.trim().split(' ')));
        }

        features = fromEntries(
            features.map(feature => {
                let key, value;

                if (isString(feature)) {
                    [key, value = '1'] = feature.replace(/\s\s+/g, ' ').split(' ', 2);
                } else if (isArrayLike(feature)) {
                    [key, value = '1'] = feature;
                } else if (isPlainObject(feature)) {
                    [key, value = '1'] = entries(feature)[0];
                }

                return normalizeEntry(key, value);
            })
        );
    }

    features = filterObject(features, key => available.includes(key));

    return entries(features)
        .map(([key, value]) => `"${key}" ${value}`)
        .filter(val => !!val)
        .sort()
        .join(', ')
        .trim();
};

module.exports = function (options = {}) {
    return ({ addBase, addUtilities, variants, e, theme }) => {
        const { availableFeatures, utilities, base } = Inter;

        const defaultConfig = defaults(options, {
            a: -0.0223,
            b: 0.185,
            c: -0.1745,
            baseFontSize: 16,
            importFontFace: true
        });

        const defaultFontFeaturesTheme = { default: ['calt', 'kern'] };
        const defaultFontSizeVariants = ['responsive'];

        const fontSizeTheme = theme('fontSize', []);
        const fontSizeVariants = variants('fontSize', defaultFontSizeVariants);
        const fontFeaturesTheme = theme('interFontFeatures', defaultFontFeaturesTheme);

        const fontFeatures = defaults(fontFeaturesTheme, defaultFontFeaturesTheme);
        const baseStyles = {
            ...(defaultConfig.importFontFace ? base : {})
        };

        const fontSizeStyles = (fontSize, { a, b, c }) => {
            const size = isArrayLike(fontSize) ? fontSize[0] : fontSize;
            const sizeInPx = toPx(size, defaultConfig.baseFontSize);
            const trackingSize = tracking(sizeInPx, a, b, c);

            return {
                fontSize: size,
                letterSpacing: `${round(trackingSize, 7)}em`
            };
        };

        const fontFeatureStyles = value => {
            return value.length ? { fontFeatureSettings: Array.isArray(value) ? value.join(', ') : value } : null;
        };

        const fontFeatureUtilities = {
            ...{
                '.font-inter .font-feature-normal, .font-inter.font-feature-normal': {
                    ...fontFeatureStyles('normal')
                }
            },
            ...mapObject(fontFeatures, (modifier, value) => {
                const features = generateFeatures(value, availableFeatures);

                return [
                    `.font-inter .${e(`font-feature-${modifier}`)},.font-inter.${e(`font-feature-${modifier}`)}`,
                    {
                        ...fontFeatureStyles(features)
                    }
                ];
            })
        };

        const fontSizeUtilities = mapObject(fontSizeTheme, (modifier, value) => {
            const { a, b, c } = defaultConfig;

            return [
                `.font-inter .${e(`text-${modifier}`)}, .font-inter.${e(`text-${modifier}`)}`,
                {
                    ...fontSizeStyles(value, { a, b, c })
                }
            ];
        });

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
