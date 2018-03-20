import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import { setServiceDetails } from './elements/serviceActions';
import FSpinner from 'react-native-loading-spinner-overlay';
import api from '../../api/index'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
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
            const data = { "serviceId": 8, 'time': time, 'day': day };
            this.setState({ isVisible: true });
            api.post('worker-available-timings/getUserFavSVListing', data).then((data) => {
                if (data.response.type == 'success') {
                    this.setState({ isVisible: false });
                    this.setState({ spList: data.response.list });
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
            api.post('worker-available-timings/getUserFavSVListing', data).then((data) => {
                if (data.response.type == 'success') {
                    this.setState({ isVisible: false });
                    this.setState({ spList: data.response.list });
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
                loc = loc1.name;
            }
        })
        if (loc) {
            let data = this.state.serviceDetails;
            // data.serviceLocation = this.state.homeArray;
            data.favouriteSp = loc;
            this.props.setServiceDetails(data);
            this.props.navigation.navigate('Confirmation');
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

                                    <View style={{ height: 110, width: 110, backgroundColor: 'blue' }}>
                                        <TouchableOpacity onPress={() => this.selectServiceProvider(data)}>

                                            {/* <Image source={{ uri: data.image || null }} style={styles.catIten_img} /> */}
                                            {
                                                data.image ? (
                                                    <ImageBackground source={{ uri: data.image }} style={{ height: 100, width: 100, borderRadius: 50, position: 'relative' }} >
                                                        {
                                                            data.IsSelected ? (
                                                                <View style={{ backgroundColor: 'black', opacity: 0.5, top: 0, left: 0, position: 'absolute', height: 100, width: 100, alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Ionicons name="ios-information-circle" style={{ color: 'white' }} />
                                                                </View>
                                                            ) : (<View></View>)
                                                        }

                                                    </ImageBackground>
                                                ) : (
                                                        <ImageBackground source={img18} style={{ height: 100, width: 100, borderRadius: 50, position: 'relative' }} >
                                                            {
                                                                data.IsSelected ? (
                                                                    <View style={{ backgroundColor: 'black', opacity: 0.5, top: 0, left: 0, position: 'absolute', height: 100, width: 100, alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Ionicons name="ios-information-circle" style={{ color: 'white' }} />
                                                                    </View>
                                                                ) : (<View></View>)
                                                            }
                                                        </ImageBackground>
                                                    )
                                            }
                                        </TouchableOpacity>
                                        <Text style={styles.catIten_txt}>{data.name || null}</Text>
                                    </View>
                                ) : (
                                        <View style={{width: 100, paddingTop: 10, paddingBottom: 10 }}>
                                            <View style={{ justifyContent: 'space-around', alignContent: 'center', flex:1, flexDirection: 'row'  }}>
                                                {
                                                    data.image ? (
                                                        <Image source={{ uri: data.image }} style={{ height: 80, width: 80, borderRadius: 50, borderColor: '#ccc', borderWidth: 2 }} />
                                                    ) : (
                                                            <Image source={img18} style={{ height: 80, width: 80, borderRadius: 50, borderColor: '#ccc', borderWidth: 2 }} />
                                                        )
                                                }
                                            </View>
                                            <Text style={[styles.catIten_txt, { textAlign: 'center' }]}>{data.name || null}</Text>
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
                    backgroundColor="#cbf0ed"
                />

                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                    <Button transparent onPress={() => this.props.navigation.goBack()} >
                        <Text>Cancel</Text>
                    </Button>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>Adc Favourite</Title>
                    </Body>
                    <Button transparent onPress={() => this.spDone()}><Text>Done</Text></Button>
                </Header>

                <Content style={styles.bgWhite} >

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
ServiceProviderListing.propTypes = {
    auth: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});
const mapDispatchToProps = dispatch => ({
    setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceProviderListing);
