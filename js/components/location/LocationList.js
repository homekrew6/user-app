import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import I18n from '../../i18n/i18n';

const icon3 = require("../../../img/icon3.png");
class LocationList extends Component {
  componentDidMount(){

  }
  state = {};
  render() {
    return (
      <View style={{ paddingTop: 5  }}>
        <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', backgroundColor: 'white',}}>
            <View style={{ flex: 2, justifyContent: 'center' }}><Image source={icon3} style={styleSelf.menuCardIcon} /></View>
            <View style={{ flex: 12, justifyContent: 'center' }}><Text>{this.props.listName}</Text></View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.props.Self.navigation.navigate('MyMap', {
                screenType: 'edit',
                customerId: this.props.customerId,
                id: this.props.uid,
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                name: this.props.listName,
                buildingName: this.props.buildingName,
                villaNo: this.props.villa,
                landmark: this.props.landmark
                })}>
                <Text>{I18n.t('edit')}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  }
}

export default LocationList;
