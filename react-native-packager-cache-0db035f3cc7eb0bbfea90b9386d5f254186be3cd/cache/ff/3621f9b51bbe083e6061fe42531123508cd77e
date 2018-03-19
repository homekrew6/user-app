Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeRegistryWithDefinitions = exports.registerAnimation = exports.createAnimation = exports.Image = exports.Text = exports.View = exports.createAnimatableComponent = undefined;

var _createAnimation = require('./createAnimation');

Object.defineProperty(exports, 'createAnimation', {
  enumerable: true,
  get: function get() {
    return babelHelpers.interopRequireDefault(_createAnimation).default;
  }
});

var _registry = require('./registry');

Object.defineProperty(exports, 'registerAnimation', {
  enumerable: true,
  get: function get() {
    return _registry.registerAnimation;
  }
});
Object.defineProperty(exports, 'initializeRegistryWithDefinitions', {
  enumerable: true,
  get: function get() {
    return _registry.initializeRegistryWithDefinitions;
  }
});

var _reactNative = require('react-native');

var _createAnimatableComponent = require('./createAnimatableComponent');

var _createAnimatableComponent2 = babelHelpers.interopRequireDefault(_createAnimatableComponent);

var _definitions = require('./definitions');

var ANIMATION_DEFINITIONS = babelHelpers.interopRequireWildcard(_definitions);


(0, _registry.initializeRegistryWithDefinitions)(ANIMATION_DEFINITIONS);

var createAnimatableComponent = exports.createAnimatableComponent = _createAnimatableComponent2.default;
var View = exports.View = (0, _createAnimatableComponent2.default)(_reactNative.View);
var Text = exports.Text = (0, _createAnimatableComponent2.default)(_reactNative.Text);
var Image = exports.Image = (0, _createAnimatableComponent2.default)(_reactNative.Image);