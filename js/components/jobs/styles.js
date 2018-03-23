const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;

export default {

    // header

    headIcon: { fontSize: 22, color: '#fff' },
    headBody: { alignItems: 'center' },
    headCenter: { color: '#1e3768', textAlign: 'center' },
    headerWarp: { backgroundColor: '#81cdc7' },
    container: { flex: 1 },

    jobItemWarp: { backgroundColor: '#fff', padding: 10, flexDirection: 'row' , alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc'},
    jobItemIconIonicons: { color: '#81cdc7', fontSize: 30 },
    jobItemIcon: { color: '#81cdc7', fontSize: 20 },
    jobItemName: { flex: 1, fontSize: 14, paddingLeft: 10 },
    jobItemValue:{ fontSize: 14, color: '#ccc', paddingLeft: 10 },
    jobItemValueDateandTime: { fontSize: 12 }
};
