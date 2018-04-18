import React, { Component } from "react";
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, AsyncStorage } from 'react-native';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label, Form } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import FSpinner from 'react-native-loading-spinner-overlay';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import I18n from '../../i18n/i18n';
import api from '../../api';
import { connect } from 'react-redux';
import { navigateAndSaveCurrentScreen } from '../accounts/elements/authActions';
const win = Dimensions.get('window').width;

class MyMap extends Component {
    state = {
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        BusinessName: '',
        name: '',
        buildingName: '',
        villaNo: '',
        landmark: '',
        formatted_address: '',
        IsSpinnerVisible: false,
        locationChange: false,

    }
    componentDidMount() {
        if (this.props.navigation.state.params.screenType === 'edit') {
            const latitude = Number(this.props.navigation.state.params.latitude);
            const longitude = Number(this.props.navigation.state.params.longitude);
            this.setState({
                region: {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                },
                name: this.props.navigation.state.params.name,
                buildingName: this.props.navigation.state.params.buildingName ? this.props.navigation.state.params.buildingName : '',
                villaNo: this.props.navigation.state.params.villaNo ? this.props.navigation.state.params.villaNo : '',
                landmark: this.props.navigation.state.params.landmark ? this.props.navigation.state.params.landmark : '',
            });
        }
    }
    //called user move maps
    onRegionChange = (region) => {
        this.setState({ region: region });
    }
    //called when user select dropdown location
    onLocationChange = (region) => {
        if (this.state.locationChange) {
            this.setState({ region: region });
        }
    }
    ChangeNameText(text) {
        this.setState({ name: text });
    }
    ChangeBuildingText(text) {
        this.setState({ buildingName: text });
    }
    ChangeVillaNoText(text) {
        this.setState({ villaNo: text });
    }
    ChangeLandmarkText(text) {
        this.setState({ landmark: text });
    }

    onMapDoneClick() {
        
        //Add map
        if (this.props.navigation.state.params.screenType === 'add') {
            const customerId = this.props.navigation.state.params.customerId;
            const id = this.props.navigation.state.params.id;
            const name = this.state.name;
            const buildingName = this.state.buildingName;
            const villaNo = this.state.villaNo;
            const landmark = this.state.landmark ? this.state.landmark
                : this.state.formatted_address;
            const latitude = this.state.region.latitude;
            const longitude = this.state.region.longitude;
            if(name){
                if(buildingName){
                    if(villaNo){
                        this.setState({ IsSpinnerVisible: true });
                        api.post('user-locations', {
                            name: name,
                            buildingName: buildingName,
                            villa: villaNo,
                            landmark: landmark,
                            latitude: latitude,
                            longitude: longitude,
                            customerId: customerId
                        }).then(res => {
                            this.setState({ IsSpinnerVisible: false });
                            const data = this.props.auth.data;
                            AsyncStorage.getItem("fromConfirmation").then((fromConfirmation) => {
                                if (fromConfirmation) {
                                    data.activeScreen = "LocationList";
                                    data.previousScreen = "Confirmation";
                                    this.props.navigateAndSaveCurrentScreen(data);
                                    this.props.navigation.navigate('LocationList');
                                }
                                else {
                                    data.activeScreen = "MyLocation";
                                    data.previousScreen = "Menu";
                                    this.props.navigateAndSaveCurrentScreen(data);
                                    this.props.navigation.navigate('MyLocation');
                                }
                            })
                        }).catch((err) => {
                            console.log(err);
                            this.setState({ IsSpinnerVisible: false });
                            Alert.alert("Please try again later");
                        });
                    }else{
                        
                    }
                }else{
                    Alert.alert('Please add building name');
                }
               
            }else{
                Alert.alert('Please add name');
            }
            
           
        } else if (this.props.navigation.state.params.screenType === 'edit') {
            //Edit Map
            const customerId1 = this.props.navigation.state.params.customerId;
            const id1 = this.props.navigation.state.params.id;
            const name1 = this.state.name;
            const buildingName1 = this.state.buildingName;
            const villaNo1 = this.state.villaNo;
            const landmark1 = this.state.formatted_address ? this.state.formatted_address
                : this.state.landmark;
            const latitude1 = this.state.region.latitude;
            const longitude1 = this.state.region.longitude;
            const locationEditUrl = `user-locations/${id1}`;
            if(name1){
                if(buildingName1){
                    if(villaNo1){
                        this.setState({ IsSpinnerVisible: true });
                        api.put(locationEditUrl, {
                            name: name1,
                            buildingName: buildingName1,
                            villa: villaNo1,
                            landmark: landmark1,
                            latitude: latitude1,
                            longitude: longitude1,
                            customerId: customerId1
                        }).then(res => {
                            this.setState({ IsSpinnerVisible: false });
                            const data = this.props.auth.data;
                            AsyncStorage.getItem("fromConfirmation").then((fromConfirmation) => {
                                if (fromConfirmation) {
                                    data.activeScreen = "LocationList";
                                    data.previousScreen = "Confirmation";
                                    this.props.navigateAndSaveCurrentScreen(data);
                                    this.props.navigation.navigate('LocationList');
                                }
                                else {
                                    data.activeScreen = "MyLocation";
                                    data.previousScreen = "Menu";
                                    this.props.navigateAndSaveCurrentScreen(data);
                                    this.props.navigation.navigate('MyLocation');
                                }
                            })
                            //  this.props.navigation.navigate('MyLocation');
                        }).catch((err) => {
                            console.log(err);
                            this.setState({ IsSpinnerVisible: false });
                            Alert.alert("Please try again later");
                        });
                    }else{
                        Alert.alert('Please add Villa No / Appartment No');
                    }
                }else{
                    Alert.alert('Please add building name');
                }
            }else{
                Alert.alert('Please add name');
            }

        }

    }

