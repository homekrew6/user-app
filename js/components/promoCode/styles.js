const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;

export default {

    //common
    flex1: {flex: 1},
    font20: { fontSize: 20 },
    font20: { fontSize: 20 },
    font26: { fontSize: 26},

    // header part
    headerMain: { backgroundColor: '#81cdc7', alignItems: 'center', justifyContent: 'center' },
    headerBody: { alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#1e3768', fontSize: 16 },
    headerIconClose: { color: '#fff', fontSize: 30 },
    headerIconBack: { color: '#fff', fontSize: 24 },


    tCard: { alignItems: 'center', flexWrap: 'nowrap', padding: 18 },
    thanksInformation: { borderColor: '#ddd', borderWidth: 1, borderRadius: 10, },
    thanksText1: { flex: 1, textAlign: 'center', fontSize: 16, marginBottom: 5, paddingLeft: 15, paddingRight: 15, paddingTop: 15 },
    thanksText2: { fontSize: 10, flex: 1, textAlign: 'center', marginBottom: 5, paddingLeft: 15, paddingRight: 15 },
    thanksText3: { flex: 1, alignItems: 'center', marginBottom: 5, paddingLeft: 15, paddingRight: 15 },

    thanksBottomWarp: { borderTopWidth: 1, borderTopColor: '#ddd', flex: 1, flexDirection: 'row' },
    thanksBottom: { flex: 1, height: 34, alignItems: 'center', justifyContent: 'center', borderRightColor: '#ddd', borderRightWidth: 1 },
    rateHeader: { marginBottom: 5, fontSize: 14 },
    slideImage: { height: 60, width: 60, borderRadius: 10, marginRight: 5 },

    itemWarp: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 15 },
    headPromoCode: { color: '#1e3768' },
    headPromoCodeButtom: { fontSize: 10, color: '#1e3768' },
    promoDate:{ fontSize: 12, color: '#afafaf' },


    // modal
    mainModal: { margin: 0, justifyContent: 'flex-end' },
    modalWarp: { backgroundColor: '#fff', padding: 15 },

    promoCodeHeader: { textAlign: 'center', fontSize: 16, marginBottom: 10 },
    promoCodeInput: { marginBottom: 20 },
    promoCodeInputItem: { padding: 0, height: 40 },
    promoCodeInputTag: { fontSize: 14, margin: 0 },
    promoCodeAdd: { flex: 1, alignItems: 'center', backgroundColor: '#81cdc7', justifyContent: 'center', height: 40 },
    promoCodeCancel:{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 40 },
    promoCodeCancelText: { color: '#fff', fontSize: 14 }
};
