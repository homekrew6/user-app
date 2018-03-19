Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (navigation) {
  return babelHelpers.extends({}, navigation, {
    goBack: function goBack(key) {
      return navigation.dispatch(_NavigationActions2.default.back({
        key: key === undefined ? navigation.state.key : key
      }));
    },
    navigate: function navigate(routeName, params, action) {
      return navigation.dispatch(_NavigationActions2.default.navigate({
        routeName: routeName,
        params: params,
        action: action
      }));
    },

    setParams: function setParams(params) {
      return navigation.dispatch(_NavigationActions2.default.setParams({
        params: params,
        key: navigation.state.key
      }));
    }
  });
};

var _NavigationActions = require('./NavigationActions');

var _NavigationActions2 = babelHelpers.interopRequireDefault(_NavigationActions);