    goBack() {
        const data = this.props.auth.data;
        AsyncStorage.getItem("fromConfirmation").then((fromConfirmation) => {
            if (fromConfirmation) {
                data.activeScreen = "LocationList";
                data.previousScreen = "Confirmation";
                this.props.navigateAndSaveCurrentScreen(data);
                this.props.navigation.navigate('LocationList');
            }
            else {
                data.activeScreen = "MyLocation";
                data.previousScreen = "Menu";
                this.props.navigateAndSaveCurrentScreen(data);
                this.props.navigation.navigate('MyLocation');
            }
        })
        // data.activeScreen = "MyLocation";
        // data.previousScreen = "Menu";
        // this.props.navigateAndSaveCurrentScreen(data);
        // this.props.navigation.navigate('MyLocation');
    }

    render() {
        const { width, height } = Dimensions.get('screen');
        return (
            <Container >
                <StatusBar
                    backgroundColor="#cbf0ed"
                />
                <Header style={styleSelf.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                    <Button transparent onPress={() => this.goBack()} >
                        <Text style={styleSelf.backBt} >{I18n.t('cancel')}</Text>
                    </Button>
                    <Body style={styleSelf.tac}>
                        {
                            this.props.navigation.state.params.screenType === 'add' ?
                                <Text style={styleSelf.hdClr}>{I18n.t('add_location')}</Text> :
                                <Text style={styleSelf.hdClr}>{I18n.t('edit_location')}</Text>
                        }
                    </Body>

                    <Button transparent onPress={() => this.onMapDoneClick()} >
                        <Text style={styleSelf.backBt} >{I18n.t('done')}</Text>
                    </Button>

                </Header>

                <Content>

                    <View style={{ position: 'relative' }}>
                        <FSpinner visible={this.state.IsSpinnerVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                        <View style={{ position: 'absolute', top: 0, left: 0, width: win, zIndex: 9999, backgroundColor: 'rgba(204, 204, 204, 0.9)' }}>

                            <GooglePlacesAutocomplete
                                placeholder='Search'
                                minLength={2} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                listViewDisplayed='auto'    // true/false/undefined
                                fetchDetails={true}
                                renderDescription={row => row.description} // custom description render
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    this.setState({
                                        BusinessName: details.name,
                                        formatted_address: details.formatted_address,
                                        locationChange: true,
                                    });
                                    const region = {
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }
                                    this.onRegionChange(region);
                                    //this.setState({ region: region });
                                }}
                                getDefaultValue={() => ''}
                                query={{
                                    key: 'AIzaSyCya136InrAdTM3EkhM9hryzbCcfTUu7UU',
                                    language: 'en', // language of the results
                                    //types: '(cities)' // default: 'geocode'
                                }}

                                styles={{

                                    textInputContainer: {
                                        width: '100%',
                                        backgroundColor: '#cbf0ed',
                                        borderTopWidth: 0
                                    },
                                    description: {
                                        fontWeight: 'bold'
                                    },

                                }}
                                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                GoogleReverseGeocodingQuery={{
                                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                }}
                                GooglePlacesSearchQuery={{
                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                    rankby: 'distance',
                                    types: 'food'
                                }}

                                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                renderRightButton={() =>
                                    <TouchableOpacity onPress={() =>
                                        this.setState({
                                            buildingName: '',
                                            name: '',
                                            villaNo: '',
                                            landmark: '',
                                            formatted_address: ''
                                        })

                                    }
                                        style={{ alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Text style={{ color: '#1e3768', paddingRight: 10 }}>{I18n.t('cancel')}</Text>
                                    </TouchableOpacity>
                                }
                            />
                        </View>

                        <View>
                            <MapView
                                style={{ width: width, height: 250 }}
                                zoomEnabled
                                zoomControlEnabled
                                maxZoomLevel={20}
                                minZoomLevel={14}
                                region={this.state.region}
                                onRegionChangeComplete={this.onRegionChange}
                                onRegionChange={this.onLocationChange}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: this.state.region.latitude,
                                        longitude: this.state.region.longitude
                                    }}
                                    title={this.state.BusinessName}
                                />
                            </MapView>
                        </View>
                    </View>

                    <View style={{ backgroundColor: '#fff' }}>
                        <View style={{ alignSelf: 'center' }} >
                            <Text style={{ fontSize: 18, marginTop: 15, color: '#1e3768' }} >{I18n.t('additional_information')}</Text>
                        </View>
                        <View style={{ paddingRight: 10, paddingBottom: 30 }}>

                            <Form>

                                <Item floatingLabel style={{ padding: 0, margin: 0 }}>
                                    <Label style={styleSelf.inputTitleStyle}>{I18n.t('name')}</Label>
                                    <Input
                                        onChangeText={(text) => this.ChangeNameText(text)}
                                        value={this.state.name}
                                    />
                                </Item>

                                <Item floatingLabel style={{ padding: 0, margin: 0 }}>
                                    <Label style={styleSelf.inputTitleStyle}>{I18n.t('enter_building_name')}</Label>
                                    <Input
                                        value={this.state.buildingName}
                                        onChangeText={(text) => this.ChangeBuildingText(text)}
                                    />
                                </Item>


                                <Item floatingLabel style={{ padding: 0, margin: 0 }}>
                                    <Label style={styleSelf.inputTitleStyle}>{I18n.t('appartment_no')}</Label>
                                    <Input
                                        onChangeText={(text) => this.ChangeVillaNoText(text)}
                                        value={this.state.villaNo}
                                    />
                                </Item>

                                <Item floatingLabel style={{ padding: 0, margin: 0 }}>
                                    <Label style={styleSelf.inputTitleStyle}>{I18n.t('address')}</Label>
                                    <Input
                                        onChangeText={(text) => this.ChangeLandmarkText(text)}
                                        value={this.state.formatted_address ? this.state.formatted_address : this.state.landmark}
                                    />
                                </Item>

                            </Form>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

styleSelf = {
    TimingText: {
        fontSize: 20,
    },
    TimingContainer: {
        width: 50,
        height: 60,
        justifyContent: 'center',
    },
    TimingContainerFirst: {
        width: 50,
        height: 60,
        justifyContent: 'center'
    },
    hdClr: {
        color: '#1e3768',
        fontSize: 20
    },
    appHdr2: {
        backgroundColor: '#cbf0ed',
    },
    backBt: {
        fontSize: 16,
        color: "#71beb8"
    },
    tac: {
        alignItems: 'center'
    },
    inputTitleStyle: {
        fontSize: 14
    }
}

// export default MyMap;
const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    navigateAndSaveCurrentScreen: (data) => dispatch(navigateAndSaveCurrentScreen(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyMap);
