function isBoolean(val) {
  return typeof val === "boolean";
}

function isString(val) {
  return typeof val === "string";
}

function isNumeric(val) {
  return !Number.isNaN(val) && !Number.isNaN(Number.parseFloat(val));
}

function isArrayLike(obj) {
  return obj &&
    obj !== null &&
    !isString(obj) &&
    typeof obj[Symbol.iterator] === "function";
}

function isPlainObject(val) {
  return !!val && typeof val === "object" && val.constructor === Object;
}

function mapObject(obj, cb) {
  return Object.fromEntries(
    (Array.isArray(obj) ? obj : Object.entries(obj)).map((val) => cb(...val))
  );
}

function filterObject(obj, cb) {
  return Object.fromEntries(
    (Array.isArray(obj) ? obj : Object.entries(obj)).filter((val) => cb(...val))
  );
}

function defaults(obj, ...defs) {
  return Object.assign({}, obj, ...defs.reverse(), obj);
}

function unquote(str) {
  return str.replace(/^['"]|['"]$/g, "").trim();
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

module.exports = {
  isBoolean,
	isString,
	isNumeric,
	isArrayLike,
	isPlainObject,
	mapObject,
	filterObject,
	defaults,
	unquote,
  toKebabCase,
};
