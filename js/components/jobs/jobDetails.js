import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment';
import { Image, View, CheckBox, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, AsyncStorage, TextInput } from "react-native";
import { Container, Header, Button, Content, Form, Left, Right, Body, Title, Item, Frame, Input, Label, Text } from "native-base";
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
const firebaseConfig = {
    apiKey: "AIzaSyCnS3M8ZZBYRH4QubDH3OJPKSgk-03Nm9w",
    authDomain: "krew-user-app.firebaseapp.com",
    databaseURL: "https://krew-user-app.firebaseio.com",
    storageBucket: "krew-user-app.appspot.com"
};
 const firebaseApp = firebase.initializeApp(firebaseConfig);

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
            hoursPrice: 0
        }

        this.state.trackingRef = firebaseApp.database().ref().child('tracking');

        this.state.trackingRef.on('child_added', (snapshot) => {
            const snapShotVal = snapshot.val();
            if (this.state.jobDetails.id) {
                if (snapShotVal.jobId == this.state.jobDetails.id.toString()) {
                    if (snapShotVal.status == 'ONMYWAY') {
                        this.setState({ topScreenStatus: 'ONMYWAY', latitudeUser: snapShotVal.lat, longitudeUser: snapShotVal.lng });
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
                        this.setState({ topScreenStatus: 'ONMYWAY', jobDetails:jobDetails, latitudeUser: snapShotVal.lat, longitudeUser: snapShotVal.lng, jobTrackingStatus: 'Krew On The Way' });
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
        if(utc_check === 1 || utc_check === 0) {
            localTime = moment(slicedDate).subtract(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
        }else{
            localTime = moment(slicedDate).add(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
        }
        return localTime;
    }

    showConfirmDialog(reason) {
        Alert.alert(
            'Confirm',
            'Are you sure to cancel this job?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => this.cancelJob(reason) },
            ],
            { cancelable: false }
        )
    }
    showConfirm() {
        Alert.alert(
            'Confirm',
            'Are you sure to cancel this job?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => this.cancelJob(this.state.reason, true) },
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
                    Alert.alert('Please try again later.');
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
                    Alert.alert('Please try again later.');
                }
            })
        }

    }
    componentDidMount() {
        api.post('Jobs/getJobDetailsById', { id: this.props.navigation.state.params.jobDetails.id }).then((res) => {
            if(res.response.message[0].price) { res.response.message[0].price = res.response.message[0].price.toFixed(2); }
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

            console.log('jobDetails', this.state.jobDetails);

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
                    console.log(materialList);
                }).catch((err) => {
                    console.log(err);
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
        }).catch(err => {
            console.log(err);
            //reject(err)
            this.setState({
                loader: false,
            })
        })
        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language })
            }
        });

        console.log('componentDidMount', this.props);
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('position', position);
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
            let reasonsList=[];
            reason.map((item)=>{
                if(item.is_active){
                 item.IsSelected=false;
                 reasonsList.push(item);
                }  
            })
            this.setState({ reasonList: reasonsList });
            console.log('reasonsList', reasonsList);
        }).catch((errReason) => {
            console.log(errReason);
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
                                title={this.state.jobDetails.userLocation.name}
                            />
                            :
                            this.state.waypointEnd.latitude !== '' ?
                                //customer location
                                <Marker
                                    coordinate={this.state.waypointEnd}
                                    title={this.state.jobDetails.userLocation.name}
                                />
                                : console.log('waypointEnd', this.state.waypointEnd)
                    }
                    {
                        this.state.markerStatus === false ?
                            <Marker
                                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                                title={this.state.jobDetails.userLocation.name}
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
                                            <Image source={require("../../../img/icon/arrowDown.png")} style={{ height: 20, width: 20 }} />
                                        </View>
                                    </View>
                                </MapView.Marker>
                                : console.log()
                    }
                </MapView>
            </View>
        );
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
                            Please rate our KREW and your over all experience with us
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
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
    renderFollowUp()
    {
        return(
            <View style={{ flex: 1, flexDirection: 'row', padding: 30, alignItems: 'center' }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('FollowUp', { jobDetails:this.state.jobDetails})}>
                    <Text style={{ textAlign: 'center' }}>{I18n.t('click_to_see_follow_up')}</Text>
                </TouchableOpacity>
                <View>
                    <Image source={paused} style={{ height: 100, width: 100 }}/>
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
    onClickMakeFav(value){
        
        let customerId = this.props.auth.data.id;
        let workerId = this.state.jobDetails.workerId;
        if(this.state.favValue){
            this.setState({ favValue: false });
            api.post('favoriteSps/removeSpAsFavourite', {workerId: workerId, customerId: customerId}).then((favRes) =>{

            }).catch((favErr) => {
                
            })
        }else{
            this.setState({ favValue: true });
            api.post('favoriteSps/addSpAsFavourite', {workerId: workerId, customerId: customerId}).then((favRes) =>{

            }).catch((favErr) => {
                
            })
        }
        
        console.log(value);
    }

    onReasonSelect(reasonData){
        let reasonsList=this.state.reasonList;
        reasonsList.map((item)=>{
            if(item.id==reasonData.id)
            {
                item.IsSelected=true;
            }
            else
            {
                item.IsSelected=false;
            }
        })
        this.setState({ reasonName: reasonData.name, reasonId: reasonData.id, reasonList:reasonsList });
    }


    render() {
        if (this.state.jobDetails) {
            return (
                <Container style={{ backgroundColor: '#fff' }}>

                    <StatusBar
                        backgroundColor="#81cdc7"
                    />

                    <Header style={styles.headerWarp} noShadow androidStatusBarColor="#81cdc7">
                        <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                            <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                        </Button>
                        <Body style={styles.headBody}>
                            <Title>{I18n.t('jobDetails')}</Title>
                        </Body>
                        <Button transparent style={{ width: 30, backgroundColor: 'transparent', }} disabled={true} />
                    </Header>


                    <Content style={{ backgroundColor: '#ccc' }}  >

                        {this.state.topScreenStatus === 'STARTED' || this.state.topScreenStatus === 'CANCELLED' ?
                            this.state.jobDetails.service.banner_image ? (
                                <ImageBackground source={{ uri: this.state.jobDetails.service.cover_image }} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>{this.state.jobDetails.service.name}</Text>
                                        <Text>{this.state.currency} {this.state.jobDetails.price}</Text>
                                    </View>
                                </ImageBackground>
                            ) : (
                                <ImageBackground source={require('../../../img/bg-6.png')} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>{this.state.jobDetails.service.name}</Text>
                                        <Text>{this.state.currency} {this.state.jobDetails.price}</Text>
                                    </View>
                                </ImageBackground>
                            )
                                (
                                    <Image source={require('../../../img/icon17.png')} style={{ width: win, height: (win * 0.1), marginTop: -(win * 0.1) }} />
                                )
                            : this.state.topScreenStatus == 'ONMYWAY' || this.state.topScreenStatus == 'ACCEPTED' ?
                                this.renderMap()
                                : this.state.topScreenStatus =='JOBSTARTED' ?
                                    this.renderTimingTracking()
                                    : this.state.topScreenStatus == 'COMPLETED' ?
                                        this.renderWorkerRating()
                                            : this.state.topScreenStatus == 'FOLLOWEDUP' ?
                                                this.renderFollowUp()
                                                :console.log()
                        }


                        <TouchableOpacity style={styles.jobItemWarp} onPress={() => this.props.navigation.navigate('JobTracker', { jobDetails: this.state.jobDetails })}>
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
                                                        <Image source={require('../../../img/atul_bk.png')} style={{ height: 50, width: 50, borderRadius: 45, }} />
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
                                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('ServiceProviderDetails', { jobDetails: this.state.jobDetails })} >
                                            <Image source={require('../../../img/icon/chat-support.png')} style={{ height: 25, width: 25 }} />
                                            <Text style={{ fontSize: 12 }}>{I18n.t('chat')}/{I18n.t('call')}</Text>
                                        </TouchableOpacity>
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
                            <Text style={styles.jobItemValue}>{this.state.jobDetails.userLocation.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('jobSummary', {jobDetails: this.state.jobDetails})}>
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
                            this.state.topScreenStatus=== 'COMPLETED' ?
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
                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <Ionicons name="ios-flag-outline" style={styles.jobItemIconIonicons} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('quoteOrFollow')}</Text>
                            <Text style={styles.jobItemValue}>Yes</Text>
                        </View>
                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <MaterialIcons name="payment" style={styles.jobItemIcon} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('payment')}</Text>
                            <Text style={styles.jobItemValue}>1234</Text>
                        </View>
                        {this.state.topScreenStatus == 'CANCELLED' ? (
                            <View style={[styles.jobItemWarp, { alignItems: 'center' , justifyContent: 'center'}]}>

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
                                                        return(
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
                                                    <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('cancel')}</Text>
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
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#1e3768', height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('Reschedule', { jobDetails: this.state.jobDetails })}>
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
