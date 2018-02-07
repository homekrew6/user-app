const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {

    flexDirection:'row',
    justifyContent: 'center',
    height:120
    //alignItems: 'flex-start'
    //marginTop: deviceHeight / 8,
    //marginBottom: 30
  },
  logo: {
    //position: "absolute",
    //left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 20 : 20,
    width:76,
    height:100
    //width: 70,
    //height: null
  },
  text: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5
  },
  // buttonStyle: {
  //   borderWidth: 1,
  //   borderRadius: 2,
  //   backgroundColor:'#81cdc7',
  //   borderColor: '#ddd',
  //   borderBottomWidth: 0,
  //   shadowColor: '#ddd',
  //   shadowOffset: { width: 5, height: 2 },
  //   shadowOpacity: 1,
  //   shadowRadius: 5,
  //   elevation: 1,
  //   marginLeft: 5,
  //   marginRight: 5,
  //   marginTop: 10,
  //   elevation: 1
  // }
};
