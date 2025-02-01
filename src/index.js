const plugin = require("tailwindcss/plugin");
const Inter = require("../inter.json");
const {
	unquote,
	defaults,
	isString,
	isBoolean,
	isArrayLike,
	isPlainObject,
	mapObject,
	filterObject
} = require("./utils");

function normalizeEntry(key, value) {
	let normalizedValue = isBoolean(value) ? `${1 * value}` : `${value}`;
	normalizedValue =
		normalizedValue !== "1" && normalizedValue !== "undefined"
			? normalizedValue
			: "1";

	return [unquote(key), normalizedValue];
}

function generateFeatures(inputFeatures, available) {
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
}

module.exports = plugin.withOptions((options = {}) => {
	const config = defaults(options, {
		importFontFace: true,
	});

	return ({ addBase, addUtilities, variants, e, theme }) => {
		const { availableFeatures, utilities, base } = Inter;

		const defaultFontFeaturesTheme = { default: ["calt", "kern"] };
		const defaultFontSizeVariants = ["responsive"];

		const fontSizeTheme = theme("fontSize");
		const fontSizeVariants = variants("fontSize", defaultFontSizeVariants);
		const fontFeaturesTheme = theme("interFontFeatures", defaultFontFeaturesTheme);
		const fontFeatures = defaults(fontFeaturesTheme, defaultFontFeaturesTheme);
		const fontFeaturesVariants = variants("interFontFeatures", defaultFontSizeVariants);
		const baseStyles = { ...(config.importFontFace ? base : {}) };

		const fontSizeStyles = (fontSize) => {
			const [size, opts = {}] = isArrayLike(fontSize) ? fontSize : [fontSize];

			return {
				...opts,
				fontSize: size,
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
					`.font-inter .${e(`font-feature-${modifier}`)},.font-inter.${e(`font-feature-${modifier}`)}`,
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
