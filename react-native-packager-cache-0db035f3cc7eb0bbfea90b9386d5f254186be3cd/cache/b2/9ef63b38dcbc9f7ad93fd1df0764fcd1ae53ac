Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = babelHelpers.interopRequireDefault(_invariant);

var _getScreenForRouteName = require('./getScreenForRouteName');

var _getScreenForRouteName2 = babelHelpers.interopRequireDefault(_getScreenForRouteName);

var _addNavigationHelpers = require('../addNavigationHelpers');

var _addNavigationHelpers2 = babelHelpers.interopRequireDefault(_addNavigationHelpers);

var _validateScreenOptions = require('./validateScreenOptions');

var _validateScreenOptions2 = babelHelpers.interopRequireDefault(_validateScreenOptions);

function applyConfig(configurer, navigationOptions, configProps) {
  if (typeof configurer === 'function') {
    return babelHelpers.extends({}, navigationOptions, configurer(babelHelpers.extends({}, configProps, {
      navigationOptions: navigationOptions
    })));
  }
  if (typeof configurer === 'object') {
    return babelHelpers.extends({}, navigationOptions, configurer);
  }
  return navigationOptions;
}

exports.default = function (routeConfigs, navigatorScreenConfig) {
  return function (navigation, screenProps) {
    var state = navigation.state,
        dispatch = navigation.dispatch;

    var route = state;
    var _ref = route,
        routes = _ref.routes,
        index = _ref.index;


    (0, _invariant2.default)(route.routeName && typeof route.routeName === 'string', 'Cannot get config because the route does not have a routeName.');

    var Component = (0, _getScreenForRouteName2.default)(routeConfigs, route.routeName);

    var outputConfig = {};

    if (Component.router) {
      (0, _invariant2.default)(route && routes && index != null, 'Expect nav state to have routes and index, ' + JSON.stringify(route));
      var childRoute = routes[index];
      var childNavigation = (0, _addNavigationHelpers2.default)({
        state: childRoute,
        dispatch: dispatch
      });
      outputConfig = Component.router.getScreenOptions(childNavigation, screenProps);
    }

    var routeConfig = routeConfigs[route.routeName];

    var routeScreenConfig = routeConfig.navigationOptions;
    var componentScreenConfig = Component.navigationOptions;

    var configOptions = { navigation: navigation, screenProps: screenProps || {} };

    outputConfig = applyConfig(navigatorScreenConfig, outputConfig, configOptions);
    outputConfig = applyConfig(componentScreenConfig, outputConfig, configOptions);
    outputConfig = applyConfig(routeScreenConfig, outputConfig, configOptions);

    (0, _validateScreenOptions2.default)(outputConfig, route);

    return outputConfig;
  };
};