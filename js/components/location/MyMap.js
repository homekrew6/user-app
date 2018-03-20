import React, { Component } from "react";
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label } from 'native-base';
import  MapView, { Marker } from 'react-native-maps';
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
        landmark: ''

    }
    componentDidMount(){
        console.log('navigate mount', this.props.navigation);
    }
    onRegionChange = (region) => {
        console.log('region', region);
        this.setState({ region: region });
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

        if(this.props.navigation.state.params.screenType === 'add'){
            const customerId = this.props.navigation.state.params.customerId;
            const name = this.state.name;
            const buildingName = this.state.buildingName;
            const villaNo = this.state.villaNo;
            const landmark = this.state.landmark;
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
                console.log('user-locations-post', res);
            }).catch((err) => {
                console.log(err);
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
                           <Text style={styleSelf.hdClr}>Edit Location</Text>
                       </Body>
                       <Button transparent >
                           <TouchableOpacity onPress={() => this.onMapDoneClick()}>
                             <Text style={styleSelf.backBt} >Done</Text>
                           </TouchableOpacity>
                       </Button>
                   </Header>
                   
                   <View>
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
                            this.setState({ BusinessName: details.name });
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
                        renderRightButton={() => <Text>Cancel</Text>}
                    />
                   </View>
                   <View style={{ height: 200 }}>
                       <MapView
                           style={{ width: width, height: 200 }}
                           zoomControlEnabled
                           maxZoomLevel={20}
                           minZoomLevel={16}
                           region={this.state.region}
                           onRegionChange={this.onRegionChange}
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
                            />
                       </View>
                       <View>
                           <Text style={styleSelf.inputTitleStyle}>Building/Community</Text>
                           <TextInput 
                                placeholder="Enter Building Name"
                                onChangeText={(text) => this.ChangeBuildingText(text)}
                            />
                       </View>
                       <View>
                           <Text style={styleSelf.inputTitleStyle}>APARTMENT / VILLA NO.</Text>
                           <TextInput 
                                placeholder="Enter Apartment/ vill No."
                                onChangeText={(text) => this.ChangeVillaNoText(text)} 
                           />
                       </View>
                       <View>
                           <Text style={styleSelf.inputTitleStyle}>ADDRESS (NEAREST LANDMARK)</Text>
                           <TextInput 
                                placeholder="Enter landmark" 
                                onChangeText={(text) => this.ChangeLandmarkText(text)} 
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
