const _ = require("lodash");
const parseUnit = require('parse-unit');
const toPx = require('to-px');
const Inter = require("../inter.json");

const mapObject = (obj, cb) => _.fromPairs(_.toPairs(obj).map(val => cb(...val)));
const filterObject = (obj, cb) =>
  _.fromPairs(_.toPairs(obj).filter(val => cb(...val)));
const round = (num, prec = 3) => parseFloat(num.toFixed(prec));
const unquote = str => str.replace(/^['"]|['"]$/g, "").trim();

const leading = (fontSize, lineHeight = 1.5) => Math.round(fontSize * lineHeight);
const tracking = (fontSize, a, b, c) => a + b * Math.pow(Math.E, c * fontSize);

const normalizeEntry = (key, value) => {
  value = _.isBoolean(value) ? "" + 1 * value : "" + value;
  value = value !== "1" && value !== "undefined" ? value : "1";

  return [unquote(key), value];
}

const generateFeatures = (features, available, config) => {
  const { disableUnusedFeatures = false } = config;

  if (!_.isPlainObject(features)) {
    if (_.isString(features)) {
      features = _.fromPairs(features.split(",").map(f => f.trim().split(" ")));
    }

    features = _.fromPairs(
      features.map(feature => {
        let key, value;

        if (_.isString(feature)) {
          [key, value = "1"] = feature.replace(/\s\s+/g, " ").split(" ", 2);
        } else if (_.isArrayLike(feature)) {
          [key, value = "1"] = feature;
        } else if (_.isPlainObject(feature)) {
          [key, value = "1"] = _.toPairs(feature)[0];
        }

        return normalizeEntry(key, value);
      })
    );
  } else {
    features = mapObject(features, (key, value = "1") =>
      normalizeEntry(key, value)
    );
  }

  features = filterObject(features, key => available.includes(key));

  if (!!disableUnusedFeatures) {
    let available = _.fromPairs(available.map(val => [val, "0"]));
    features = _.defaults(features, available);
  }

  return _.toPairs(features)
    .map(([key, value]) => `"${key}" ${value}`)
    .filter(val => !!val)
    .sort()
    .join(", ")
    .trim();
}

module.exports = function(options = {}) {
  return ({ addBase, addUtilities, variants, e, theme }) => {
    const { availableFeatures, utilities, base } = Inter;

    const defaultConfig = _.defaults(options, {
      a: -0.0223,
      b: 0.185,
      c: -0.1745,
      baseFontSize: 16,
      importFontFace: false
    });

    const defaultFontFeaturesTheme = { default: "normal" };
    const defaultFontSizeTheme = {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    };
    const defaultFontSizeVariants = ['responsive'];
    const defaultLineHeightTheme = {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    };

    const fontFeaturesTheme = theme("interFontFeatures", defaultFontFeaturesTheme);
    const fontSizeTheme = theme("fontSize", defaultFontSizeTheme);
    const lineHeightTheme = theme("lineHeight", defaultLineHeightTheme);
    const fontSizeVariants = variants("fontSize", defaultFontSizeVariants);

    const defaultLineHeight = _.defaults({}, lineHeightTheme, defaultLineHeightTheme).normal;

    const baseStyles = {
      ...(defaultConfig.importFontFace ? base : {})
    };

    const fontSizeStyles = (fontSize, lineHeight, { a, b, c }) => {
      let [, unit] = parseUnit(value);

      let tracking = tracking(fontSize, a, b, c);
      let leading = leading(fontSize, lineHeight);

      return {
        fontSize,
        letterSpacing: `${round(tracking)}em`,
        lineHeight: round(leading)
      };
    };

    const fontFeatureStyles = value => {
      return {
        fontFeatureSettings: _.isArray(value) ? value.join(", ") : value
      };
    };

    const fontFeatureUtilities = _.fromPairs(
      _.map(fontFeaturesTheme, (value, modifier) => {
        let features = generateFeatures(value, availableFeatures, defaultConfig);

        return [
          `.${e(`font-feature-${modifier}`)}`,
          {
            ...fontFeatureStyles(features)
          }
        ];
      })
    );

    const fontSizeUtilities = _.fromPairs(
      _.map(fontSizeTheme, (value, modifier) => {
        const { a, b, c } = defaultConfig;

        return [
          `.${e(`text-inter-${modifier}`)}`,
          {
            ...fontSizeStyles(value, defaultLineHeight, {a, b, c})
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

    // Add .text-inter-{size} utility classes
    addUtilities(fontSizeUtilities, fontSizeVariants);
  };
};
