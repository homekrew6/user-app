import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, AsyncStorage, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, BackHandler, WebView } from "react-native";
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
const paymentUrl = 'https://secure.telr.com/gateway/mobile.xml';
var parseString = require('react-native-xml2js').parseString;
var xml2js = require('react-native-xml2js');
let headers = {
    'Accept': 'application/xml',
    'Content-Type': 'application/xml',
}
class Confirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dateTime: props.service.data.serviceTime ? props.service.data.serviceTime : '',
            saveDateDB: props.service.data.saveDateDB ? props.service.data.saveDateDB : '',
            serviceName: props.service.data.serviceLocation ? props.service.data.serviceLocation : '',
            currency: 'AED',
            // homeValuearray: props.service.data.serviceLocation,            
            loader: false,
            continueButtonDesable: false,
            currencyId: 3,
            minPrice: '0.0',
            url: 'https://secure.telr.com/gateway/webview_start.html?code=8f6f5da95a445ad995ba561231db'
            //homeValuearray: props.service.data.homeArray,
            // homeValue: 'Home'
        }

    }

    startPayment() {
        this.setState({
            loader: true
        });
        var obj = {
            store: '20217', key: 'JtLPL^pgBVG@q7PZ', device: { type: 'Android', id: '36C0EC49-AA2F-47DC-A4D7-D9927A739F5F' },
            app: { name: 'Pragati', version: '1.0.0', user: '7070', id: '55555' }, tran: {
                test: '1', type: 'paypage', class: 'ecom', cartid: Math.floor(100000 + Math.random() * 900000), description: 'Krew Test Job',
                currency: 'AED', amount: this.props.service.data.price, language: 'en'
            }, billing: {
                name: { title: 'Miss', first: 'Pragati', last: 'Chatterjee' }, address: {
                    line1: 'SIT TOWER', city: 'Dubai', region: 'Dubai', country: 'AE'
                },
                email: 'pragati@natitsolved.com'
            }
        };

        var builder = new xml2js.Builder({ rootName: 'mobile' });
        var xml = builder.buildObject(obj);

        const selfComponent = this;
        fetch(paymentUrl, {
            method: 'POST',
            headers: headers,
            body: xml
        }).then((res) => {

            parseString(res._bodyInit, function (err, result) {
                if (err) {
                    this.setState({
                        loader: false
                    });
                    Alert.alert('Please try again later.');
                }
                else {
                    selfComponent.setState({
                        loader: false
                    });
                    console.warn("pragati", result.mobile.webview[0].start[0]);
                    selfComponent.props.navigation.navigate('Payment', { amount: selfComponent.props.service.data.price, customerId: selfComponent.props.auth.data.id,url: result.mobile.webview[0].start[0], close: result.mobile.webview[0].close[0], abort: result.mobile.webview[0].abort[0], code: result.mobile.webview[0].code[0] });
                }


            });
        }).catch((err) => {
            this.setState({
                loader: false
            });
            console.warn("error", err);
            Alert.alert('Please try again later.');
        })

    }

    componentDidMount() {
        // debugger;
        // var xml = "<?xml version='1.0' encoding='UTF - 8'?>< mobile ><webview><start>https://secure.telr.com/gateway/webview_start.html?code=e46f5da95ac55ad990c2aa6cc1f1</start><close>https://secure.telr.com/gateway/webview_close.html</close><abort>https://secure.telr.com/gateway/webview_abort.html</abort><code>e46f5da95ac55ad990c2aa6cc1f1</code></webview><trace>4000/27841/5ad990c2</trace></mobile >"
        // parseString(xml, function (err, result) {
        //     console.dir(result);
        // });
        if (this.props.service.data.min_charge) {
            this.setState({ minPrice: this.props.service.data.min_charge.toFixed(2) });
        }
        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language, currencyId: value1.langId })
            }
        })
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
        });


        if (!(this.state.dateTime == undefined)) {
            AsyncStorage.getItem("zoneId").then((zoneValue) => {
                if (zoneValue) {

                    // console.log('confirmationContinue', this.props);
                    // let resCons = {
                    //     "userLocationId": this.props.service.data.serviceLocationid,
                    //     "price": this.props.service.data.price,
                    //     "postedDate": this.props.service.data.saveDateDB,
                    //     "payment": "Credit Card",
                    //     "faourite_sp": this.props.service.data.favouriteId,
                    //     "promo_code": "AED 50 off",
                    //     "status": "STARTED",
                    //     "customerId": this.props.auth.data.id,
                    //     "currencyId": 0,
                    //     "workerId": 0,
                    //     "zoneId": zoneValue,
                    //     "serviceId": this.props.service.data.id,
                    //     "saveDBTime": this.props.service.data.saveDBTime,
                    //     "saveDbDay": this.props.service.data.saveDbDay
                    // };
                    // console.log('resCons', resCons);
                    console.log(this.props.service.data.serviceLocationid);
                    if (this.props.service.data.serviceLocationid) {
                        if (this.props.service.data.saveDateDB) {
                            const jobPrice = Number(this.props.service.data.price);
                            if (jobPrice) {
                                AsyncStorage.getItem("keyQuestionList").then((value) => {
                                    if (value) {
                                        api.post('Jobs/insertNewJob', {
                                            "userLocationId": this.props.service.data.serviceLocationid,
                                            "price": this.props.service.data.price,
                                            "postedDate": this.props.service.data.saveDateDB,
                                            "payment": "Credit Card",
                                            "faourite_sp": this.props.service.data.favouriteId,
                                            "promo_code": "AED 50 off",
                                            "status": "STARTED",
                                            "customerId": this.props.auth.data.id,
                                            "currencyId": this.state.currencyId,
                                            "workerId": 0,
                                            "zoneId": zoneValue,
                                            "serviceId": this.props.service.data.id,
                                            "saveDBTime": this.props.service.data.saveDBTime,
                                            "saveDbDay": this.props.service.data.saveDbDay,
                                            "expectedTimeInterval": this.props.service.data.time_interval,
                                            "questionList": value
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
                                }).catch(res => {
                                });
                            }
                            else {
                                this.setState({
                                    loader: false
                                });
                                Alert.alert('Please give proper price to submit the job.');
                            }



                        } else {
                            this.setState({
                                loader: false
                            });
                            Alert.alert('Please add time.');
                        }

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
                                <Text style={{ color: "#747474", fontSize: 14 }}>
                                    {parseInt(this.props.service.data.time_interval / 60)} hour {this.props.service.data.time_interval % 60 < 10 ? "0" + this.props.service.data.time_interval % 60 : this.props.service.data.time_interval % 60}  min
                                </Text>
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 16 }}>{this.state.currency} {this.props.service.data.price}</Text>
                            <Text style={{ color: '#747474', fontSize: 12 }}>Min Price {this.state.currency} {(this.props.service.data.min_charge)}</Text>



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
                            <Text style={styles.confirmationMainTxt}>{I18n.t('date_and_time')}</Text>
                            <Text style={styles.confirmationDateTime}>{this.state.dateTime}</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmationItem} onPress={() => this.navigate('LocationList')}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='location' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>{I18n.t('location')}</Text>
                            <Text style={styles.confirmationDateTime}>{this.state.serviceName}</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmationItem} onPress={() => this.startPayment()}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='credit-card' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>{I18n.t('payment')}</Text>
                            <Text style={styles.confirmationDateTime}>Credit Card / Debit Card</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmationItem} onPress={() => this.goToSpListing()}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='heart' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>{I18n.t('favourite_sp')}</Text>
                            <Text style={styles.confirmationDateTime}>{this.props.service.data.favouriteSp}</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </TouchableOpacity>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <Entypo name='scissors' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>{I18n.t('promo_code')}</Text>
                            <Text style={styles.confirmationDateTime}>{this.state.currency} 50 off</Text>
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
                        <TouchableOpacity style={styles.confirmationServicefooterItem} onPress={() => this.confirmationContinue()} disabled={this.state.continueButtonDesable}><Text style={styles.confirmationServicefooterItmTxt}>{I18n.t('continue')}</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.confirmationServicefooterItem2}>
                            <Text style={styles.confirmationServicefooterItmTxt}>{this.state.currency} {this.props.service.data.price}</Text>
                        </TouchableOpacity>
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
