import React, { Component } from "react";
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label } from 'native-base';
import  MapView from 'react-native-maps';

class MyMap extends Component {
    state = {
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
    }
    onRegionChange(region) {
        this.setState({ region });
    }


    render(){
        return(
          <Container >
               <StatusBar
                   backgroundColor="#cbf0ed"
               />
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
                           <TouchableOpacity onPress={() => console.log("dsf")}>
                             <Text style={styleSelf.backBt} >Done</Text>
                           </TouchableOpacity>
                       </Button>
                   </Header>
                   <View style={{ flex: 1 }}>
                       <MapView
                           style={{ width: 320, height: 400 }}
                           region={this.state.region}
                           onRegionChange={this.onRegionChange}
                       />
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
}

export default MyMap;
