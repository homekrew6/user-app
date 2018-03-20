import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const icon3 = require("../../../img/icon3.png");
class LocationList extends Component {
  componentDidMount(){
    console.log('LocationList', this.props);
  }
  state = {};
  render() {
    return (
      <View style={{ paddingTop: 5  }}>
        <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', backgroundColor: 'white',}}>
            <View style={{ flex: 2, justifyContent: 'center' }}><Image source={icon3} style={styleSelf.menuCardIcon} /></View>
            <View style={{ flex: 12, justifyContent: 'center' }}><Text>{this.props.listName}</Text></View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.props.Self.navigation.navigate('MyMap', {screenType: 'edit', customerId: this.props.customerId})}>
                <Text>Edit</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  }
}

export default LocationList;
