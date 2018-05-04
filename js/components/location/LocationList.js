import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import Ico from 'react-native-vector-icons/MaterialIcons';
import I18n from '../../i18n/i18n';
import api from '../../api';
const icon3 = require("../../../img/icon3.png");
class LocationList extends Component {
  state = { deleteOption: false };
  componentDidMount(){

  }
  _onLongPressButton(){
    this.setState({ deleteOption: true });
  }

  confirmDelete(){
    Alert.alert(
        'Confirm',
        'Are you sure want to delete location?',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Yes', onPress: () => this.finalDelete() },
        ],
        { cancelable: true }
    );
  }

  finalDelete(){
    api.delete(`user-locations/${this.props.uid}`).then((resDel) => {
      console.log('res del', resDel);
      this.props.Self.navigation.navigate('MyLocation');
    })
  }
  
  render() {
    return (
      <View style={{ paddingTop: 5  }}>
        <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center', backgroundColor: 'white',}}>
            
            <View style={{ flex: 2, justifyContent: 'center' }}><Image source={icon3} style={styleSelf.menuCardIcon} /></View>
            <View style={{ flex: 10, justifyContent: 'center' }}>
              <TouchableOpacity onLongPress={() => this._onLongPressButton()} >
                <Text>{this.props.listName}</Text>
              </TouchableOpacity>
            </View>
           
            <View style={{ flex: 2, justifyContent: 'center' }}>
              {
                this.state.deleteOption ?
                  <TouchableOpacity onPress={() => this.confirmDelete()}>
                  <Ico name="close" size={28} style={{color:'red'}}/>
                  </TouchableOpacity>
                : null
              }
            </View>
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
