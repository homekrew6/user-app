Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getStyleValues;

var _flattenStyle = require('./flattenStyle');

var _flattenStyle2 = babelHelpers.interopRequireDefault(_flattenStyle);

var _getDefaultStyleValue = require('./getDefaultStyleValue');

var _getDefaultStyleValue2 = babelHelpers.interopRequireDefault(_getDefaultStyleValue);

function getStyleValues(keys, style) {
  var values = {};
  var flatStyle = (0, _flattenStyle2.default)(style);

  (typeof keys === 'string' ? [keys] : keys).forEach(function (key) {
    values[key] = key in flatStyle ? flatStyle[key] : (0, _getDefaultStyleValue2.default)(key, flatStyle);
  });
  return values;
}