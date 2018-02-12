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
  menuCarditem:{ 
    paddingTop: 0, 
    marginTOP: 0, 
    paddingBottom: 0
  },
  menuCardView:{
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomColor: '#ececec', 
    borderBottomWidth: 1, 
    paddingBottom: 10,
    paddingTop: 10 
  },
  menuCardIcon:{
    height: 40, 
    width: 40
  },
  menuCardTxt:{
    flex: 1, 
    flexDirection: 'row', 
    color: '#606060',
    paddingLeft: 10
  },
  appHdr:{
    backgroundColor: '#80cec8'
  },
  appHdrtitleWarp:{
    textAlign: 'center', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

pname:{ 
  color: '#5e5e5e', 
  fontSize: 20, 
},
pemail:{ 
  color: '#969696', 
  fontSize: 14, 
},
pphone:{ 
  color: '#4b4b4b', 
  fontSize: 14, 
},
pcard:{
  paddingBottom: 0
},
pBtmTxt:{ 
  flex: 1, 
  borderTopColor: '#ececec', 
  borderTopWidth: 1, 
  paddingTop: 15, 
  paddingBottom: 5, 
},
profileImage:{ 
  height: 70, 
  width: 70, 
  borderRadius: 70, 
  marginRight: 15 
},
pBtmTxt_Txt:{ 
  textAlign: 'right',
  color: '#060606' 
},
flx_View:{ 
  flex: 1, 
  flexDirection: 'row' 
},
artNt:{ 
  width: 20, 
  textAlign: 'right' 
},
artNtTxt:{
  color: '#ff0026'
},
arw_lft:{ 
  width: 20, 
  textAlign: 'right' 
},
arw_lft_img: { 
  height: 20, 
  width: 10 
},
version:{
  textAlign: 'center',
  fontSize: 10,
  paddingTop: 15,
  paddingBottom: 15
}
};
