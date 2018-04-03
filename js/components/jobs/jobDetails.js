import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, AsyncStorage } from "react-native";
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
import I18n from '../../i18n/i18n';

const win = Dimensions.get('window').width;
const { width } = Dimensions.get('window');
const height = parseInt(Dimensions.get('window').height / 20);

import styles from "./styles";
class JobDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'USD',
            markerStatus: false,
            topScreenStatus: 'timing',
            cancelJobButton: false,
            workProgressTime: 0,
            waypointStart: { latitude: '', longitude: ''},
            waypointEnd: { latitude: '', longitude: ''},
            waypointMid: { latitude: '', longitude: '' },
            latitudeUser: '',
            longitudeUser: '',
            errorLocationUser: '',
            jobDetails: this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails : '',
        }
        const time_interval = this.props.navigation.state.params.jobDetails.service.time_interval;
        const progressSpeed = (time_interval / 100) * 60000;
        const progressInterval = setInterval(() => {
            this.setState({ workProgressTime: this.state.workProgressTime + 1 });
        }, progressSpeed);
    }

    componentDidMount() {
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

    renderMap(){
        let JobDetailsData = this.props.navigation.state.params.jobDetails;
        let region = {
            latitude: this.props.navigation.state.params.jobDetails.userLocation.latitude ? Number(this.props.navigation.state.params.jobDetails.userLocation.latitude) : 37.78825,
            longitude: this.props.navigation.state.params.jobDetails.userLocation.longitude ? Number(this.props.navigation.state.params.jobDetails.userLocation.longitude) : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }

        let origin = {latitude: region.latitude, longitude: region.longitude};
        let destination = {latitude: this.state.latitudeUser, longitude: this.state.longitudeUser};
        let GOOGLE_MAPS_APIKEY = 'AIzaSyCya136InrAdTM3EkhM9hryzbCcfTUu7UU';

        
        return(
            <View>
            <MapView
                ref={c => this.mapView = c}
                style={{ width: win, height: 250 }}
                zoomEnabled
                zoomControlEnabled
                maxZoomLevel={20}
                //minZoomLevel={14}
                region={ region }
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
                        let midCount = parseInt(result.coordinates.length / 2 );
                        let trDistance = parseFloat(result.distance).toFixed(1);
                        let trDuration = parseInt(result.duration);
                        if( trDuration > 60){
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
                    title={this.props.navigation.state.params.jobDetails.userLocation.name}
                />
            :
            this.state.waypointEnd.latitude !== '' ? 
                //customer location
                <Marker
                    coordinate={this.state.waypointEnd}
                    title={this.props.navigation.state.params.jobDetails.userLocation.name}
                />
                : console.log('waypointEnd', this.state.waypointEnd)
            }
            {
                this.state.markerStatus === false ?
                <Marker
                    coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                    title={this.props.navigation.state.params.jobDetails.userLocation.name}
                />
                : console.log()
            }
            {
                this.state.markerStatus === true ? console.log()
                : this.state.waypointMid.latitude !== '' ? 
                <MapView.Marker  coordinate={this.state.waypointMid}>
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

    renderWorkerRating(){
        return(
            <View stylw={{ padding: 25 }}>
                <View style={{ alignSelf: 'center' }}>
                    <Icon name="user-o" size={50} backgroundColor="#3b5998" />
                </View>
                <View style={{ alignSelf: 'center' }}>
                    <Stars
                        isActive={true}
                        rateMax={5}
                        isHalfStarEnabled={false}
                        onStarPress={(rating) => console.log(rating)}
                        rate={3}
                        size={50}
                    />
                </View>
                <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                    <Text style={{ alignItems: 'center' }}>Please rate our KREW and your over all experience with us</Text>
                </View>
            </View>
        );
    }

    renderTimingTracking(){
        return(
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
                    { this.state.topScreenStatus === 'image' ?
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
                        : this.state.topScreenStatus === 'map' ?
                            this.renderMap()
                        : this.state.topScreenStatus === 'timing' ?
                            this.renderTimingTracking()
                        : this.state.topScreenStatus === 'rating' ?
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
                        <Text style={styles.jobItemValue}>Job Requested</Text>
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
                                        <Text style={{ fontSize: 14, fontWeight: '700' }}>Service Provider</Text>
                                        <Text style={{ fontSize: 12 }}>{this.state.jobDetails.worker.name}</Text>
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
                    {
                        this.state.cancelJobButton === true ? 
                        <View style={styles.jobItemWarp}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: 'grey', height: 40, borderBottomRightRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>{I18n.t('cancel_job')}</Text>                                    
                            </TouchableOpacity>
                        </View>
                        : console.log()
                    }
                    
                </Content>

            </Container>
        );
    }
}

export default JobDetails;
