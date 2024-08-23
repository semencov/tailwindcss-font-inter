const parseUnit = require("parse-unit");

const PPI = 96;

const defaultUnitsRatio = (base) => ({
	ch: 8,
	ex: 7.15625,
	em: base,
	rem: base,
	in: PPI,
	cm: PPI / 2.54,
	mm: PPI / 25.4,
	pt: PPI / 72,
	pc: PPI / 6,
	px: 1,
});

const isNumeric = (val) =>
	!Number.isNaN(val) && !Number.isNaN(Number.parseFloat(val));

const toPx = (str, baseSize) => {
	if (!str && str !== 0) return null;
	const ratio = defaultUnitsRatio(baseSize);
	if (ratio[str]) return ratio[str];

	// detect number of units
	const parts = parseUnit(str);

	if (isNumeric(parts[0])) {
		if (parts[1]) {
			if (parts[1] === "%") {
				return (Number.parseFloat(parts[0]) / 100) * baseSize;
			}

			const px = toPx(parts[1], baseSize);
			return typeof px === "number" ? parts[0] * px : null;
		}
		return parts[0];
	}

	return null;
};

module.exports = {
	toPx,
};
