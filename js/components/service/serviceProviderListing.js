import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Alert, TouchableOpacity, List,Text} from "react-native";
import { NavigationActions } from "react-navigation";
import { Container, Header, Button, Content, Body, Title } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import { setServiceDetails } from './elements/serviceActions';
import FSpinner from 'react-native-loading-spinner-overlay';
import api from '../../api/index';
const carve = require("../../../img/atul_bk.png");
const img18 = require('../../../img/no-image-available.png');
class ServiceProviderListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceDetails: this.props.service.data,
            selectedTime: '',
            isVisible: false,
            spList: []

        }
    }


    componentWillMount() {
        if (this.props.service.data.serviceTime.includes('AM')) {
            let time = this.props.service.data.serviceTime.split('AM')[0].split(' ')[2];
            time = time.replace('0', '');
            time = time.replace(':00', '');
            time = time + " am";
            let day = this.props.service.data.serviceTime.split(' ')[0].toLowerCase();
            this.setState({ selectedTime: time });
            const data = { "serviceId": 8, "time": time, "day": day, "customerId":this.props.auth.data.id };
            this.setState({ isVisible: true });
            api.post('Workeravailabletimings/getUserFavSVListing', data).then((data) => {
                // data.response.list.map((itemnew)=>{
                //     itemnew.IsAvailable = false;
                // })
                if (data.response.type == 'Success') {
                    this.setState({ isVisible: false });
                    this.setState({ spList: data.response.message.spList  });
                }
                else {
                    this.setState({ isVisible: false });
                    Alert.alert(data.response.message);
                }
            }).catch((err) => {
                this.setState({ isVisible: false });
                Alert.alert(data.response.message);
            })
        }
        else {
            let time = this.props.service.data.serviceTime.split('PM')[0].split(' ')[2];
            time = time.replace('0', '');
            time = time.replace(':00', '');
            time = time + " pm";
            this.setState({ selectedTime: time });
            let day = this.props.service.data.serviceTime.split(' ')[0].toLowerCase();
            const data = { "serviceId": 8, 'time': time, 'day': day };
            api.post('Workeravailabletimings/getUserFavSVListing', data).then((data) => {
                if (data.response.type == 'Success') {
                    this.setState({ isVisible: false });
                    this.setState({ spList: data.response.message.spList });
                }
                else {
                    this.setState({ isVisible: false });
                    Alert.alert(data.response.message);
                }
            }).catch((err) => {
                this.setState({ isVisible: false });
                Alert.alert(data.response.message);
            })
        }
    }

    selectServiceProvider(data) {
        let spListing = [];
        this.state.spList.map((item) => {
            spListing.push(item);
        });
        spListing.map((item1) => {
            if (item1.id == data.id) {
                item1.IsSelected = !item1.IsSelected;
            }
            else {
                item1.IsSelected = false;
            }
        })
        this.setState({ spList: spListing });
    }


    spDone() {
        let loc;
        this.state.spList.map((loc1) => {
            if (loc1.IsSelected == true) {
                loc = loc1;
            }
        })
        if (loc) {
            let data = this.state.serviceDetails;
            // data.serviceLocation = this.state.homeArray

            data.favouriteSp = loc.name;
            data.favouriteId = loc.id;
            this.props.setServiceDetails(data);
            
            const data1 = this.props.auth.data;
            // data1.activeScreen = 'Confirmation';
            // data1.previousScreen = "ServiceDetails";
            // this.props.navigateAndSaveCurrentScreen(data1);
            // this.props.navigation.navigate('Confirmation');
           // this.props.navigation.navigate('Confirmation');
            this.props.navigation.dispatch( 
                NavigationActions.reset({
                    index: 3,
                    actions: [
                    NavigationActions.navigate({ routeName: 'Menu' }),
                    NavigationActions.navigate({ routeName: 'Category' }),
                    NavigationActions.navigate({ routeName: 'ServiceDetails' }),
                    NavigationActions.navigate({ routeName: 'Confirmation' }),
                    ],
                })
            );
        }
        else
        {
            const data1 = this.props.auth.data;
            // data1.activeScreen = 'Confirmation';
            // data1.previousScreen = "ServiceDetails";
            // this.props.navigateAndSaveCurrentScreen(data1);
            // this.props.navigation.navigate('Confirmation');

            this.props.navigation.dispatch( 
                NavigationActions.reset({
                    index: 3,
                    actions: [
                    NavigationActions.navigate({ routeName: 'Menu' }),
                    NavigationActions.navigate({ routeName: 'Category' }),
                    NavigationActions.navigate({ routeName: 'ServiceDetails' }),
                    NavigationActions.navigate({ routeName: 'Confirmation' }),
                    ],
                })
            );
            
            //this.props.navigation.navigate('Confirmation');
        }
       
    }
    render() {
        let serviceListing;
        if (this.state.spList.length > 0) {

            serviceListing = (
                this.state.spList.map((data, key) => {
                    if (!data.name) return;
                    return (
                        <View key={data.id}>

                            {
                                data.IsAvailable ? (
                                
                                        <TouchableOpacity onPress={() => this.selectServiceProvider(data)} style={{ width: 100, paddingTop: 10, paddingBottom: 10, alignItems: 'center' }}>
                                            <View style={{height: 80, width: 80, position: 'relative'}}>

                                                {/* <Image source={{ uri: data.image || null }} style={styles.catIten_img} /> */}
                                                {
                                                    data.image ? (
                                                        <Image source={{uri: data.image}} style={{ height: 80, width: 80, borderRadius: 80, borderColor: '#81cdc7', borderWidth: 2 }} />
                                                    ) : (
                                                        <Image source={img18} style={{ height: 80, width: 80, borderRadius: 80, borderColor: '#81cdc7', borderWidth: 2 }} />
                                                    )

                                                        
                                                }
                                                {
                                                    data.IsSelected ? (
                                                        <View style={{  backgroundColor: 'rgba(129,205,199, 0.5)', top: 0, left: 0, position: 'absolute', height: 80, width: 80, alignItems: 'center', justifyContent: 'center',  borderRadius: 80, zIndex: 99 }}>
                                                            <Ionicons name="ios-done-all" style={{ color: '#1e3768', fontSize: 40 }} />
                                                        </View>
                                                    ) : (<View></View>)
                                                }
                                                </View>
                                            <Text style={styles.catIten_txt}>{data.name || null}</Text>
                                        </TouchableOpacity>
                                        

                                ) : (
                                        <View style={{width: 100, paddingTop: 10, paddingBottom: 10,  alignItems: 'center' }}>
                                            <View style={{ height: 80, width: 80, position: 'relative' }}>
                                                {
                                                    data.image ? (
                                                        <Image source={{ uri: data.image }} style={{ height: 80, width: 80, borderRadius: 50, borderColor: '#ccc', borderWidth: 2 }} />
                                                    ) : (
                                                        <Image source={img18} style={{ height: 80, width: 80, borderRadius: 50, borderColor: '#ccc', borderWidth: 2 }} />
                                                    )
                                                }
                                                <View style={{  backgroundColor: 'rgba(204,204,204, 0.7)', top: 0, left: 0, position: 'absolute', height: 80, width: 80, alignItems: 'center', justifyContent: 'center',  borderRadius: 80, zIndex: 99 }}></View>
                                            </View>
                                            <Text style={[styles.catIten_txt, { textAlign: 'center', width: '100%' }]}>{data.name || null}</Text>
                                        </View>
                                    )
                            }


                        </View>
                    )
                })
            )
        }
  
        return (
            <Container >
                <FSpinner visible={this.state.isVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <StatusBar
                    backgroundColor="#81cdc7"
                />

                <Header style={styles.appHdr2} androidStatusBarColor="#81cdc7" noShadow>
                    <Button transparent onPress={() => this.props.navigation.goBack()} >
                        <Text>{I18n.t('cancel')}</Text>
                    </Button>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>{I18n.t('choose_from_favourite')}</Title>
                    </Body>
                    <Button transparent onPress={() => this.spDone()}><Text>{I18n.t('done')}</Text></Button>
                </Header>

                <Content style={styles.bgWhite} >

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' , alignItems: 'center', justifyContent: 'center'}}>
                        {/* <View style={{ height: 120, width: 120 }}>

                            <Image source={carve} style={{ height: 100, width: 100, borderRadius: 50 }}></Image>
                            <Text>dkhjgkdjfhg</Text>
                        </View>
                        <View style={{ height: 120, width: 120, borderRadius: 200, backgroundColor: 'red' }}></View>
                        <View style={{ height: 120, width: 120, borderRadius: 200, backgroundColor: 'red' }}></View>
                        <View style={{ height: 120, width: 120, borderRadius: 200, backgroundColor: 'red' }}></View> */}
                        {serviceListing}
                    </View>

                </Content>
            </Container>
        );
    }
}

// export default Expect;
// ServiceProviderListing.propTypes = {
//     auth: PropTypes.object.isRequired,
//     service: PropTypes.object.isRequired
// };
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});
const mapDispatchToProps = dispatch => ({
    setServiceDetails: (data) => dispatch(setServiceDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceProviderListing);
