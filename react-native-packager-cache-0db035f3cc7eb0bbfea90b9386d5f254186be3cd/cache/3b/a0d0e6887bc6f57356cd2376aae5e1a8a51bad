Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapStyleTransforms;

var TRANSFORM_STYLE_PROPERTIES = ['perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'translateX', 'translateY'];

function wrapStyleTransforms(style) {
  var wrapped = {};
  Object.keys(style).forEach(function (key) {
    if (TRANSFORM_STYLE_PROPERTIES.indexOf(key) !== -1) {
      if (!wrapped.transform) {
        wrapped.transform = [];
      }
      wrapped.transform.push(babelHelpers.defineProperty({}, key, style[key]));
    } else {
      wrapped[key] = style[key];
    }
  });
  return wrapped;
}