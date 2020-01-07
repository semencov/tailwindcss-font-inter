const { defaults, toPairs, fromPairs, flatMap } = require("lodash");
const inter = require("../inter.json");

/**
 * Helpers
 */
const isString = val => typeof val === "string";
const isPlainObject = val =>
  !!val && typeof val === "object" && val.constructor === Object;
const isArrayLike = obj =>
  obj != null && typeof obj[Symbol.iterator] === "function";
const isEmpty = val => val == null || !(Object.keys(val) || val).length;
const mapObject = (obj, cb) => fromPairs(toPairs(obj).map(val => cb(...val)));
const filterObject = (obj, cb) =>
  fromPairs(toPairs(obj).filter(val => cb(...val)));
const round = (num, prec = 3) => parseFloat(num.toFixed(prec));
const unquote = str => str.replace(/^['"]|['"]$/g, "").trim();

const unitsDefaults = (baseFontSize = 16) => ({
  ch: 8,
  ex: 7.15625,
  em: baseFontSize,
  rem: baseFontSize,
  "%": baseFontSize / 100,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  px: 1
});

/**
 * Parses CSS size/length value
 *
 * @param {any} value   Any CSS size value with units
 * @param {Number} lineHeight  Relative line height
 *
 * @return {Array}
 */
function parseUnit(value) {
  let str = String(value);
  return [parseFloat(str, 10), str.match(/[\d.\-\+]*\s*(.*)/)[1] || ""];
}

function getUnitConverter(baseFontSize = 16) {
  const defaults = unitsDefaults(baseFontSize);

  return function toPX(str) {
    if (isEmpty(str)) return 0;
    if (defaults[str]) return defaults[str];

    let [value, unit] = parseUnit(str);

    if (!isNaN(value) && unit) {
      let px = toPX(unit);
      return typeof px === "number" ? value * px : 0;
    }

    return 0;
  };
}

/**
 * Calculates line height
 *
 * @param {Number} fontSize    Font size in pixels
 * @param {Number} lineHeight  Relative line height
 *
 * @return {Number}
 */
function calcLeading(fontSize, lineHeight = 1.5) {
  return Math.round(fontSize * lineHeight);
}

/**
 * Calculates letter spacing
 *
 * @param {Number} fontSize  Font size in pixels
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 *
 * @return {Number}
 */
function calcTracking(fontSize, a = -0.0223, b = 0.185, c = -0.1745) {
  return a + b * Math.pow(Math.E, c * fontSize);
}

/**
 * Formats CSS selector
 *
 * @param {String} selector CSS selector
 * @param {String} modifier
 *
 * @return {String}
 */
function fontInterSelector(selector, modifier = null) {
  return modifier
    ? `${modifier} ${selector}, ${selector} ${modifier}, ${modifier}${selector}`
    : selector;
}

/**
 * Generates Inter's font sizing utilities
 *
 * @param {String} selector     CSS selector
 * @param {Number} fontSize     Font size
 * @param {Number} lineHeight   Line height
 * @param {Object} constants    Dynamic Metrics constants
 *
 * @return {Array}
 */
function fontSizeRule(selector, fontSize, lineHeight, { a, b, c }) {
  let tracking = calcTracking(fontSize, a, b, c);
  let leading = calcLeading(fontSize, lineHeight);

  return [
    selector,
    {
      "font-size": typeof fontSize !== "string" ? `${fontSize}px` : fontSize,
      "letter-spacing": `${round(tracking)}em`,
      "line-height": `${round(leading)}px`
    }
  ];
}

function normalizeEntry(key, value) {
  value = typeof value === "boolean" ? "" + 1 * value : "" + value;
  value = value !== "1" && value !== "undefined" ? value : "1";

  return [unquote(key), value];
}

function generateFeatures(
  features,
  availableFeatures,
  { disableUnusedFeatures = false }
) {
  let settings = [];

  if (!isPlainObject(features)) {
    if (isString(features)) {
      features = fromPairs(features.split(",").map(f => f.trim().split(" ")));
    }

    features = fromPairs(
      features.map(feature => {
        let key, value;

        if (isString(feature)) {
          [key, value = "1"] = feature.replace(/\s\s+/g, " ").split(" ", 2);
        } else if (isArrayLike(feature)) {
          [key, value = "1"] = feature;
        } else if (isPlainObject(feature)) {
          [key, value = "1"] = toPairs(feature)[0];
        }

        return normalizeEntry(key, value);
      })
    );
  } else {
    features = mapObject(features, (key, value = "1") =>
      normalizeEntry(key, value)
    );
  }

  features = filterObject(features, key => availableFeatures.includes(key));

  if (!!disableUnusedFeatures) {
    let available = fromPairs(availableFeatures.map(val => [val, "0"]));
    features = defaults(features, available);
  }

  return toPairs(features)
    .map(([key, value]) => `"${key}" ${value}`)
    .filter(val => !!val)
    .sort()
    .join(", ")
    .trim();
}

module.exports = (opts = {}) => {
  const options = defaults(opts, {
    a: -0.0223,
    b: 0.185,
    c: -0.1745,
    baseFontSize: 16,
    baseLineHeight: 1.5, // as in preflight.css
    importFontFace: false,
    disableUnusedFeatures: false
  });

  return ({ addBase, addUtilities, variants, e, theme }) => {
    let { availableFeatures, utilities, base } = inter;

    // Add @font-face if importFontFace: true
    // see https://rsms.me/inter/inter.css
    options.importFontFace && addBase(base);

    // Add .font-inter
    addUtilities(utilities);

    // Add .font-feature-{modier} utility classes
    let interFontFeatures = filterObject(
      theme("interFontFeatures", {}),
      (key, val) => !isEmpty(val)
    );
    let fontFeatures = toPairs(interFontFeatures).map(([modifier, value]) => {
      let features = generateFeatures(value, availableFeatures, options);
      return features.length > 0 ? [modifier, features] : null;
    });

    let featureRules = fromPairs(
      fontFeatures
        .filter(val => !isEmpty(val))
        .map(([modifier, value]) => {
          return [
            fontInterSelector(`.${e(`font-feature-${modifier}`)}`),
            {
              "font-feature-settings": value
            }
          ];
        })
    );

    let featureUtilities = {
      ".font-feature-normal": { "font-feature-settings": "normal" },
      ...featureRules
    };

    addUtilities(featureUtilities, variants("interFontFeatures"));

    // Add .text-inter-{size} utility classes
    // Modifiers are inherited from fontSize config
    const px = getUnitConverter(options.baseFontSize);

    const textSizeUtilities = fromPairs(
      flatMap(toPairs(theme("fontSize", {})), ([modifier, fontSize]) => {
        let size = px(fontSize);
        let selector = fontInterSelector(`.${e(`text-inter-${modifier}`)}`);
        let baseRule = fontSizeRule(
          selector,
          size,
          options.baseLineHeight,
          options
        );

        let leadingRules = toPairs(theme("lineHeight", {})).map(
          ([modifier, lineHeight]) => {
            let inheritSelector = fontInterSelector(
              selector,
              `.${e(`leading-${modifier}`)}`
            );
            return fontSizeRule(inheritSelector, size, lineHeight, options);
          }
        );

        // TODO: Add modifiers for tailwind's tracking
        let trackingRules = [];

        return [baseRule, ...leadingRules, ...trackingRules];
      })
    );

    addUtilities(textSizeUtilities, variants("fontSize"));
  };
};
