Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = babelHelpers.interopRequireDefault(_invariant);

var deprecatedKeys = ['tabBar'];

exports.default = function (screenOptions, route) {
  var keys = Object.keys(screenOptions);

  var deprecatedKey = keys.find(function (key) {
    return deprecatedKeys.includes(key);
  });

  if (typeof screenOptions.title === 'function') {
    (0, _invariant2.default)(false, ['`title` cannot be defined as a function in navigation options for `' + route.routeName + '` screen. \n', 'Try replacing the following:', '{', '    title: ({ state }) => state...', '}', '', 'with:', '({ navigation }) => ({', '    title: navigation.state...', '})'].join('\n'));
  }

  if (deprecatedKey && typeof screenOptions[deprecatedKey] === 'function') {
    (0, _invariant2.default)(false, ['`' + deprecatedKey + '` cannot be defined as a function in navigation options for `' + route.routeName + '` screen. \n', 'Try replacing the following:', '{', '    ' + deprecatedKey + ': ({ state }) => ({', '         key: state...', '    })', '}', '', 'with:', '({ navigation }) => ({', '    ' + deprecatedKey + 'Key: navigation.state...', '})'].join('\n'));
  }

  if (deprecatedKey && typeof screenOptions[deprecatedKey] === 'object') {
    (0, _invariant2.default)(false, ['Invalid key `' + deprecatedKey + '` defined in navigation options for `' + route.routeName + '` screen.', '\n', 'Try replacing the following navigation options:', '{', '    ' + deprecatedKey + ': {'].concat(babelHelpers.toConsumableArray(Object.keys(screenOptions[deprecatedKey]).map(function (key) {
      return '        ' + key + ': ...,';
    })), ['    },', '}', '\n', 'with:', '{'], babelHelpers.toConsumableArray(Object.keys(screenOptions[deprecatedKey]).map(function (key) {
      return '    ' + (deprecatedKey + key[0].toUpperCase() + key.slice(1)) + ': ...,';
    })), ['}']).join('\n'));
  }
};