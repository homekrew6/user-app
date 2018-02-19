const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get('window').width; 

export default {
    bgWhite:{
        backgroundColor: '#fff'
    },
    appHdr2: {
        backgroundColor: '#cbf0ed',
    },
    catIten:{
        width: 110, 
        marginBottom: 40,
        alignItems: 'center'
    },
    catIten_img_view: {
        borderRadius: 100, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        height: 80, 
        width: 80, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    catIten_txt:{
        textAlign: 'center', 
        alignItems: 'center', 
        color: '#3a4d75', 
        fontSize: 14, 
        marginTop: 10
    },
    catIten_txt_warp:{ 
        flex: 1, 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        padding: 10
    },
    catIten_hdr:{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 20,
        marginBottom: 20 
    },
    catIten_hdr_txt:{ 
        fontSize: 12
    },
    catIten_hdr_txt:{ 
        color: '#1e3768', 
        fontSize: 20
    },
    catIten_img:{ 
        width: 60, 
        height: 60 
    },
    hd_rt_icon:{ 
        color: '#81cdc7', 
        fontSize: 30, 
        fontWeight: 'nornal' 
    },
    hd_lft_icon:{ 
        fontSize: 20, 
        color: "#71beb8" 
    },
    logo_hdr_img:{ 
        height: 18, 
        width: 110 
    },
    carveImage:{ 
        height: 200, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        width: deviceWidth 
    }
};
