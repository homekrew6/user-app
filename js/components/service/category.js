import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, ImageBackground  } from 'react-native';
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FSpinner from 'react-native-loading-spinner-overlay';
import api from '../../api';
import { setServiceDetails } from './elements/serviceActions';
import { navigateAndSaveCurrentScreen} from '../accounts/elements/authActions';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Picker } from 'native-base';
import I18n from '../../i18n/i18n';
import styles from './styles';
import Modal from "react-native-modal";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require('../../../img/logo2.png');
const carveImage = require('../../../img/bg-5.png');
const img11 = require('../../../img/icon11.png');
const img12 = require('../../../img/icon12.png');
const img13 = require('../../../img/icon13.png');
const img14 = require('../../../img/icon14.png');
const img15 = require('../../../img/icon15.png');
const img16 = require('../../../img/icon16.png');
const img17 = require('../../../img/icon17.png');

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: 'key0',
      coverImgWith: deviceWidth + 120,
      zoneList: [],
      serviceList: [],
      selectedZoneDetails: '',
      visible: true,
      IsModalVisible: false,
      selectedServiceName: '',
      serviceId: ''
    };
  }

  componentWillMount() {
    api.get('Zones/getParentZone').then((res) => {
      //console.log(res);
      if (res.zone.length > 0) {
        this.setState({ zoneList: res.zone, selectedZoneDetails: res.zone[0], selected1: res.zone[0].id })

        api.post('serviceZones/getZoneRelatedService', { zone: res.zone[0].id }).then((resService) => {
          console.log('khalid', resService);
          if (resService.response.length > 0) {


            let zoneServiceIdCheck = [];
            resService.response.map((data, key)=>{
              if(data.service && (data.service.is_active === true || data.service.is_active === null)){
                zoneServiceIdCheck.push(data)
              }
            })
            this.setState({ serviceList: zoneServiceIdCheck });
            //console.log(this.state.serviceList)
            this.setState({ visible: false });
          }
        }).catch((err) => {
          //console.log(err);
          this.setState({ visible: false });
        });

      }
    }).catch((err) => {
      this.setState({ visible: false });
    });
  }
  openModal(data) {
    console.log('data on open Modal', data);
    //Alert.alert('Click is working');
    this.props.setServiceDetails(data);
    this.setState({
       IsModalVisible: true, 
       selectedServiceName: data.name, 
       serviceId: data.id,
       banner_image: data.banner_image,
       cover_image: data.cover_image
    });
  }
  closeModal() {
    this.setState({ IsModalVisible: false });
    const data=this.props.auth.data;
    data.activeScreen ="ServiceDetails";
    data.previousScreen="Category";
    this.props.navigateAndSaveCurrentScreen(data);
    this.props.navigation.navigate('ServiceDetails', {
      serviceId: this.state.serviceId,
      banner_image: this.state.banner_image,
      cover_image: this.state.cover_image,
      ServiceName: this.state.selectedServiceName
    });
  }
  onValueChange(value) {
    //console.log(value);
    this.setState({
      selected1: value,
    });
    this.setState({ visible: true })
    api.post('serviceZones/getZoneRelatedService', { id: value }).then((res) => {
      //console.log(res);
      if (res.response.length > 0) {
        this.setState({ selectedZoneDetails: res.response[0].zone, serviceList: res.response })
        //console.log(this.state.selectedZoneDetails)
        //console.log(this.state.serviceList)
        this.setState({ visible: false })
      }
    }).catch((err) => {
      //console.log(err);
      this.setState({ visible: false })
    });
    //console.log(this.state.coverImgWith);
  }

  render() {
    let serviceListing;
    if (this.state.serviceList.length > 0) {

      serviceListing = (
        this.state.serviceList.map((data, key) => {
          console.log('category list', data)
          if (!data.service) return;
          return (
            <View key={data.id} style={styles.catIten}>
              <View style={styles.catIten_img_view}>
                <TouchableOpacity onPress={() => this.openModal(data.service)}>

                  <Image source={{ uri: data.service.banner_image || null }} style={styles.catIten_img} />
                </TouchableOpacity>
              </View>
              <Text style={styles.catIten_txt}>{data.service.name || null}</Text>
            </View>
          )
        })
      )
    }
    let zoneItems = this.state.zoneList.map((s) => {
      //return <Picker.Item key={s.id} label={s.name}  value={s.id}/>
      return <Item key={s.id} label={s.name} value={s.id} />
    });


    return (
      <Container >
        <StatusBar
          backgroundColor="#cbf0ed"
        />
        <Content style={styles.bgWhite} >
          <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
          <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
            <Button transparent >
              <SimpleLineIcons name="grid" style={styles.hd_lft_icon} />
            </Button>
            <Body style={{ alignItems: 'center' }}>
              <Image source={logo_hdr} style={styles.logo_hdr_img} />
            </Body>
            <Button transparent >
              <Ionicons name="ios-notifications-outline" style={styles.hd_rt_icon} />
            </Button>
            <Button transparent >
              <Ionicons name="ios-search-outline" style={styles.hd_rt_icon} />
            </Button>
          </Header>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <ImageBackground  source={{ uri: this.state.selectedZoneDetails.banner_image }} style={styles.carveImage}>
                <View style={{ width: 120 }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange.bind(this)}
                    supportedOrientations="Portrait"
                  >
                    {zoneItems}
                  </Picker>
                </View>
              </ImageBackground >
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>
            <Image source={img17} style={{ width: deviceWidth, height: 50 }} />
          </View>

          <View style={styles.catIten_hdr}>
            <Text style={styles.catIten_hdr_txt}>{I18n.t('browse_by_categories')}</Text>
          </View>
          <Modal isVisible={this.state.IsModalVisible}
            animationIn="slideInLeft"
            animationOut="slideOutRight"
            hideModalContentWhileAnimating={true}
          >
          <TouchableOpacity 
            activeOpacity={1} 
            onPressOut={() => this.setState({IsModalVisible : false})}
            style={{  flex: 1, alignItems: 'center', justifyContent: 'center' , flexDirection: 'row'}}
          >
            {/* <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, height: 20, width: 20 }} onPress={() => this.setState({ IsModalVisible: false })}>
              <Ionicons name='md-close-circle' style={{ fontSize: 20, color: 'white' }} />
            </TouchableOpacity> */}

            <View style={{ flex: 1 }}>
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>{this.state.selectedServiceName}</Text>
              </View>
              <View style={{   }} >
                <View style={{ backgroundColor: '#fff', borderRadius: 10, }}>
                  <TouchableOpacity onPress={() => this.closeModal()} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name='md-home' style={{ fontSize: 20, marginRight: 10, color: '#1e3768' }} />
                    <Text>{I18n.t('home')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.closeModal()} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Ico name='business' style={{ fontSize: 20, marginRight: 10, color: '#1e3768' }} />
                    <Text>{I18n.t('office')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
          </TouchableOpacity>
          </Modal>
          <View style={styles.catIten_txt_warp}>
            {serviceListing}
          </View>

        </Content>
      </Container>
    );
  }
}

// export default Categories;
Categories.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  service: state.service
});

const mapDispatchToProps = dispatch => ({
  setServiceDetails: (data) => dispatch(setServiceDetails(data)),
  navigateAndSaveCurrentScreen: (data) => dispatch(navigateAndSaveCurrentScreen(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
