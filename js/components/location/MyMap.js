import React, { Component } from "react";
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label } from 'native-base';
import  MapView, { Marker } from 'react-native-maps';
import FSpinner from 'react-native-loading-spinner-overlay';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import api from '../../api';

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
    componentDidMount(){
        if(this.props.navigation.state.params.screenType === 'edit'){

            console.log('navigate mount', this.props.navigation);
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
                  buildingName: this.props.navigation.state.params.buildingName? this.props.navigation.state.params.buildingName:'',
                villaNo: this.props.navigation.state.params.villaNo? this.props.navigation.state.params.villaNo:'',
                landmark: this.props.navigation.state.params.landmark? this.props.navigation.state.params.landmark: '',
            });
        }
    }

    onRegionChange = (region) => {
        console.log('region', region);
        this.setState({ region: region });
    }
    onLocationChange =(region) => {
        if(this.state.locationChange){
            this.setState({ region: region });
        }
    }
    ChangeNameText(text){
        this.setState({ name: text });
    }
    ChangeBuildingText(text){
        this.setState({ buildingName: text });
    }
    ChangeVillaNoText(text){
        this.setState({ villaNo: text });
    }
    ChangeLandmarkText(text){
        this.setState({ landmark: text });
    }

    onMapDoneClick(){
        this.setState({ IsSpinnerVisible: true });
        if(this.props.navigation.state.params.screenType === 'add'){
            const customerId = this.props.navigation.state.params.customerId;
            const id = this.props.navigation.state.params.id;
            const name = this.state.name;
            const buildingName = this.state.buildingName;
            const villaNo = this.state.villaNo;
            const landmark = this.state.landmark? this.state.landmark
            : this.state.formatted_address;
            const latitude = this.state.region.latitude;
            const longitude = this.state.region.longitude;

            
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
                 this.props.navigation.navigate('LocationList');
                console.log('user-locations-post', res);
            }).catch((err) => {
                console.log(err);
                this.setState({ IsSpinnerVisible: false });
                Alert.alert("Please try again later");
            });
        }
        if(this.props.navigation.state.params.screenType === 'edit'){
            const customerId = this.props.navigation.state.params.customerId;
            const id = this.props.navigation.state.params.id;
            const name = this.state.name;
            const buildingName = this.state.buildingName;
            const villaNo = this.state.villaNo;
            const landmark = this.state.formatted_address? this.state.formatted_address
            : this.state.landmark;
            const latitude = this.state.region.latitude;
            const longitude = this.state.region.longitude;
            const locationEditUrl = `user-locations/${id}`;
            api.put(locationEditUrl, {
                name: name, 
                buildingName: buildingName, 
                villa: villaNo, 
                landmark: landmark,
                latitude: latitude,
                longitude: longitude,
                customerId: customerId
             }).then(res => {
                 this.setState({ IsSpinnerVisible: false });
                 this.props.navigation.navigate('LocationList');
                console.log('user-locations-post', res);
            }).catch((err) => {
                console.log(err);
                this.setState({ IsSpinnerVisible: false });
                Alert.alert("Please try again later");
            });
        }
        
    }

    render(){
        const { width, height } = Dimensions.get('screen');
        return(
          <Container >
               <StatusBar
                   backgroundColor="#cbf0ed"
               />
               <ScrollView>
               <Content>
                   <Header style={styleSelf.appHdr2} androidStatusBarColor= "#cbf0ed">
                       <Button transparent >
                           <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                               <Text style={styleSelf.backBt} >Cancel</Text>
                           </TouchableOpacity>
                       </Button>
                       <Body style={styleSelf.tac}>
                            {
                               this.props.navigation.state.params.screenType === 'add' ?
                               <Text style={styleSelf.hdClr}>Add Location</Text> :
                               <Text style={styleSelf.hdClr}>Edit Location</Text>
                           }
                       </Body>
                       <Button transparent >
                           <TouchableOpacity onPress={() => this.onMapDoneClick()}>
                             <Text style={styleSelf.backBt} >Done</Text>
                           </TouchableOpacity>
                       </Button>
                   </Header>
                   
                   <View>
                   <FSpinner visible={this.state.IsSpinnerVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                   <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            console.log('on list click of map', data, details);
                            console.log(typeof(details.geometry.location.lat));
                            console.log('lat', details.geometry.location.lat);
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
                            width: '100%'
                            },
                            description: {
                            fontWeight: 'bold'
                            },
                            predefinedPlacesDescription: {
                            color: '#1faadb'
                            }
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
                        }>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        }
                    />
                   </View>
                   <View style={{ height: 200 }}>
                       <MapView
                           style={{ width: width, height: 200 }}
                           zoomEnabled
                           zoomControlEnabled
                           maxZoomLevel={20}
                           minZoomLevel={14}
                           region={this.state.region}
                           onRegionChangeComplete={this.onRegionChange}
                           onRegionChange={this.onLocationChange}
                       >
                            <Marker
                                coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
                                title={this.state.BusinessName}
                            />
                       </MapView>
                   </View>
                   <View style={{ alignSelf: 'center', height: 30 }} >
                       <Text style={{ fontSize: 20 }} >ADDITIONAL INFORMATION</Text>
                   </View>
                   <View style={{ padding: 10 }}>
                       <View>
                           <Text style={styleSelf.inputTitleStyle} >Name</Text>
                           <TextInput 
                                placeholder="Home"
                                onChangeText={(text) => this.ChangeNameText(text)}
                                value={this.state.name}
                            />
                       </View>
                       <View>
                           <Text style={styleSelf.inputTitleStyle}>Building/Community</Text>
                           <TextInput 
                                placeholder="Enter Building Name"
                                onChangeText={(text) => this.ChangeBuildingText(text)}
                                value={this.state.buildingName}
                            />
                       </View>
                       <View>
                           <Text style={styleSelf.inputTitleStyle}>APARTMENT / VILLA NO.</Text>
                           <TextInput 
                                placeholder="Enter Apartment/ vill No."
                                onChangeText={(text) => this.ChangeVillaNoText(text)}
                                value={this.state.villaNo}
                           />
                       </View>
                       <View>
                           <Text style={styleSelf.inputTitleStyle}>ADDRESS (NEAREST LANDMARK)</Text>
                           <TextInput 
                                placeholder="Enter landmark" 
                                onChangeText={(text) => this.ChangeLandmarkText(text)}
                                value={this.state.formatted_address? this.state.formatted_address : this.state.landmark}
                           />
                       </View>
                   </View>
              </Content>
              </ScrollView>
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
  hdClr:{
      color: '#1e3768',
      fontSize: 22
  },
  appHdr2: {
      backgroundColor: '#cbf0ed',
  },
  backBt: {
      fontSize: 16,
      color: "#71beb8"
  },
  tac:{
      alignItems: 'center'
  },
  inputTitleStyle: {
      fontSize: 14
  }
}

export default MyMap;
