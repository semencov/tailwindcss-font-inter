const plugin = require("tailwindcss/plugin");
const { toPx } = require("./utils");
const Inter = require("../inter.json");

const isBoolean = (val) => typeof val === "boolean";
const isString = (val) => typeof val === "string";
const isArrayLike = (obj) =>
	obj &&
	obj !== null &&
	!isString(obj) &&
	typeof obj[Symbol.iterator] === "function";
const isPlainObject = (val) =>
	!!val && typeof val === "object" && val.constructor === Object;
const mapObject = (obj, cb) =>
	Object.fromEntries(
		(Array.isArray(obj) ? obj : Object.entries(obj)).map((val) => cb(...val)),
	);
const filterObject = (obj, cb) =>
	Object.fromEntries(
		(Array.isArray(obj) ? obj : Object.entries(obj)).filter((val) =>
			cb(...val),
		),
	);
const defaults = (obj, ...defs) =>
	Object.assign({}, obj, ...defs.reverse(), obj);
const round = (num, prec = 3) => Number.parseFloat(num.toFixed(prec));
const unquote = (str) => str.replace(/^['"]|['"]$/g, "").trim();

const tracking = (fontSize, a, b, c) => a + b * Math.E ** (c * fontSize);

const normalizeEntry = (key, value) => {
	let normalizedValue = isBoolean(value) ? `${1 * value}` : `${value}`;
	normalizedValue =
		normalizedValue !== "1" && normalizedValue !== "undefined"
			? normalizedValue
			: "1";

	return [unquote(key), normalizedValue];
};
const generateFeatures = (inputFeatures, available) => {
	let features;

	if (isPlainObject(inputFeatures)) {
		features = mapObject(inputFeatures, (key, value = "1") =>
			normalizeEntry(key, value),
		);
	} else {
		if (isString(inputFeatures)) {
			features = Object.fromEntries(
				inputFeatures.split(",").map((f) => f.trim().split(" ")),
			);
		} else {
			features = Object.fromEntries(
				inputFeatures.map((feature) => {
					let key;
					let value;

					if (isString(feature)) {
						[key, value = "1"] = feature.replace(/\s\s+/g, " ").split(" ", 2);
					} else if (isArrayLike(feature)) {
						[key, value = "1"] = feature;
					} else if (isPlainObject(feature)) {
						[key, value = "1"] = Object.entries(feature)[0];
					}

					return normalizeEntry(key, value);
				}),
			);
		}
	}

	features = filterObject(features, (key) => available.includes(key));

	return Object.entries(features)
		.map(([key, value]) => `"${key}" ${value}`)
		.filter((val) => !!val)
		.sort()
		.join(", ")
		.trim();
};

module.exports = plugin.withOptions((options = {}) => {
	const config = defaults(options, {
		a: -0.0223,
		b: 0.185,
		c: -0.1745,
		baseFontSize: 16,
		importFontFace: true,
	});

	return ({ addBase, addUtilities, variants, e, theme }) => {
		const { availableFeatures, utilities, base } = Inter;

		const defaultFontFeaturesTheme = { default: ["calt", "kern"] };
		const defaultFontSizeVariants = ["responsive"];

		const fontSizeTheme = theme("fontSize");
		const letterSpacingTheme = theme("letterSpacing");
		const fontSizeVariants = variants("fontSize", defaultFontSizeVariants);
		const fontFeaturesTheme = theme(
			"interFontFeatures",
			defaultFontFeaturesTheme,
		);
		const fontFeatures = defaults(fontFeaturesTheme, defaultFontFeaturesTheme);
		const fontFeaturesVariants = variants(
			"interFontFeatures",
			defaultFontSizeVariants,
		);
		const baseStyles = {
			...(config.importFontFace ? base : {}),
		};

		const fontSizeStyles = (fontSize, { a, b, c }, letterSpacing = 0) => {
			const [size, opts = {}] = isArrayLike(fontSize) ? fontSize : [fontSize];
			const sizeInPx = toPx(size, config.baseFontSize);
			const baseTracking = toPx(letterSpacing, sizeInPx);
			const trackingSize =
				baseTracking / sizeInPx + tracking(sizeInPx, a, b, c);

			return {
				...opts,
				fontSize: size,
				letterSpacing: `${round(trackingSize, 9)}em`,
			};
		};

		const fontFeatureStyles = (value) => {
			return value.length
				? {
						fontFeatureSettings: Array.isArray(value)
							? value.join(", ")
							: value,
					}
				: null;
		};

		const fontFeatureUtilities = {
			...{
				".font-inter .font-feature-normal, .font-inter.font-feature-normal": {
					...fontFeatureStyles("normal"),
				},
			},
			...mapObject(fontFeatures, (modifier, value) => {
				const features = generateFeatures(value, availableFeatures);

				return [
					`.font-inter .${e(`font-feature-${modifier}`)},.font-inter.${e(
						`font-feature-${modifier}`,
					)}`,
					{
						...fontFeatureStyles(features),
					},
				];
			}),
		};

		const fontSizeUtilities = Object.entries(fontSizeTheme).reduce(
			(result, [sizeModifier, sizeValue]) => {
				const { a, b, c } = config;

				const entries = [
					[
						`.font-inter .${e(`text-${sizeModifier}`)}, .font-inter.${e(`text-${sizeModifier}`)}`,
						{
							...fontSizeStyles(sizeValue, { a, b, c }),
						},
					],
					...Object.entries(letterSpacingTheme).map(
						([spacingModifier, spacingValue]) => [
							`.font-inter .${e(`text-${sizeModifier}`)} .${e(`tracking-${spacingModifier}`)}, ` +
								`.font-inter .${e(`text-${sizeModifier}`)}.${e(`tracking-${spacingModifier}`)}, ` +
								`.font-inter.${e(`text-${sizeModifier}`)} .${e(`tracking-${spacingModifier}`)}, ` +
								`.font-inter.${e(`text-${sizeModifier}`)}.${e(`tracking-${spacingModifier}`)}, ` +
								`.${e(`tracking-${spacingModifier}`)} .font-inter .${e(`text-${sizeModifier}`)}, ` +
								`.${e(`tracking-${spacingModifier}`)} .font-inter.${e(`text-${sizeModifier}`)}`,
							{
								...fontSizeStyles(sizeValue, { a, b, c }, spacingValue),
							},
						],
					),
				];

				return Object.assign(result, Object.fromEntries(entries));
			},
			{},
		);

		// Add @font-face if importFontFace: true
		// see https://rsms.me/inter/inter.css
		addBase(baseStyles);

		// Add .font-inter
		addUtilities(utilities);

		// Add .font-feature-{modifier} utility classes
		addUtilities(fontFeatureUtilities, fontFeaturesVariants);

		// Add .font-inter.text-{size} utility classes
		addUtilities(fontSizeUtilities, fontSizeVariants);
	};
});
