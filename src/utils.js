const parseUnit = require('parse-unit');

const PPI = 96;

const defaultUnitsRatio = {
    ch: 8,
    ex: 7.15625,
    em: 16,
    rem: 16,
    in: PPI,
    cm: PPI / 2.54,
    mm: PPI / 25.4,
    pt: PPI / 72,
    pc: PPI / 6,
    px: 1
};

const isNumeric = val => !isNaN(val) && !isNaN(parseFloat(val));

const toPx = str => {
    if (!str && str !== 0) return null;
    if (defaultUnitsRatio[str]) return defaultUnitsRatio[str];

    // detect number of units
    const parts = parseUnit(str);

    if (isNumeric(parts[0])) {
        if (parts[1]) {
            const px = toPx(parts[1]);
            return typeof px === 'number' ? parts[0] * px : null;
        } else {
            return parts[0];
        }
    }

    return null;
};

module.exports = {
    toPx
};
