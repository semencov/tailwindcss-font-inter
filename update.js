#!/usr/bin/env node

const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { mkdirSync, rmSync } = require("node:fs");
const { writeFile } = require("node:fs/promises");
const fontkit = require("fontkit");
const fetch = require("node-fetch");
const postcss = require("postcss");
const { toKebabCase } = require("./src/utils.js");

const TEMP = path.resolve(".temp");

const interUrl = "https://rsms.me/inter/";
const interSource = `${interUrl}inter.css`;
const interFamilies = new Set();
const interFiles = new Set();
const interFontFaces = new Set();
const inter = {
	version: null,
	availableFeatures: new Set(),
	base: {
		"@font-face": [],
	},
	utilities: {
		".font-inter": {
			"font-family": "Inter, sans-serif",
		},
		"@supports(font-variation-settings: normal)": {
			".font-inter": {
				"font-family": "InterVariable, sans-serif",
			},
		},
	},
};

const extractCss = (root) => {
	console.info("Parsing fetched CSS...");

	root.walkAtRules((rule) => {
		const declarations = {};

		rule.walkDecls((decl) => {
			const name = toKebabCase(decl.prop);
			let value = decl.value
				.split(",")
				.map((val) => val.trim())
				.join(", ");

			if (name === "font-family") {
				const fontName = value.replace(/^['"]|['"]$/g, "").trim();
				if (!fontName.match(/\salt$/)) {
					interFamilies.add(fontName);
				}
			}

			if (name === "src") {
				const vals = value.match(/url\(['"]([^'"]*)['"]\)/gi);

				if (vals) {
					for (const val of vals) {
						const cleanVal = val.replace(/^url\(['"]|['"]\)$/g, "");
						value = value.replace(cleanVal, interUrl + cleanVal);
						interFiles.add(interUrl + cleanVal);
					}
				}
			}

			declarations[name] = value;
		});

    if (rule.name === 'font-face' && ['Inter', 'InterVariable'].includes(declarations['font-family'])) {
      interFontFaces.add(declarations);
    }
	});

	console.log("Found font families:", [...interFamilies].join(", "));
};

const download = (fileUrl, initialFile = null) => {
	let file = initialFile;

	if (!file) {
		const parsed = new URL(fileUrl);
		const fileName = path.basename(parsed.pathname);
		file = path.join(TEMP, fileName);
	}

	execFileSync("curl", ["--silent", "-o", file, "-L", fileUrl], {
		encoding: "utf8",
	});

	return file;
};

console.info("Fetching", interSource);

rmSync(TEMP, { recursive: true, force: true });
mkdirSync(TEMP, { recursive: true });

fetch(interSource)
	.then((res) => res.text())
	.then((css) => postcss([extractCss]).process(css, { from: undefined }))
	.then(() => {
		console.info("Fetching font files...");

		for (const fontFile of interFiles) {
			const file = download(fontFile);
			const font = fontkit.openSync(file);

			inter.version = font.version.replace(/Version\s/, "");

			for (const feature of font.availableFeatures) {
				inter.availableFeatures.add(feature);
			}
		}

		inter.availableFeatures = [...inter.availableFeatures].sort();
    inter.base['@font-face'] = [...interFontFaces];

		console.log("Font version:", inter.version);
		console.log("Found font features:", inter.availableFeatures.join(", "));
	})
	.then(async () => {
		const file = path.join(process.cwd(), "inter.json");
		await writeFile(file, JSON.stringify(inter));
		console.info("Finished. Meta data stored in ./inter.json");
	})
	.catch((err) => console.error(err));
