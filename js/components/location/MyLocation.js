import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label } from 'native-base';
import LocationList from './LocationList';
import api from '../../api';

class MyLocation extends Component {
  state = { locationData: ''};
  componentDidMount(){
    api.get('user-locations').then(res => {
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
                           <TouchableOpacity onPress={() => this.props.navigation.navigate('MyMap')}>
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

export default MyLocation;
