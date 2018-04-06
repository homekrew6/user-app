const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;

export default {

    // header
    flexDirectionRow: { flexDirection: 'row' },
    fontWeight700: { fontWeight: '700' },
    headIcon: { fontSize: 22, color: '#fff' },
    headBody: { alignItems: 'center', flex: 1 },
    headCenter: { color: '#1e3768', textAlign: 'center' },
    headerWarp: { backgroundColor: '#81cdc7' },
    container: { flex: 1 },

    dayHeading: { padding: 15, backgroundColor: '#f2f2f2' },

    //Job Listing style
    jobList: { backgroundColor: '#f2f2f2', padding: 0, margin: 0 },
    jobListItem: {
        marginBottom: 0,
        backgroundColor: '#fff',
        marginLeft: 0
    },
    jobListItemDisable: {
        marginBottom: 0,
        backgroundColor: '#FF0000',
        marginLeft: 0
    },
    listWarp: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    listWarpImageWarp: { height: 65, width: 65, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderColor: '#81cdc7', borderRadius: 60, borderWidth: 1 },
    listWarpImage: { height: 40, width: 40 },
    listWarpTextWarp: { flex: 1, paddingLeft: 15 },
    listWarpPriceUp: { fontSize: 14 },
    listWarpPriceDown: { fontSize: 12 },

    jobItemWarp: { backgroundColor: '#fff', paddingTop: 15, paddingLeft: 10, paddingRight: 10, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
    jobItemIconIonicons: { color: '#81cdc7', fontSize: 30 },
    jobItemIcon: { color: '#81cdc7', fontSize: 20 },
    jobItemName: { flex: 1, fontSize: 14, paddingLeft: 10 },
    jobItemValue: { fontSize: 14, color: '#ccc', paddingLeft: 10 },
    jobItemValueDateandTime: { fontSize: 12 },
    editprofileLst: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editprofileWarp: {
        flex: 1,
        paddingBottom: 0,
        marginBottom: 0,
    },
    editprofileInputwrap: {
        flex: 1
    },
    editprofileInput: {
        color: '#29416f',
        fontSize: 14,
        color: '#828282'
    },
    editPflHdr: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#cbf0ed'
    },
    editPflHdrWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        marginTop: 0,
        marginBottom: 0
    },
    editPflHdrThumbnail: {
        height: 110,
        width: 110,
        borderRadius: 90
    },
    editPflHdrBtn: {
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 15
    },
    confirmationServicefooterItem:{
        backgroundColor: '#000'
    },


    // header
    appHdrtitleWarp: { alignItems: 'center', justifyContent: 'center' },
    appHdr2: { backgroundColor: '#81cdc7', },



    // total bill item

    totalBillitem: { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 1, backgroundColor: '#fff' },
    totalImage: { width: 20, height: 20 },
    text1: { paddingLeft: 8 },
    text2: { width: '100%', textAlign: 'right', paddingRight: 10 },
    price: { width: 80 },
    priceText: { fontSize: 14, fontWeight: 'bold', width: '100%', textAlign: 'right' },
    imagesWarp: { width: 25 },



    // footer

    footerTab:{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#81cdc7' },
    footerTabText: { fontSize: 14, color: '#fff' }

};
