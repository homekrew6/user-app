import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, AsyncStorage, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, BackHandler } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FSpinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from 'react-navigation';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import api from '../../api/index';
import { navigateAndSaveCurrentScreen } from '../accounts/elements/authActions';
const reseteAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Menu' })],
});
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require("../../../img/logo2.png");
const carve = require("../../../img/icon17.png");

class Confirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateTime: props.service.data.serviceTime ? props.service.data.serviceTime : '',
            saveDateDB: props.service.data.saveDateDB ? props.service.data.saveDateDB : '',
            serviceName: props.service.data.serviceLocation ? props.service.data.serviceLocation : '',

            // homeValuearray: props.service.data.serviceLocation,            
            loader: false,
            continueButtonDesable: false,
            //homeValuearray: props.service.data.homeArray,
            // homeValue: 'Home'
        }

    }


    componentDidMount() {
        // AsyncStorage.getItem("fromLogin").then((storeValue) => {
        //     if (storeValue) {
        //         BackHandler.addEventListener('hardwareBackPress', function () {
        //             const { dispatch, navigation, nav } = this.props;
        //             if (this.props.auth.data.activeScreen && this.props.auth.data.activeScreen == 'Confirmation') {
        //                 const data = this.props.auth.data;
        //                 data.activeScreen = 'ServiceDetails';
        //                 data.previousScreen = "";
        //                 this.props.navigateAndSaveCurrentScreen(data);

        //             }
        //         }.bind(this));
        //     }
        // })
        //BackHandler.removeEventListener('hardwareBackPress', this._pasEditUnmountFunction);
    }



    confirmationContinue() {
        this.setState({
            loader: true,
        })
        if (!(this.state.dateTime == undefined)) {
            AsyncStorage.getItem("zoneId").then((zoneValue) => {
                if (zoneValue) {
                    if (this.props.service.data.serviceLocationid) {
                        api.post('Jobs/insertNewJob',
                            {
                                // "serviceId": this.props.service.data.id,
                                // "postedDate": this.props.service.data.saveDateDB,
                                // "location": this.props.service.data.serviceLocationid,
                                // "payment": "Credit Card",
                                // "faourite_sp": this.props.service.data.favouriteSp,
                                // "promo_code": "AED 50 off",
                                // "status": "STARTED",
                                // "userId": this.props.auth.data.id,
                                // "workerId": "0"
                                "price": this.props.service.data.price,
                                "postedDate": this.props.service.data.saveDateDB,
                                "payment": "Credit Card",
                                "faourite_sp": this.props.service.data.favouriteId,
                                "promo_code": "AED 50 off",
                                "status": "STARTED",
                                "customerId": this.props.auth.data.id,
                                "currencyId": 0,
                                "workerId": 0,
                                "zoneId": zoneValue,
                                "serviceId": this.props.service.data.id
                            }
                        ).then(responseJson => {
                            AsyncStorage.removeItem('serviceId', (err) => console.log('finished', err));
                            AsyncStorage.removeItem('keyQuestionList', (err) => console.log('finished', err));
                            AsyncStorage.removeItem('servicePrice', (err) => console.log('finished', err));
                            AsyncStorage.removeItem('fromLogin', (err) => console.log('finished', err));
                            AsyncStorage.removeItem('fromConfirmation', (err) => console.log('finished', err));
                            Alert.alert("Job Posted Successfully");
                            this.setState({
                                loader: false,
                                continueButtonDesable: true
                            });
                            this.props.navigation.dispatch(reseteAction);
                        }).catch(err => {
                            console.log(err);
                            Alert.alert("Job Post not save");
                            this.setState({
                                loader: false,
                            })
                        })
                    }
                    else {
                        this.setState({
                            loader: false
                        });
                        Alert.alert('Please add a location.');
                    }

                }
            })

        }
        else {
            this.setState({
                loader: false,
            })
            Alert.alert("Please Enter a Date And Time")
        }

    }
    navigate(screen) {
        const data = this.props.auth.data;
        data.activeScreen = screen;
        data.previousScreen = "Confirmation";
        this.props.navigateAndSaveCurrentScreen(data);
        this.props.navigation.navigate(screen);
    }


    goToSpListing() {

        if (this.state.dateTime) {
            this.navigate('ServiceProviderListing');
        }
        else {
            Alert.alert('Please select date and time to see the service providers available.');
        }
    }


    componentWillMount() {

        AsyncStorage.getItem("fromLogin").then((fromLogin) => {
            if (fromLogin) {
                BackHandler.addEventListener('hardwareBackPress', function () {

                    const { dispatch, navigation, nav } = this.props;
                    if (this.props.auth.data.activeScreen && this.props.auth.data.activeScreen == 'Menu') {
                        Alert.alert(
                            'Confirm',
                            'Are you sure to exit the app?',
                            [
                                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                { text: 'OK', onPress: () => BackHandler.exitApp() },
                            ],
                            { cancelable: false }
                        )
                    }
                    else {
                        let saveData = this.props.auth.data;
                        // if (this.props.auth.data.previousScreen)
                        //   this.props.navigation.navigate(this.props.auth.data.previousScreen);
                        // else {
                        //   this.props.navigation.navigate('Menu');
                        // }

                        switch (this.props.auth.data.activeScreen) {
                            case "EditProfile":
                                saveData.activeScreen = "Menu";
                                saveData.previousScreen = "";
                                this.props.navigateAndSaveCurrentScreen(saveData);
                                break;

                            case "Category":
                                // saveData.activeScreen = "Menu";
                                // saveData.previousScreen = "";
                                // this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "MyLocation":
                                // saveData.activeScreen = "Menu";
                                // saveData.previousScreen = "";
                                // this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "MyMap":
                                // saveData.activeScreen = "MyLocation";
                                // saveData.previousScreen = "Menu";
                                // this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "ServiceDetails":
                                //saveData.activeScreen = "Category";
                                //saveData.previousScreen = "Menu";
                                //this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "Confirmation":
                                saveData.activeScreen = "Confirmation";
                                saveData.previousScreen = "Category";
                                this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "DateAndTime":
                                saveData.activeScreen = "Confirmation";
                                saveData.previousScreen = "ServiceDetails";
                                this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "ServiceProviderListing":
                                saveData.activeScreen = "Confirmation";
                                saveData.previousScreen = "ServiceDetails";
                                this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            case "LocationList":
                                // saveData.activeScreen = "Confirmation";
                                // saveData.previousScreen = "ServiceDetails";
                                // this.props.navigateAndSaveCurrentScreen(saveData);
                                break;
                            default:
                                break;
                        }
                        if (this.props.auth.data.activeScreen == 'Confirmation') {
                            saveData.activeScreen = "ServiceDetails";
                            saveData.previousScreen = "Category";
                            this.props.navigateAndSaveCurrentScreen(saveData);
                            // console.log('stack menu', this.props);
                            // this.props.navigation.dispatch({
                            //   routeName: 'ServiceDetails'
                            // });
                            // Alert.alert(
                            //   'Confirm',
                            //   'Your data will be lost',
                            //   [
                            //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            //     { text: 'OK', onPress: () => this.props.navigation.navigate('ServiceDetails') },
                            //   ],
                            //   { cancelable: false }
                            // )
                            this.props.navigation.navigate('ServiceDetails');
                            //console.log()
                            //this.props.navigation.dispatch(NavigationActions.back({ routeName:'ServiceDetails'}));
                            return true;
                        } else if (this.props.auth.data.activeScreen === 'ServiceDetails') {
                            saveData.activeScreen = "Category";
                            saveData.previousScreen = "Menu";
                            this.props.navigateAndSaveCurrentScreen(saveData);
                            this.props.navigation.navigate('Category')
                        } else if (this.props.auth.data.activeScreen === 'Category') {
                            saveData.activeScreen = "Menu";
                            saveData.previousScreen = "";
                            this.props.navigateAndSaveCurrentScreen(saveData);
                            this.props.navigation.navigate('Menu')
                        }
                        else if (this.props.auth.data.activeScreen === 'MyLocation') {
                            saveData.activeScreen = "Menu";
                            saveData.previousScreen = "";
                            this.props.navigateAndSaveCurrentScreen(saveData);
                            this.props.navigation.navigate(saveData.activeScreen);
                        }
                        else if (this.props.auth.data.activeScreen === 'LocationList') {
                            saveData.activeScreen = "Confirmation";
                            saveData.previousScreen = "ServiceDetails";
                            this.props.navigateAndSaveCurrentScreen(saveData);
                            this.props.navigation.navigate(saveData.activeScreen);
                        }
                        else if (this.props.auth.data.activeScreen === 'MyMap') {
                            AsyncStorage.getItem("fromConfirmation").then((value) => {
                                if (value) {
                                    saveData.activeScreen = "LocationList";
                                    saveData.previousScreen = "Menu";
                                    this.props.navigateAndSaveCurrentScreen(saveData);
                                    this.props.navigation.navigate(saveData.activeScreen);
                                }
                                else {
                                    saveData.activeScreen = "MyLocation";
                                    saveData.previousScreen = "Menu";
                                    this.props.navigateAndSaveCurrentScreen(saveData);
                                    this.props.navigation.navigate(saveData.activeScreen);
                                }
                            })

                        }

                        else {
                            this.props.navigation.goBack(null);
                            return true;
                        }

                    }



                    return true;
                }.bind(this));
            }
        })

    }

    render() {
        return (
            <Container >
                <FSpinner visible={this.state.loader} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <StatusBar
                    backgroundColor="#cbf0ed"
                />
                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="ios-arrow-back-outline" style={styles.hd_lft_icon} />
                    </Button>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>Confirmation</Title>
                    </Body>
                    <Button transparent />
                </Header>

                <Content style={styles.bgWhite} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbf0ed', paddingBottom: 30, paddingTop: 14 }}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ borderRadius: 60, height: 60, width: 60, backgroundColor: '#81cdc7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="ios-home-outline" style={{ color: "#fff", fontSize: 34 }} />
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 18, padding: 5, fontSize: 16 }}>{this.state.serviceName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <EvilIcons name="clock" style={{ fontSize: 14, color: "#747474" }} />
                                <Text style={{ color: "#747474", fontSize: 14 }}>4 hours</Text>
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 16 }}>AED {this.props.service.data.price}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: -50 }}>
                        <Image source={carve} style={{ flex: 1, height: 50 }}></Image>
                    </View>
                    <View>

                        <TouchableOpacity style={[styles.confirmationItem]} onPress={() => this.navigate('DateAndTime')}>
                            <View style={styles.confirmationIconView}>
                                <Ico name='alarm' style={styles.confirmationViewIcon}></Ico>
                            </View>
                            <Text style={styles.confirmationMainTxt}>Date & Time</Text>
                            <Text style={styles.confirmationDateTime}>{this.state.dateTime}</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmationItem} onPress={() => this.navigate('LocationList')}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='location' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Location</Text>
                            <Text style={styles.confirmationDateTime}>{this.state.serviceName}</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='credit-card' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Payment</Text>
                            <Text style={styles.confirmationDateTime}>Credit Card / Debit Card</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                        <TouchableOpacity style={styles.confirmationItem} onPress={() => this.goToSpListing()}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='heart' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Favorite SP</Text>
                            <Text style={styles.confirmationDateTime}>{this.props.service.data.favouriteSp}</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <Entypo name='scissors' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Promo Code</Text>
                            <Text style={styles.confirmationDateTime}>AED 50 off</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                    </View>
                    <View style={styles.confirmationhd}>
                        <Text style={styles.confirmationhdtxt}>Add Service</Text>
                    </View>
                    <View style={styles.confirmationServicewarp}>
                        <View style={styles.confirmationServiceItem}>
                            <View style={styles.confirmationServiceItemIcon}>
                                <Ionicons name="ios-home-outline" style={styles.confirmationServiceItemIconIcn} />
                            </View>
                            <Text style={styles.confirmationServiceTxt}>Home</Text>
                            <View style={styles.confirmationServicePlusWarp}>
                                <Entypo name='plus' style={styles.confirmationServicePlusIcon} />
                            </View>
                        </View>
                        <View style={styles.confirmationServiceDvdr}></View>
                        <View style={styles.confirmationServiceItem}>
                            <View style={styles.confirmationServiceItemIcon}>
                                <Ionicons name="ios-home-outline" style={styles.confirmationServiceItemIconIcn} />
                            </View>
                            <Text style={styles.confirmationServiceTxt}>Home</Text>
                            <View style={styles.confirmationServicePlusWarp}>
                                <Entypo name='plus' style={styles.confirmationServicePlusIcon} />
                            </View>
                        </View>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <TouchableOpacity style={styles.confirmationServicefooterItem} onPress={() => this.confirmationContinue()} disabled={this.state.continueButtonDesable}><Text style={styles.confirmationServicefooterItmTxt}>CONTINUE</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.confirmationServicefooterItem2}><Text style={styles.confirmationServicefooterItmTxt}>AED {this.props.service.data.price}</Text></TouchableOpacity>
                    </FooterTab>
                </Footer>

            </Container>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        service: state.service,
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
    navigateAndSaveCurrentScreen: (data) => dispatch(navigateAndSaveCurrentScreen(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);
