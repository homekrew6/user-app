import React, { Component } from "react";
// import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { NavigationActions } from "react-navigation";
import moment from 'moment';
import { Image, View, CheckBox, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, AsyncStorage, TextInput, Text } from "react-native";
import { Container, Header, Button, Content, Body, Title, Item } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Stars from 'react-native-stars-rating';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Communications from 'react-native-communications';
import FSpinner from 'react-native-loading-spinner-overlay';
import I18n from '../../i18n/i18n';
import api from '../../api/index';
import Modal from "react-native-modal";


//import firebaseApp from '../../../App';
import * as firebase from 'firebase';
const win = Dimensions.get('window').width;
const { width } = Dimensions.get('window');
const height = parseInt(Dimensions.get('window').height / 20);
const paused = require("../../../img/paused.png");
// const firebaseConfig = {
//     apiKey: "AIzaSyCnS3M8ZZBYRH4QubDH3OJPKSgk-03Nm9w",
//     authDomain: "krew-user-app.firebaseapp.com",
//     databaseURL: "https://krew-user-app.firebaseio.com",
//     storageBucket: "krew-user-app.appspot.com"
// };
const firebaseConfig = {
    apiKey: "AIzaSyCRclijPdb65nW25fvZozVv0LekbC0GHRM",
    authDomain: "homekrew-91b4e.firebaseapp.com",
    databaseURL: "https://homekrew-91b4e.firebaseio.com",
    storageBucket: "homekrew-91b4e.appspot.com"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const paymentUrl = 'https://secure.telr.com/gateway/mobile.xml';
var parseString = require('react-native-xml2js').parseString;
var xml2js = require('react-native-xml2js');
let headers = {
    'Accept': 'application/xml',
    'Content-Type': 'application/xml',
}
import styles from "./styles";
class JobDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'AED',
            otherReason: 0,
            loader: true,
            jobCancelModal: false,
            jobDetails: '',
            markerStatus: false,
            topScreenStatus: 'STARTED',
            cancelJobButton: false,
            workProgressTime: 0,
            waypointStart: { latitude: '', longitude: '' },
            waypointEnd: { latitude: '', longitude: '' },
            waypointMid: { latitude: '', longitude: '' },
            latitudeUser: '',
            longitudeUser: '',
            errorLocationUser: '',
            trackingRef: '',
            job_start_time: '',
            job_end_time: '',
            jobTrackingStatus: '',
            workerRate: 0,
            reason: '',
            favValue: false,
            refreshing: false,
            reasonList: [],
            reasonName: '',
            reasonId: '',
            materialTotalPrice: 0,
            hoursPrice: 0,
            spinner: false,
            currencyList: [],
            IsSpDisabled: false,
            IsFollowDisabled: false,
            IsTrackerDisabled:false,
            IsSummaryDisabled:false,
            IsResDisabled:false
        }

        this.state.trackingRef = firebaseApp.database().ref().child('tracking');
        this.state.trackingRef.on('child_added', (snapshot) => {
            const snapShotVal = snapshot.val();
            if (this.state.jobDetails.id) {
                if (snapShotVal.jobId == this.state.jobDetails.id.toString()) {
                    if (snapShotVal.status == 'ONMYWAY') {
                        let jobDetails = this.state.jobDetails;
                        jobDetails.status = "ONMYWAY";
                        this.setState({ jobDetails: jobDetails, topScreenStatus: 'ONMYWAY', latitudeUser: snapShotVal.lat, longitudeUser: snapShotVal.lng, jobTrackingStatus: 'Krew On The Way' });
                    }
                    else if (snapShotVal.status == 'JOBSTARTED') {
                        const jobDetails = this.state.jobDetails;
                        let job_start_time = snapShotVal.startTime ? moment(snapShotVal.startTime).format('LT') : '';
                        let job_end_time = snapShotVal.endTime ? moment(snapShotVal.endTime).format('LT') : '';
                        this.setState({ topScreenStatus: 'JOBSTARTED', job_start_time: job_start_time, job_end_time: job_end_time });
                    }
                    else if (snapShotVal.status == 'FOLLOWEDUP') {
                        const jobDetails = this.state.jobDetails;
                        this.setState({ topScreenStatus: 'FOLLOWEDUP', job_start_time: '', job_end_time: '', jobTrackingStatus: 'Job Completed' });
                    }
                    else if (snapShotVal.status == 'PAYPENDING') {
                        const jobDetails = this.state.jobDetails;
                        this.setState({ topScreenStatus: 'PAYPENDING', job_start_time: '', job_end_time: '', jobTrackingStatus: 'Payment Pending' });
                        Alert.alert(I18n.t("continue_with_the_payment"));
                    }

                }
            }


        })
        this.state.trackingRef.on('child_changed', (snapshot) => {
            const snapShotVal = snapshot.val();
            if (this.state.jobDetails.id) {
                if (snapShotVal.jobId == this.state.jobDetails.id.toString()) {
                    if (snapShotVal.status == 'ONMYWAY') {
                        let jobDetails = this.state.jobDetails;
                        jobDetails.status = snapShotVal.status;
                        this.setState({ topScreenStatus: 'ONMYWAY', jobDetails: jobDetails, latitudeUser: snapShotVal.lat, longitudeUser: snapShotVal.lng, jobTrackingStatus: 'Krew On The Way' });
                    }
                    else if (snapShotVal.status == 'JOBSTARTED') {
                        let job_start_time = moment(snapShotVal.startTime).format('LT');
                        let job_end_time = moment(snapShotVal.endTime).format('LT');
                        let jobDetails = this.state.jobDetails;
                        jobDetails.status = snapShotVal.status;
                        this.setState({ topScreenStatus: 'JOBSTARTED', jobDetails: jobDetails, job_start_time: job_start_time, job_end_time: job_end_time, jobTrackingStatus: 'Job Started' });
                    }
                    else if (snapShotVal.status == 'COMPLETED') {
                        let jobDetails = this.state.jobDetails;
                        jobDetails.status = snapShotVal.status;
                        this.setState({ topScreenStatus: 'COMPLETED', job_start_time: '', jobDetails: jobDetails, job_end_time: '', jobTrackingStatus: 'Job Completed' });
                    }
                    else if (snapShotVal.status == 'FOLLOWEDUP') {
                        let jobDetails = this.state.jobDetails;
                        jobDetails.status = snapShotVal.status;
                        this.setState({ topScreenStatus: 'FOLLOWEDUP', job_start_time: '', jobDetails: jobDetails, job_end_time: '', jobTrackingStatus: 'Job Completed' });
                    }
                    else if (snapShotVal.status == 'PAYPENDING') {
                        let jobDetails = this.state.jobDetails;
                        jobDetails.status = snapShotVal.status;
                        this.setState({ topScreenStatus: 'PAYPENDING', job_start_time: '', jobDetails: jobDetails, job_end_time: '', jobTrackingStatus: 'Payment Pending' });
                        Alert.alert(I18n.t("continue_with_the_payment"));
                    }
                }
            }

        })


    }

    getLocalTimeFormat(gmtTime) {
        //const gmtToDeiveTimeObj = moment.tz(gmtTime, "Europe/London"); 
        //const timezoneDevice = DeviceInfo.getTimezone(); 
        //const gmtToDeiveTime = gmtToDeiveTimeObj.clone().tz('Asia/Kolkata').format('ddd DD-MMM-YYYY hh:mm A'); 

        let dateNow = new Date();
        var nUTC_diff = dateNow.getTimezoneOffset();
        let slicedDate = gmtTime.slice(0, -4);
        let timeToMan = Math.abs(nUTC_diff);
        let utc_check = Math.sign(nUTC_diff);
        let localTime;
        if (utc_check === 1 || utc_check === 0) {
            localTime = moment(slicedDate).subtract(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
        } else {
            localTime = moment(slicedDate).add(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
        }
        return localTime;
    }

    showConfirmDialog(reason) {
        Alert.alert(
            I18n.t('Confirm'),
            I18n.t('are_you_sure_to_cancel'),
            [
                { text: I18n.t('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: I18n.t('ok'), onPress: () => this.cancelJob(reason) },
            ],
            { cancelable: false }
        )
    }
    showConfirm() {
        Alert.alert(
            I18n.t('Confirm'),
            I18n.t('are_you_sure_to_cancel'),
            [
                { text: I18n.t('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: I18n.t('ok'), onPress: () => this.cancelJob(this.state.reason, true) },
            ],
            { cancelable: false }
        )
    }
    cancelJob(reason, IsOther) {


        if (IsOther != undefined && IsOther == true) {
            this.setState({ jobCancelModal: false });
            let cancelJobData = { postingTime: this.state.jobDetails.postingTime, id: this.state.jobDetails.id, status: "CANCELLED", reason: reason.name };
            api.post('Jobs/cancelJobByUser', cancelJobData).then((res) => {
                if (res.response.type == "SUCCESS") {
                    this.props.navigation.navigate('JobList');
                }
                else {
                    Alert.alert(I18n.t('please_try_again_later'));
                }
            })
        }
        else {
            this.setState({ jobCancelModal: false });
            let cancelJobData1 = { postingTime: this.state.jobDetails.postingTime, id: this.state.jobDetails.id, status: "CANCELLED", reason: reason.name };
            api.post('Jobs/cancelJobByUser', cancelJobData1).then((res) => {
                if (res.response.type == "SUCCESS") {
                    this.props.navigation.navigate('JobList');
                }
                else {
                    Alert.alert(I18n.t('please_try_again_later'));
                }
            })
        }

    }
    onCompleteFirebaseCall(snapshot) {
        if (snapshot && snapshot.val()) {
            const key = Object.keys(snapshot.val())[0];
            const ref = firebase.database().ref().child('tracking').child(key);
            console.warn(key);
            const data = {
                "jobId": `${this.props.navigation.state.params.jobDetails.id}`,
                "customerId": `${this.props.auth.data.id}`,
                "workerId": `${this.props.navigation.state.params.jobDetails.customerId}`,
                "lat": snapshot.val()[key].lat,
                "lng": snapshot.val()[key].lng,
                "status": "COMPLETED",
            }
            ref.update(data).then((thenRes) => {
                //complete job DB update
                let price = this.props.navigation.state.params.jobDetails.price;
                const jobId = this.props.navigation.state.params.jobDetails.id;
                const customerId = this.props.navigation.state.params.jobDetails.customerId;
                const languageName = this.props.navigation.state.params.jobDetails.customer.languageName ? this.props.navigation.state.params.jobDetails.customer.languageName : 'en';
                api.post('Jobs/completeJob', {
                    "id": jobId, "status": "COMPLETED", "customerId": customerId, "workerId": this.state.jobDetails.workerId,
                    "price": price,
                    "languageName": languageName
                }).then(responseJson => {
                    api.post('Jobs/getJobDetailsById', {
                        "id": this.props.navigation.state.params.jobDetails.id,
                        "workerId": this.state.jobDetails.workerId
                    }).then((response) => {
                        this.setState({ jobDetails: response.response.message[0], spinner: false, jobTrackingStatus: 'Job Completed' });
                    }).catch((err) => {

                    })
                }).catch(err => {

                })
                //end complete job DB update //
            })
        }
    }
    componentDidMount() {
        api.post('Jobs/getJobDetailsById', { id: this.props.navigation.state.params.jobDetails.id }).then((res) => {
            if (res.response.message[0].price) { res.response.message[0].price = parseFloat(res.response.message[0].price).toFixed(2); }
            this.setState({
                loader: false,
                jobDetails: res.response.message[0],
                topScreenStatus: res.response.message[0].status,
                favValue: res.response.message[0].IsFavouriteWorker
            });

            // this.setState({
            //     loader: false,
            //     jobDetails: res.response.message[0],
            //     topScreenStatus: 'COMPLETED'
            // })
            api.get('Currencies').then((res) => {
                let finalList = [];
                res.map((item) => {
                    if (item.is_active) {
                        finalList.push(item);
                    }
                });
                this.setState({ currencyList: finalList });
                AsyncStorage.getItem("currency").then((value) => {
                    // if (value) {
                    //     const value1 = JSON.parse(value);
                    //     this.setState({ currency: value1.language })
                    // }
                    if (value) {
                        if (this.state.jobDetails && this.state.jobDetails.currencyId) {
                            this.state.currencyList.map((item) => {
                                if (item.id == this.state.jobDetails.currencyId) {
                                    this.setState({ currency: item.name })
                                }
                            })
                        }
                    }
                    else {
                        if (this.state.jobDetails && this.state.jobDetails.currencyId) {
                            this.state.currencyList.map((item) => {
                                if (item.id == this.state.jobDetails.currencyId) {
                                    this.setState({ currency: item.name })
                                }
                            })
                        }
                    }

                });
            })
            if (this.props.navigation.state.params.IsPaymentDone != undefined && this.props.navigation.state.params.IsPaymentDone == true) {

                this.setState({ spinner: true });
                //update firebase on complete job
                let jobIdTr = `${this.props.navigation.state.params.jobDetails.id}`;
                let refCompleteFirebase = firebase.database().ref().child('tracking');
                refCompleteFirebase.orderByChild('jobId').equalTo(jobIdTr).once('value').then((snapshot) => {
                    this.onCompleteFirebaseCall(snapshot);
                    setTimeout(() => {
                        if (this.state.loader === true) {
                            this.onCompleteFirebaseCall(snapshot);
                            setTimeout(() => {
                                refCompleteFirebase.off();
                                Alert.alert(I18n.t('please_try_again_later'));
                                this.setState({ loader: false });
                            }, 5000);
                        }
                    }, 5000);
                })
            }
            else {

                if (this.state.jobDetails.status == 'STARTED') {
                    this.setState({ jobTrackingStatus: 'Job Requested' });
                }
                else if (this.state.jobDetails.status == 'CANCELLED') {
                    this.setState({ jobTrackingStatus: 'Job Cancelled' });
                }
                else if (this.state.jobDetails.status == 'ACCEPTED') {
                    this.setState({ jobTrackingStatus: 'Krew Assigned' });
                }
                else if (this.state.jobDetails.status == 'ONMYWAY') {
                    this.setState({ jobTrackingStatus: 'Krew On The Way' });
                }
                else if (this.state.jobDetails.status == 'PAYPENDING') {
                    this.setState({ jobTrackingStatus: 'Payment Pending' });
                }
                else if (this.state.jobDetails.status == 'FOLLOWEDUP') {
                    this.setState({ jobTrackingStatus: 'Follow Up' });
                    api.post('jobMaterials/getJobMaterialByJobId', { "jobId": this.state.jobDetails.id }).then((materialAns) => {
                        let materialList = materialAns.response.message;
                        materialTotalPrice = 0;
                        materialList.map((materialItem) => {
                            if (materialItem.materials) {
                                materialTotalPrice = materialTotalPrice + Number(materialItem.materials.price);
                            }
                        })
                        materialTotalPrice = parseFloat(materialTotalPrice).toFixed(2);
                        this.setState({
                            materialTotalPrice: materialTotalPrice,
                            hoursPrice: Number(50)
                        })
                        // let grndtotal = (parseInt(this.state.grndtotal) + parseInt(this.state.totalPrice) + parseInt(this.state.materialTotalPrice)).toFixed(2);
                        // this.setState({
                        //     grndtotal: grndtotal,
                        // })

                    }).catch((err) => {

                    })
                }
                else if (this.state.jobDetails.status == 'JOBSTARTED') {
                    const jobDetails = this.state.jobDetails;
                    let job_start_time = moment(jobDetails.jobStartTime).format('LT');
                    let job_end_time = moment(jobDetails.jobEndTime).format('LT');
                    this.setState({ jobTrackingStatus: 'Job Started', job_start_time: job_start_time, job_end_time: job_end_time });
                }
                else if (this.state.jobDetails.status == 'COMPLETED') {
                    this.setState({ jobTrackingStatus: 'Job Completed' });
                }
                const time_interval = this.state.jobDetails.service.time_interval;
                const progressSpeed = (time_interval / 100) * 60000;
                this.setState({ workProgressTime: 0.2 });
                const progressInterval = setInterval(() => {
                    this.setState({ workProgressTime: this.state.workProgressTime + 1 });
                }, progressSpeed);
                if (this.state.jobDetails.status == "STARTED" || this.state.jobDetails.status == "ACCEPTED") {
                    this.setState({
                        cancelJobButton: true
                    })
                }
            }

        }).catch(err => {

            //reject(err)
            this.setState({
                loader: false,
            })
        })



        navigator.geolocation.getCurrentPosition((position) => {

            this.setState({
                latitudeUser: position.coords.latitude,
                longitudeUser: position.coords.longitude,
                errorLocationUser: null,
                markerStatus: false
            });
        },
            (error) => console.log('error', error),
            //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
        );


        api.get('cancelReasons').then((reason) => {
            let reasonsList = [];
            reason.map((item) => {
                if (item.is_active) {
                    item.IsSelected = false;
                    reasonsList.push(item);
                }
            })
            this.setState({ reasonList: reasonsList });

        }).catch((errReason) => {

        })



    }

    renderMap() {
        //let JobDetailsData = this.props.navigation.state.params.jobDetails;
        let JobDetailsData = this.state.jobDetails;
        let region = {
            latitude: this.state.jobDetails.userLocation.latitude ? Number(this.state.jobDetails.userLocation.latitude) : 37.78825,
            longitude: this.state.jobDetails.userLocation.longitude ? Number(this.state.jobDetails.userLocation.longitude) : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }

        let origin = { latitude: region.latitude, longitude: region.longitude };
        let destination = { latitude: this.state.latitudeUser, longitude: this.state.longitudeUser };
        let GOOGLE_MAPS_APIKEY = 'AIzaSyCya136InrAdTM3EkhM9hryzbCcfTUu7UU';


        return (
            <View>
                <MapView
                    ref={c => this.mapView = c}
                    style={{ width: win, height: 250 }}
                    zoomEnabled
                    zoomControlEnabled
                    maxZoomLevel={20}
                    //minZoomLevel={14}
                    region={region}
                    onRegionChangeComplete={this.onRegionChange}
                    onRegionChange={this.onLocationChange}
                >
                    {
                        console.log('this state', this.state)
                    }
                    {
                        this.state.longitudeUser !== '' ?
                            <MapViewDirections
                                origin={origin}
                                destination={destination}
                                apikey={GOOGLE_MAPS_APIKEY}
                                mode={'driving'}
                                strokeWidth={3}
                                strokeColor="hotpink"
                                onReady={(result) => {
                                    console.log('onready start', result, result.coordinates[0].latitude);
                                    let lastCount = result.coordinates.length - 1;
                                    let midCount = parseInt(result.coordinates.length / 2);
                                    let trDistance = parseFloat(result.distance).toFixed(1);
                                    let trDuration = parseInt(result.duration);
                                    if (trDuration > 60) {
                                        trHour = parseInt(trDuration / 60);
                                        trMinute = parseInt(trDuration % 60);
                                        trDuration = trHour + "Hour " + trMinute + "min";
                                    }
                                    this.setState({
                                        waypointStart: {
                                            latitude: result.coordinates[0].latitude,
                                            longitude: result.coordinates[0].longitude
                                        },
                                        waypointEnd: {
                                            latitude: result.coordinates[lastCount].latitude,
                                            longitude: result.coordinates[lastCount].longitude
                                        },
                                        waypointMid: {
                                            latitude: result.coordinates[midCount].latitude,
                                            longitude: result.coordinates[midCount].longitude
                                        },
                                        trDistance: trDistance,
                                        trTime: trDuration,
                                    })
                                    console.log('onready end 1', this.state, lastCount)
                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: (width / 20),
                                            bottom: height,
                                            left: (width / 20),
                                            top: height,
                                        }
                                    });
                                }}
                            /> : console.log('onready end outside', this.state)

                    }
                    {
                        this.state.markerStatus === true ?
                            //worker location
                            <Marker
                                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                                title={this.state.jobDetails.userLocation ? this.state.jobDetails.userLocation.name : ''}
                            />
                            :
                            this.state.waypointEnd.latitude !== '' ?
                                //customer location
                                <Marker
                                    coordinate={this.state.waypointEnd}
                                    title={this.state.jobDetails.userLocation ? this.state.jobDetails.userLocation.name : ''}
                                />
                                : console.log('waypointEnd', this.state.waypointEnd)
                    }
                    {
                        this.state.markerStatus === false ?
                            <Marker
                                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                                title={this.state.jobDetails.userLocation ? this.state.jobDetails.userLocation.name : ''}
                            />
                            : console.log()
                    }
                    {
                        this.state.markerStatus === true ? console.log()
                            : this.state.waypointMid.latitude !== '' ?
                                <MapView.Marker coordinate={this.state.waypointMid}>
                                    <View style={{
                                        backgroundColor: 'transparent'
                                    }}>
                                        <View style={{ backgroundColor: 'white', padding: 5, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12 }} >{this.state.trDistance} km</Text>
                                            <Text style={{ fontSize: 12 }} >{this.state.trTime}</Text>
                                        </View>
                                        <View style={{ width: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', marginTop: -5 }}>
                                            <Image source={require("../../../img/icon/arrow_down.png")} style={{ height: 20, width: 20 }} />
                                        </View>
                                    </View>
                                </MapView.Marker>
                                : console.log()
                    }
                </MapView>
            </View>
        );
    }
    goToFollow() {
        this.setState({ IsFollowDisabled: true });

        setTimeout(() => {
            this.setState({ IsFollowDisabled: false });
        }, 3000);
        this.props.navigation.navigate('FollowUp', { jobDetails: this.state.jobDetails })
    }
    workerRateing(rating) {
        this.setState({
            loader: true,
            workerRate: rating
        })
        console.log(rating);

        let d = new Date();
        api.post('ratings', {
            "IsWorkerSender": false,
            "ratingDate": d,
            "rating": rating,
            "customerId": this.props.auth.data.id,
            "workerId": this.state.jobDetails.workerId,
        }).then((res) => {
            this.props.navigation.navigate('Menu');
            this.setState({
                loader: false,
            })
        }).catch(err => {
            console.log(err);
        })
    }

    renderWorkerRating() {
        return (
            <View stylw={{}}>
                <View style={{ alignSelf: 'center', paddingTop: 20 }}>
                    <Icon name="user-o" size={50} backgroundColor="#3b5998" />
                </View>
                <View style={{ alignSelf: 'center' }}>
                    <Stars
                        isActive={true}
                        rateMax={5}
                        isHalfStarEnabled={false}
                        onStarPress={(rating) => this.workerRateing(rating)}
                        rate={this.state.workerRate}
                        size={30}
                    />
                </View>
                <View style={{ paddingBottom: 20, paddingLeft: 15, paddingRight: 15 }}>
                    <View>
                        <Text style={{ textAlign: 'center', width: '100%', fontSize: 14 }}>
                            {I18n.t('please_rate_krew')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <CheckBox
                            onValueChange={(value) => this.onClickMakeFav(value)}
                            value={this.state.favValue}
                        />
                        <Text style={{ justifyContent: 'center' }} >{I18n.t('mark_worker_fav')}</Text>
                    </View>
                </View>
            </View>
        );
    }
    renderFollowUp() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', padding: 30, alignItems: 'center' }}>
                <TouchableOpacity style={{ flex: 1 }} disabled={this.state.IsFollowDisabled} onPress={() => this.goToFollow()}>
                    <Text style={{ textAlign: 'center' }}>{I18n.t('click_to_see_follow_up')}</Text>
                </TouchableOpacity>
                <View>
                    <Image source={paused} style={{ height: 100, width: 100 }} />
                </View>
            </View>
        );
    }
    renderTimingTracking() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', padding: 30 }}>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    <View style={{ flex: 2 }}>
                        <Text>{I18n.t('start_time')}</Text>
                        <Text>{this.state.job_start_time}</Text>
                    </View>
                    <View style={{ flex: 2 }} >
                        <Text>{I18n.t('end_time')}</Text>
                        <Text>{this.state.job_end_time}</Text>
                    </View>
                </View>
                <View style={{ flex: 4 }}>
                    <AnimatedCircularProgress
                        size={120}
                        width={15}
                        fill={this.state.workProgressTime}
                        tintColor="#00e0ff"
                        onAnimationComplete={() => console.log('none')}
                        backgroundColor="#3d5875"
                    />
                </View>
            </View>
        );
    }
    onClickMakeFav(value) {
        let customerId = this.props.auth.data.id;
        let workerId = this.state.jobDetails.workerId;
        let language = this.state.jobDetails.worker.language ? this.state.jobDetails.worker.language : "en";
        if (this.state.favValue) {
            this.setState({ favValue: false });
            api.post('favoriteSps/removeSpAsFavourite', { workerId: workerId, customerId: customerId }).then((favRes) => {

            }).catch((favErr) => {

            })
        } else {
            this.setState({ favValue: true });
            api.post('favoriteSps/addSpAsFavourite', { workerId: workerId, customerId: customerId, language: language }).then((favRes) => {

            }).catch((favErr) => {
                console.log("Err", favErr);
            })
        }

        console.log(value);
    }

    onReasonSelect(reasonData) {
        let reasonsList = this.state.reasonList;
        reasonsList.map((item) => {
            if (item.id == reasonData.id) {
                item.IsSelected = true;
            }
            else {
                item.IsSelected = false;
            }
        })
        this.setState({ reasonName: reasonData.name, reasonId: reasonData.id, reasonList: reasonsList });
    }

    startPayment() {

        this.setState({
            spinner: true
        });
        var obj = {
            store: '20217', key: 'JtLPL^pgBVG@q7PZ', device: { type: 'Android', id: '36C0EC49-AA2F-47DC-A4D7-D9927A739F5F' },
            app: { name: 'Pragati', version: '1.0.0', user: '7070', id: '55555' }, tran: {
                test: '1', type: 'paypage', class: 'ecom', cartid: Math.floor(100000 + Math.random() * 900000), description: 'Krew Test Job',
                currency: 'AED', amount: this.state.jobDetails.price, language: 'en'
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
                        spinner: false
                    });
                    Alert.alert(I18n.t('please_try_again_later'));
                }
                else {

                    selfComponent.setState({
                        spinner: false
                    });

                    console.warn("pragati", result.mobile.webview[0].start[0]);
                    selfComponent.props.navigation.navigate('Payment', { jobDetails: selfComponent.state.jobDetails, amount: selfComponent.state.jobDetails.price, customerId: selfComponent.props.auth.data.id, url: result.mobile.webview[0].start[0], close: result.mobile.webview[0].close[0], abort: result.mobile.webview[0].abort[0], code: result.mobile.webview[0].code[0] });
                }


            });
        }).catch((err) => {
            this.setState({
                loader: false
            });
            Alert.alert(I18n.t('please_try_again_later'));
        })

    }

    goBackJobDetails() {
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({ routeName: 'Menu' }),
                    NavigationActions.navigate({ routeName: 'JobList' }),
                ],
            })
        );
    }
    GoToReschedule()
    {
        this.setState({ IsResDisabled: true });

        setTimeout(() => {
            this.setState({ IsResDisabled: false });
        }, 3000);
        this.props.navigation.navigate('Reschedule', { jobDetails: this.state.jobDetails })
    }
    goToSp() {
        this.setState({ IsSpDisabled: true });

        setTimeout(() => {
            this.setState({ IsSpDisabled: false });
        }, 3000);
        this.props.navigation.navigate('ServiceProviderDetails', { jobDetails: this.state.jobDetails })
    }
    goToTracker()
    {
        this.setState({ IsTrackerDisabled: true });

        setTimeout(() => {
            this.setState({ IsTrackerDisabled: false });
        }, 3000);
        this.props.navigation.navigate('JobTracker', { jobDetails: this.state.jobDetails })
    }
    goToSummary()
    {
        this.setState({ IsSummaryDisabled: true });

        setTimeout(() => {
            this.setState({ IsSummaryDisabled: false });
        }, 3000);
        this.props.navigation.navigate('jobSummary', { jobDetails: this.state.jobDetails })
    }

    render() {
        if (this.state.jobDetails) {
            return (
                <Container style={{ backgroundColor: '#fff' }}>

                    <StatusBar
                        backgroundColor="#81cdc7"
                    />

                    <FSpinner visible={this.state.spinner} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />

                    <Header style={styles.headerWarp} noShadow androidStatusBarColor="#81cdc7">
                        <Button transparent onPress={() => this.goBackJobDetails()} style={{ width: 40 }} >
                            <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                        </Button>
                        <Body style={styles.headBody}>
                            <Title><Text>{I18n.t('jobDetails')}</Text></Title>
                        </Body>
                        <Button transparent style={{ width: 40, backgroundColor: 'transparent', }} disabled={true} />
                    </Header>


                    <Content style={{ backgroundColor: '#ccc' }}  >
                        {this.state.topScreenStatus === 'STARTED' || this.state.topScreenStatus === 'CANCELLED' || this.state.topScreenStatus === 'PAYPENDING' ?
                            this.state.jobDetails.service.banner_image ? (
                                <ImageBackground source={{ uri: this.state.jobDetails.service.cover_image }} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>{this.state.jobDetails.service ? this.state.jobDetails.service.name : ''}</Text>
                                        <Text>{this.state.currency} {this.state.jobDetails.price}</Text>
                                    </View>
                                </ImageBackground>
                            ) : (
                                <ImageBackground source={require('../../../img/bg-6.png')} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>{this.state.jobDetails.service ? this.state.jobDetails.service.name : ''}</Text>
                                        <Text>{this.state.currency} {this.state.jobDetails.price}</Text>
                                    </View>
                                </ImageBackground>
                            )
                                    (
                                    <Image source={require('../../../img/icon17.png')} style={{ width: win, height: (win * 0.1), marginTop: -(win * 0.1) }} />
                                    )
                            : this.state.topScreenStatus == 'ONMYWAY' || this.state.topScreenStatus == 'ACCEPTED' ?
                                this.renderMap()
                                : this.state.topScreenStatus == 'JOBSTARTED' ?
                                    this.renderTimingTracking()
                                    : this.state.topScreenStatus == 'COMPLETED' ?
                                        this.renderWorkerRating()
                                        : this.state.topScreenStatus == 'FOLLOWEDUP' ?
                                            this.renderFollowUp()
                                            : console.log()
                        }


                        <TouchableOpacity disabled={this.state.IsTrackerDisabled} style={styles.jobItemWarp} onPress={() => this.goToTracker()}>
                            <View style={{ width: 20 }}>
                                <Ionicons name="ios-man-outline" style={styles.jobItemIconIonicons} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('jobTracker')}</Text>
                            <Text style={styles.jobItemValue}>{this.state.jobTrackingStatus}</Text>
                        </TouchableOpacity>
                        {
                            this.state.jobDetails.worker ? (
                                <View>
                                    <View style={styles.jobItemWarp}>
                                        <View>
                                            {
                                                this.state.jobDetails.worker ? (
                                                    <Image source={{ uri: this.state.jobDetails.worker.image }} style={{ height: 50, width: 50, borderRadius: 45, }} />
                                                ) : (
                                                        <Image source={require('../../../img/atul.png')} style={{ height: 50, width: 50, borderRadius: 45, }} />
                                                    )
                                            }

                                        </View>
                                        <View style={{ paddingLeft: 10, flex: 1 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{I18n.t('serviceProvider')}</Text>
                                            <Text style={{ fontSize: 12 }}>{this.state.jobDetails.worker.name}</Text>
                                            <Stars
                                                isActive={false}
                                                rateMax={5}
                                                isHalfStarEnabled={false}
                                                rate={this.state.jobDetails.workerRating}
                                                size={14}
                                            />

                                        </View>
                                        {
                                            !(this.state.jobDetails.status === 'STARTED') ?
                                                <TouchableOpacity disabled={this.state.IsSpDisabled} style={{ alignItems: 'center' }} onPress={() => this.goToSp()} >
                                                    <Image source={require('../../../img/icon/chat-support.png')} style={{ height: 25, width: 25 }} />
                                                    <Text style={{ fontSize: 12 }}>{I18n.t('chat')}/{I18n.t('call')}</Text>
                                                </TouchableOpacity> : null
                                        }
                                    </View>
                                </View>
                            ) : (
                                    <View></View>
                                )
                        }

                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <MaterialIcons name="date-range" style={styles.jobItemIcon} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('dateAndTime')}</Text>
                            <Text style={[styles.jobItemValue, styles.jobItemValueDateandTime]}>
                                {this.getLocalTimeFormat(this.state.jobDetails.postedDate)}
                            </Text>
                        </View>
                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <MaterialIcons name="location-on" style={styles.jobItemIcon} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('location')}</Text>
                            <Text style={styles.jobItemValue}>{this.state.jobDetails.userLocation ? this.state.jobDetails.userLocation.name : ''}</Text>
                        </View>
                        <TouchableOpacity disabled={this.state.IsSummaryDisabled} onPress={() => this.goToSummary()}>
                            <View style={styles.jobItemWarp}>
                                <View style={{ width: 20 }}>
                                    <SimpleLineIcons name="docs" style={styles.jobItemIcon} />
                                </View>
                                <Text style={styles.jobItemName}>{I18n.t('jobSummary')}</Text>
                                <Text style={styles.jobItemValue}>
                                    {this.state.currency} {
                                        parseFloat(this.state.jobDetails.price)
                                        + parseFloat(this.state.materialTotalPrice)
                                        + parseFloat(this.state.hoursPrice)
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {
                            this.state.topScreenStatus === 'COMPLETED' ?
                                <View style={styles.jobItemWarp}>
                                    <View style={{ width: 30, alignItems: 'center' }}>
                                        <FontAwesome name="money" style={styles.jobItemIcon} />
                                    </View>
                                    <Text style={styles.jobItemName}>{I18n.t('total_bill')}</Text>
                                    <Text style={styles.jobItemValue}>{this.state.currency}
                                        {this.state.jobDetails.price}
                                    </Text>
                                </View>
                                : console.log()
                        }
                        {/* <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <Ionicons name="ios-flag-outline" style={styles.jobItemIconIonicons} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('quoteOrFollow')}</Text>
                            <Text style={styles.jobItemValue}>Yes</Text>
                        </View> */}

                        {
                            this.state.topScreenStatus == 'PAYPENDING' ? (
                                <TouchableOpacity style={styles.jobItemWarp} onPress={() => this.startPayment()}>
                                    <View style={{ width: 20 }}>
                                        <MaterialIcons name="payment" style={styles.jobItemIcon} />
                                    </View>
                                    <Text style={styles.jobItemName}>{I18n.t('payment')}</Text>
                                    <Text style={styles.jobItemValue}>123456</Text>
                                </TouchableOpacity>
                            ) : null
                        }

                        {this.state.topScreenStatus == 'CANCELLED' ? (
                            <View style={[styles.jobItemWarp, { alignItems: 'center', justifyContent: 'center' }]}>

                                <Text style={[styles.cancelName, { textAlign: 'center' }]}>{I18n.t('canelledJob')}</Text>
                            </View>
                        ) : (
                                <View></View>
                            )}
                        <Modal isVisible={this.state.jobCancelModal}>
                            <TouchableOpacity
                                transparent style={{ flex: 1, justifyContent: 'center', display: 'flex', width: '100%' }}
                                onPress={() => this.setState({ jobCancelModal: false })}
                                activeOpacity={1}
                            >
                                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, zIndex: 99999, }} onPress={() => this.setState({ jobCancelModal: false })}>
                                    <Ionicons style={{ color: 'rgba(255,255,255,0.5)', fontSize: 36 }} name='md-close-circle' />
                                </TouchableOpacity>

                                <View style={{ padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', width: '100%' }} >

                                    {
                                        (this.state.otherReason == 0 || this.state.otherReason == 1) ? (
                                            <Text style={{ width: '100%', textAlign: 'center', color: '#fff', fontSize: 25, marginBottom: 15 }}> What went wrong? </Text>) : (<Text style={{ width: '100%', textAlign: 'center', color: '#fff', fontSize: 25, marginBottom: 15 }}>
                                                Please rate us in the App Store
                                            </Text>)
                                    }
                                    {
                                        this.state.otherReason == 0 ? (

                                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10 }}>
                                                {
                                                    this.state.reasonList.length > 0 ?
                                                        this.state.reasonList.map((reasonData, key) => {
                                                            return (
                                                                <TouchableOpacity key={key} style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }}
                                                                    onPress={() => this.showConfirmDialog(reasonData)}
                                                                >
                                                                    <Text style={{ color: '#000' }}>{reasonData.name}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                        : console.log('outer reason')
                                                }
                                            </View>
                                        ) : (console.log())
                                    }
                                    {
                                        this.state.otherReason == 1 ? (
                                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' }}>
                                                <View style={{ backgroundColor: '#81cdc7', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>
                                                    <Text style={{ color: '#fff' }}>
                                                        Others Reason
                                                </Text>
                                                </View>
                                                <View style={{ backgroundColor: '#ccc', flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }}>
                                                    <TextInput placeholder="Tell us here what went wrong?" style={{ width: '100%', backgroundColor: '#fff', borderWidth: 0, borderRadius: 10, paddingLeft: 10, paddingRight: 10, height: 200, textAlign: 'center', textAlignVertical: 'top' }} multiline={true} underlineColorAndroid='transparent' onChangeText={text => this.setState({ reason: text })} value={this.state.reason} >

                                                    </TextInput>
                                                </View>
                                                <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center', marginBottom: -1 }}>
                                                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'red', alignItems: 'center', height: 45, justifyContent: 'center' }} onPress={() => this.setState({ otherReason: 0 })}><Text style={{ color: '#fff' }} >{I18n.t('back')}</Text></TouchableOpacity>
                                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.showConfirm()}><Text style={{ color: '#fff' }}>{I18n.t('ok')}</Text></TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (console.log())
                                    }
                                    {
                                        this.state.otherReason == 2 ? (
                                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' }}>
                                                <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 20, paddingBottom: 20, justifyContent: 'center' }}>
                                                    <Text style={{ color: '#000' }}>Please rate us in the App Store</Text>
                                                </View>
                                                <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center', marginBottom: -1 }}>
                                                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'red', alignItems: 'center', height: 45, justifyContent: 'center' }} onPress={() => this.setState({ otherReason: 1 })}><Text style={{ color: '#fff' }} >{I18n.t('back')}</Text></TouchableOpacity>
                                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 45, justifyContent: 'center', alignItems: 'center' }} ><Text style={{ color: '#fff' }}>{I18n.t('ok')}</Text></TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (console.log())
                                    }
                                    {
                                        (this.state.otherReason == 0 || this.state.otherReason == 1) ? (
                                            <View style={{ width: '100%', flexDirection: 'row', padding: 15 }}>
                                                <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ jobCancelModal: false, otherReason: 0 })}>
                                                    <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('close')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (console.log())
                                    }

                                </View>

                            </TouchableOpacity>
                        </Modal>

                        {
                            (this.state.jobDetails.status == "STARTED" || this.state.jobDetails.status == "ACCEPTED") ?
                                <View style={styles.jobItemWarp}>
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ jobCancelModal: true })}>
                                        <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('cancel_job')} </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.IsResDisabled} style={{ flex: 1, backgroundColor: '#1e3768', height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.GoToReschedule()}>
                                        <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('reschedule')}</Text>
                                    </TouchableOpacity>
                                </View>
                                : console.log()
                        }

                    </Content>

                </Container>
            );
        }
        else {
            return (
                <Container>
                    <FSpinner visible={true} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                </Container>
            )
        }
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(JobDetails);
//export default JobDetails;
