Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flattenStyle;

var _reactNative = require('react-native');

function flattenStyle(style) {
  var flatStyle = babelHelpers.extends({}, _reactNative.StyleSheet.flatten(style));
  if (flatStyle.transform) {
    flatStyle.transform.forEach(function (transform) {
      var key = Object.keys(transform)[0];
      flatStyle[key] = transform[key];
    });
    delete flatStyle.transform;
  }
  return flatStyle;
}