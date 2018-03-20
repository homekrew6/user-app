import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label } from 'native-base';
import LocationList from './LocationList';
import api from '../../api';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

class MyLocation extends Component {
  state = { locationData: ''};
  componentDidMount(){
    const customerId = this.props.auth.data.id;
    const getLocationUrl = `user-locations?filter={"where":{"customerId":${customerId}}}`
    api.get(getLocationUrl).then(res => {
        console.log('user-locations', res);
        this.setState({ locationData: res });
    }).catch((err) => {
        console.log(err);
    });
  }

  render() {
    return(
      <Container >
               <StatusBar
                   backgroundColor="#cbf0ed"
               />
               <Content>
                   <Header style={styleSelf.appHdr2} androidStatusBarColor= "#cbf0ed">
                       <Button transparent >
                           <TouchableOpacity onPress={() => this.props.navigation.navigate('MyMap', {screenType: 'add', customerId: this.props.auth.data.id})}>
                               <Text style={styleSelf.backBt} >Add</Text>
                           </TouchableOpacity>
                       </Button>
                       <Body style={styleSelf.tac}>
                           <Text style={styleSelf.hdClr}>My Location</Text>
                       </Body>
                       <Button transparent >
                           <TouchableOpacity onPress={() => console.log("dsf")}>
                             <Text style={styleSelf.backBt} >Done</Text>
                           </TouchableOpacity>
                       </Button>
                   </Header>
                   <View>
                    {this.state.locationData !== '' ?
                      this.state.locationData.map((lData, key) => {
                        let Self = this.props;
                        return (
                          <LocationList
                            listName={lData.name}
                            key={key}
                            buildingName={lData.buildingName}
                            landmark={lData.landmark}
                            latitude={lData.latitude}
                            longitude={lData.longitude}
                            villa={lData.villa}
                            listId={lData.id}
                            customerId={this.props.auth.data.id}
                            Self={Self}
                            uid={lData.id}
                          />
                        )
                      }) : console.log('none')
                    }
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
  menuCardIcon: {
    height: 30,
    width: 30
  },
}

const mapStateToProps = state => ({
    auth: state.auth,
  });

export default connect(mapStateToProps, {})(MyLocation);
