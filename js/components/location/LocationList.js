import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import Ico from 'react-native-vector-icons/MaterialIcons';
import I18n from '../../i18n/i18n';
import api from '../../api';
const icon3 = require("../../../img/icon3.png");
class LocationList extends Component {
  state = { deleteOption: false , IsAddDisabled:false};
  componentDidMount(){
   

  }
  _onLongPressButton(){
    this.setState({ deleteOption: true });
  }

  confirmDelete(){
    Alert.alert(
      I18n.t('Confirm'),
        I18n.t('sure_to_delete_loc'),
        [
          { text: I18n.t('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: I18n.t('yes'), onPress: () => this.finalDelete() },
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
  goToMap()
  {

    this.setState({ IsAddDisabled: true });

    setTimeout(() => {
      this.setState({ IsAddDisabled: false });
    }, 3000);
    this.props.Self.navigation.navigate('MyMap', {
      screenType: 'edit',
      customerId: this.props.customerId,
      id: this.props.uid,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      name: this.props.listName,
      buildingName: this.props.buildingName,
      villaNo: this.props.villa,
      landmark: this.props.landmark
    })
  }
  render() {
    return (
      <View style={{ paddingTop: 5  }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
            
          <View style={{ paddingLeft: 10, paddingRight: 10 }}><Image source={icon3} style={styleSelf.menuCardIcon} /></View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity onLongPress={() => this._onLongPressButton()} >
                <Text>{this.props.listName}</Text>
              </TouchableOpacity>
            </View>
              {
                this.state.deleteOption ?
              <TouchableOpacity onPress={() => this.confirmDelete()} style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 8, paddingRight: 8 }}>
                      <Ico name="close" size={28} style={{color:'red'}}/>
                  </TouchableOpacity>
                : null
              }
          <TouchableOpacity disabled={this.state.IsAddDisabled} onPress={() => this.goToMap()} style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 8, paddingRight: 8, marginRight: 10 }}>
              <Ico name='edit' size={20} style={{ color: '#1e3768' }}/>
              </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default LocationList;
