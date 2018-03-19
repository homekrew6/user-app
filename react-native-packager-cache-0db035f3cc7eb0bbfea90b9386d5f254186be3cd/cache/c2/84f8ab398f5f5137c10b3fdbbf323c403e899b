Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAnimation = registerAnimation;
exports.getAnimationByName = getAnimationByName;
exports.getAnimationNames = getAnimationNames;
exports.initializeRegistryWithDefinitions = initializeRegistryWithDefinitions;

var _createAnimation = require('./createAnimation');

var _createAnimation2 = babelHelpers.interopRequireDefault(_createAnimation);

var animationRegistry = {};

function registerAnimation(animationName, animation) {
  animationRegistry[animationName] = animation;
}

function getAnimationByName(animationName) {
  return animationRegistry[animationName];
}

function getAnimationNames() {
  return Object.keys(animationRegistry);
}

function initializeRegistryWithDefinitions(definitions) {
  Object.keys(definitions).forEach(function (animationName) {
    registerAnimation(animationName, (0, _createAnimation2.default)(definitions[animationName]));
  });
}