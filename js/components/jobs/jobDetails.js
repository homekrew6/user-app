import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, AsyncStorage, TextInput } from "react-native";
import { Container, Header, Button, Content, Form, Left, Right, Body, Title, Item, Frame, Input, Label, Text } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Stars from 'react-native-stars-rating';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
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
            currency: 'USD',
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
            job_start_time:'',
            job_end_time:'',
            jobTrackingStatus:'',
            workerRate: 0
        }
        // const time_interval = this.props.navigation.state.params.jobDetails.service.time_interval;
        // const progressSpeed = (time_interval / 100) * 60000;
        // const progressInterval = setInterval(() => {
        //     this.setState({ workProgressTime: this.state.workProgressTime + 1 });
        // }, progressSpeed);
        this.state.trackingRef = firebaseApp.database().ref().child('tracking');
        //this.setState({ trackingRef:firebaseApp.database().ref().child('tracking')});
        //this.state.trackingRef.push({ "jobId": "4", "customerId": "2", "workerId": "3", "lat": 22.52, "lng": 48.254, "status": "ONMYWAY" });
        // console.log(this.state.itemsRef);
        // this.state.trackingRef.orderByChild('workerId').equalTo("1").once('value').then((snapshot)=>{
        //     if (snapshot && snapshot.val()) {
        //         debugger;
        //         const key = Object.keys(snapshot.val())[0];
        //         const ref = this.state.trackingRef.child(key);
        //         const data = { "jobId": "37", "customerId": "19", "workerId": "8", "lat": 22.52, "lng": 48.254, "status": "ONMYWAY" }
        //         ref.update(data);
        //     }
        //     else {
        //         this.state.trackingRef.push({ "jobId": "4", "customerId": "2", "workerId": "3", "lat": 22.52, "lng": 48.254, "status": "ONMYWAY" });
        //     }
        // })
        // firebase.database().ref().child('tracking').orderByChild('jobId').equalTo(37).once('value').then((snapshot) => {
        //     debugger;
        //      if (snapshot && snapshot.val()) { 
        //          Alert.alert('in snap'); const key = Object.keys(snapshot.val())[0]; 
        //          const ref = firebase.database().ref().child('tracking').child(key); 
        //          const data = { "jobId": this.props.navigation.state.params.jobDetails.id, "customerId": this.props.navigation.state.params.jobDetails.customerId, "workerId": this.props.auth.data.id, "lat": snapshot.val()[key].lat, "lng": snapshot.val()[key].lng, "status": "JOBSTARTED" };
                 
        //          ref.update(data); } })
        this.state.trackingRef.on('child_added', (snapshot) => {
            const snapShotVal=snapshot.val();
            if (snapShotVal.customerId == this.props.auth.data.id.toString())
            {
                    if (snapShotVal.status == 'ONMYWAY') {
                        this.setState({ topScreenStatus: 'ONMYWAY', latitudeUser: snapShotVal.lat, longitudeUser: snapShotVal.lng });
                    }
                    else if (snapShotVal.status == 'JOBSTARTED') {
                        const jobDetails = this.state.jobDetails;
                        this.setState({ topScreenStatus: 'JOBSTARTED', job_start_time: jobDetails.jobStartTime, job_end_time: jobDetails.jobEndTime });
                    }
                
            }

        })
        this.state.trackingRef.on('child_changed', (snapshot) => {
            const snapShotVal = snapshot.val();
            if (snapShotVal.customerId == this.props.auth.data.id.toString()) {
                if(snapShotVal.status=='ONMYWAY')
                {
                    this.setState({ topScreenStatus:'ONMYWAY', latitudeUser:snapShotVal.lat, longitudeUser:snapShotVal.lng});
                }
                else if (snapShotVal.status=='JOBSTARTED')
                {
                    const  jobDetails=this.state.jobDetails;
                    this.setState({ topScreenStatus: 'JOBSTARTED', job_start_time: jobDetails.jobStartTime, job_end_time:jobDetails.jobEndTime});
                }
            }

        })
      
        
    }

    componentDidMount() {
        api.post('Jobs/getJobDetailsById', { id: this.props.navigation.state.params.jobDetails.id }).then((res) => {
            this.setState({
                loader: false,
                jobDetails: res.response.message[0],
                topScreenStatus:res.response.message[0].status
            })
            // this.setState({
            //     loader: false,
            //     jobDetails: res.response.message[0],
            //     topScreenStatus: 'COMPLETED'
            // })
            if(this.state.jobDetails.status=='STARTED')
            {
                this.setState({ jobTrackingStatus:'Job Requested'});
            }
            else if(this.state.jobDetails.status=='ACCEPTED')
            {
                this.setState({ jobTrackingStatus: 'Krew Assigned' });
            }
            else if (this.state.jobDetails.status == 'ONMYWAY') {
                this.setState({ jobTrackingStatus: 'Krew On The Way' });
            }
            else if (this.state.jobDetails.status == 'JOBSTARTED') {
                this.setState({ jobTrackingStatus: 'Job Started' });
            }
            else if (this.state.jobDetails.status == 'COMPLETED') {
                this.setState({ jobTrackingStatus: 'Job Completed' });
            }
            const time_interval = this.state.jobDetails.service.time_interval;
            const progressSpeed = (time_interval / 100) * 60000;
            const progressInterval = setInterval(() => {
                this.setState({ workProgressTime: this.state.workProgressTime + 1 });
            }, progressSpeed);
            if (this.state.jobDetails.status == "STARTED" && this.state.jobDetails.status == "ACCEPTED") {
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
    }

    renderMap() {
        //let JobDetailsData = this.props.navigation.state.params.jobDetails;
        let JobDetailsData=this.state.jobDetails;
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

    workerRateing(rating){
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
            <View stylw={{ }}>
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
                    <Text style={{ textAlign: 'center', width: '100%', fontSize: 14 }}>Please rate our KREW and your over all experience with us</Text>
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
                    <Content style={{ backgroundColor: '#ccc' }}>

                        {this.state.topScreenStatus === 'STARTED' ?
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
                            : this.state.topScreenStatus === 'ONMYWAY' || this.state.topScreenStatus === 'ACCEPTED'?
                                this.renderMap()
                                : this.state.topScreenStatus === 'JOBSTARTED' ?
                                    this.renderTimingTracking()
                                    : this.state.topScreenStatus === 'COMPLETED' ?
                                        this.renderWorkerRating()
                                        : this.state.topScreenStatus === 'cancel' ?
                                            <View></View>
                                            : console.log()
                        }


                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <Ionicons name="ios-man-outline" style={styles.jobItemIconIonicons} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('jobTracker')}</Text>
                            <Text style={styles.jobItemValue}>{this.state.jobTrackingStatus}</Text>
                        </View>
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
                                                rate={ this.state.jobDetails.workerRating}
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
                            <Text style={[styles.jobItemValue, styles.jobItemValueDateandTime]}>{this.state.jobDetails.postedDate}</Text>
                        </View>
                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <MaterialIcons name="location-on" style={styles.jobItemIcon} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('location')}</Text>
                            <Text style={styles.jobItemValue}>{this.state.jobDetails.userLocation.name}</Text>
                        </View>
                        <View style={styles.jobItemWarp}>
                            <View style={{ width: 20 }}>
                                <SimpleLineIcons name="docs" style={styles.jobItemIcon} />
                            </View>
                            <Text style={styles.jobItemName}>{I18n.t('jobSummary')}</Text>
                            <Text style={styles.jobItemValue}>{this.state.currency} {this.state.jobDetails.price}</Text>
                        </View>
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
                                        (this.state.otherReason == 0 || this.state.otherReason == 1) ? (<Text style={{ width: '100%', textAlign: 'center', color: '#fff', fontSize: 25, marginBottom: 15 }}> What went wrong? </Text>) : (<Text style={{ width: '100%', textAlign: 'center', color: '#fff', fontSize: 25, marginBottom: 15 }}> Please rate us in the App Store </Text>)
                                    }
                                    {
                                        this.state.otherReason == 0 ? (
                                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10 }}>
                                                <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }}>
                                                    <Text style={{ color: '#000' }}>Reason1</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }}>
                                                    <Text style={{ color: '#000' }}>Reason2</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }}>
                                                    <Text style={{ color: '#000' }}>Reason3</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }}>
                                                    <Text style={{ color: '#000' }}>Reason4</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', borderRadius: 10, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center' }} onPress={() => this.setState({ otherReason: 1 })}>
                                                    <Text style={{ color: '#000' }}>Others Reason</Text>
                                                </TouchableOpacity>
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
                                                    <TextInput placeholder="Tell us here what went wrong?" style={{ width: '100%', backgroundColor: '#fff', borderWidth: 0, borderRadius: 10, paddingLeft: 10, paddingRight: 10, height: 200, textAlign: 'center', textAlignVertical: 'top' }} multiline={true} underlineColorAndroid='transparent'  >

                                                    </TextInput>
                                                </View>
                                                <View style={{ backgroundColor: '#fff', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center', marginBottom: -1 }}>
                                                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'red', alignItems: 'center', height: 45, justifyContent: 'center' }} onPress={() => this.setState({ otherReason: 0 })}><Text style={{ color: '#fff' }} >{I18n.t('back')}</Text></TouchableOpacity>
                                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 45, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ otherReason: 2 })}><Text style={{ color: '#fff' }}>{I18n.t('ok')}</Text></TouchableOpacity>
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
                            (this.state.jobDetails.status == "STARTED") ?
                                <View style={styles.jobItemWarp}>
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ jobCancelModal: true })}>
                                        <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('cancel_job')}</Text>
                                    </TouchableOpacity>
                                </View>
                                : console.log()
                        }

                        {
                            this.state.jobDetails.status == "ACCEPTED" ?
                                <View style={styles.jobItemWarp}>
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#81cdc7', height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ jobCancelModal: true })}>
                                        <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('cancel_job')}</Text>
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
