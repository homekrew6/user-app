import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, BackHandler, TouchableOpacity, ImageBackground, AsyncStorage ,Text} from 'react-native';
import Ico from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FSpinner from 'react-native-loading-spinner-overlay';
import api from '../../api';
import { setServiceDetails } from './elements/serviceActions';
import { Container, Header, Button, Content,Item, Label, Body, Picker } from 'native-base';
import I18n from '../../i18n/i18n';
import styles from './styles';
import Modal from "react-native-modal";
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require('../../../img/logo2.png');
const carveImage = require('../../../img/bg-5.png');
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
      serviceId: '',
      locationArray: []
    };
  }

  activateBackAlert(){
  
    if(this.props.currentRoute === 'Category' ){
      if(this.props.prevRoute === '' ){
        BackHandler.addEventListener('hardwareBackPress', function () {
          console.log('hardwareBackPress', this.props);
          if(this.props.currentRoute === 'Category' || this.props.currentRoute === 'Login'){
              Alert.alert(
                  'Confirm',
                  'Are you sure to exit the app?',
                  [
                      { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                      { text: 'OK', onPress: () => BackHandler.exitApp() },
                  ],
                  { cancelable: false }
              );
              return true;
          }else{
              this.props.navigation.goBack(null);
              return true;
          }
        }.bind(this));
      }
    }
  }


  componentWillMount() {

    api.get('Zones/getParentZone').then((res) => {
      //console.log(res);
      if (res.zone.length > 0) {
        this.setState({ zoneList: res.zone, selectedZoneDetails: res.zone[0], selected1: res.zone[0].id })
        AsyncStorage.setItem("zoneId", res.zone[0].id.toString()).then((res) => {

        });
        api.post('serviceZones/getZoneRelatedService', { zone: res.zone[0].id }).then((resService) => {
          console.log('khalid', resService);
          if (resService.response.length > 0) {
            api.get('WorkerSkills').then((workerSkillsList) => {
              let checkServiceIdsList=[];
              workerSkillsList.map((item)=>{
                checkServiceIdsList.push(item.serviceId);
              });
               let zoneServiceIdCheck = [];
            resService.response.map((data, key)=>{
              if(data.service && (data.service.is_active === true || data.service.is_active === null)){
                if(checkServiceIdsList.includes(data.service.id))
                {
                  zoneServiceIdCheck.push(data)
                }
               
              }
            })
            this.setState({ serviceList: zoneServiceIdCheck });
            this.setState({ visible: false });
            }).catch((err1) => {
              let zoneServiceIdCheck = [];
              resService.response.map((data, key) => {
                if (data.service && (data.service.is_active === true || data.service.is_active === null)) {
                  zoneServiceIdCheck.push(data)
                }
              })
              this.setState({ serviceList: zoneServiceIdCheck });
              this.setState({ visible: false });
              this.setState({ visible: false });
            })
          }
        }).catch((err) => {
          //console.log(err);
          this.setState({ visible: false });
        });

      }
    }).catch((err) => {
      this.setState({ visible: false });
    });
    if (this.props.auth.data) {

      let customerId = this.props.auth.data.id;
      const getLocationUrl = `user-locations?filter={"where":{"customerId":${customerId}}}`;
      api.get(getLocationUrl).then(res => {
        //let newArray = res;
        console.log('this is test');
        this.setState({ locationArray: res });
        console.log(this.state.locationArray);

      }).catch((err) => {
        console.log("this is an error");
        console.log(err);
      });
      console.log(this.state.locationArray);
    }
  }
  componentDidMount() {
    if(this.props.auth.loggedIn) {
      api.post('Customers/checkIfPaymentPending', { id: this.props.auth.data.id }).then((resPay) => {
        if(resPay.response.IsPayPending) {
          Alert.alert(I18n.t('please_pay_pending_amount'));
          this.props.navigation.goBack();
        }  
      });
    }
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
  closeModal(data1) {
    this.setState({ IsModalVisible: false });
    this.setState({ visible: true });
    // const data = this.props.auth.data;
    // data.activeScreen = "ServiceDetails";
    // data.previousScreen = "Category";
    // this.props.navigateAndSaveCurrentScreen(data);
    let data2 = this.props.service.data;
    let serviceLocationid = data1.id;
    // data.serviceLocation = this.state.homeArray;
    data2.serviceLocation = data1.name;
    data2.serviceLocationid = serviceLocationid;
    this.props.setServiceDetails(data2);

    this.setState({ visible: false });
    this.props.navigation.navigate('ServiceDetails', {
      serviceId: this.state.serviceId,
      banner_image: this.state.banner_image,
      cover_image: this.state.cover_image,
      ServiceName: this.state.selectedServiceName
    });
  }
  onValueChange(value) {
    AsyncStorage.setItem("zoneId", value.toString()).then((res) => {
        
    });
    //console.log(value);
    this.setState({
      selected1: value,
    });
    this.setState({ visible: true })
    api.post('serviceZones/getZoneRelatedService', { zone: value }).then((res) => {
      console.log(res.response);
      if (res.response.length > 0) {
        this.setState({ selectedZoneDetails: res.response[0].zone, serviceList: res.response });
        api.get('WorkerSkills').then((workerSkillsList) => {
          let checkServiceIdsList = [];
          workerSkillsList.map((item) => {
            checkServiceIdsList.push(item.serviceId);
          });
          let zoneServiceIdCheck = [];
          resService.response.map((data, key) => {
            if (data.service && (data.service.is_active === true || data.service.is_active === null)) {
              if (checkServiceIdsList.includes(data.service.id)) {
                zoneServiceIdCheck.push(data)
              }

            }
          })
          this.setState({ serviceList: zoneServiceIdCheck });
          this.setState({ visible: false });
        }).catch((err1) => {
          let zoneServiceIdCheck = [];
          resService.response.map((data, key) => {
            if (data.service && (data.service.is_active === true || data.service.is_active === null)) {
              zoneServiceIdCheck.push(data)
            }
          })
          this.setState({ serviceList: zoneServiceIdCheck });
          this.setState({ visible: false });
          this.setState({ visible: false });
        })
        this.setState({ visible: false });
      }
    }).catch((err) => {
      //console.log(err);
      this.setState({ visible: false })
    });
    //console.log(this.state.coverImgWith);
  }
  takeToServiceDetails(data) {
    this.props.setServiceDetails(data);
    this.props.navigation.navigate('ServiceDetails');
  }
  render() {
    this.activateBackAlert();
    let serviceListing;
    let serviceType;

    serviceType = (
      this.state.locationArray.map((data, key) => {
        //if (!data.service) return;
        return (
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', borderRadius: 10 }} key={data.id}>
            <TouchableOpacity onPress={() => this.closeModal(data)} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Ico name='business' style={{ fontSize: 20, marginRight: 10, color: '#1e3768' }} />
              <Text numberOfLines={1}>{data.name}</Text>
            </TouchableOpacity>
          </View>
        )
      })
    )

    if (this.state.serviceList.length > 0) {

      serviceListing = (
        this.state.serviceList.map((data, key) => {
          if (!data.service) return;
          return (
            <View key={data.id} style={[styles.catIten]} >
              <View style={styles.catIten_img_view}>
                {
                  this.props.auth.data && this.state.locationArray.length > 0 ? (
                    <TouchableOpacity onPress={() => this.openModal(data.service)} >

                      <Image source={{ uri: data.service.banner_image || null }} style={styles.catIten_img} />
                    </TouchableOpacity>
                  ) : (
                      <TouchableOpacity onPress={() => this.takeToServiceDetails(data.service)} >

                        <Image source={{ uri: data.service.banner_image || null }} style={styles.catIten_img} />
                      </TouchableOpacity>
                    )
                }

              </View>
              <Text style={styles.catIten_txt} numberOfLines={1}> {data.service.name || null} </Text>
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
          <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow >

            {
              this.props.auth.data.id?
              <Button transparent style={{ width: 30 }} onPress={()=> this.props.navigation.navigate('Menu')}>
                <SimpleLineIcons name="grid" style={[styles.hd_lft_icon, { fontSize: 14, color: '#fff' }]} />
              </Button>: null
            }

            <Body style={{ alignItems: 'center' }}>
              <Image source={logo_hdr} style={styles.logo_hdr_img} />
            </Body>
            {
              this.props.auth.data.id ? <Button transparent style={{ width: 30, backgroundColor: 'transparent' }} disabled />: null
            }
            
            {/* <Button transparent >
              <Ionicons name="ios-notifications-outline" style={styles.hd_rt_icon} />
            </Button>
            <Button transparent >
              <Ionicons name="ios-search-outline" style={styles.hd_rt_icon} />
            </Button> */}
          </Header>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <ImageBackground source={{ uri: this.state.selectedZoneDetails.banner_image }} style={styles.carveImage}>
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
              onPressOut={() => this.setState({ IsModalVisible: false })}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
            >
              {/* <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, height: 20, width: 20 }} onPress={() => this.setState({ IsModalVisible: false })}>
              <Ionicons name='md-close-circle' style={{ fontSize: 20, color: 'white' }} />
            </TouchableOpacity> */}

              <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                  <Text style={{ color: '#fff', fontSize: 20 }}>{this.state.selectedServiceName}</Text>
                </View>
                <View style={{ backgroundColor: '#fff', borderRadius: 10 }} >
                  {/* <View style={{ backgroundColor: '#fff', borderRadius: 10, }}>
                   <TouchableOpacity onPress={() => this.closeModal()} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name='md-home' style={{ fontSize: 20, marginRight: 10, color: '#1e3768' }} />
                    <Text>{I18n.t('home')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.closeModal()} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Ico name='business' style={{ fontSize: 20, marginRight: 10, color: '#1e3768' }} />
                    <Text>{I18n.t('office')}</Text>
                  </TouchableOpacity> 
                </View> */}
                  {serviceType}
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
{/* Categories.propTypes = {
  auth: PropTypes.object.isRequired,
}; */}

const mapStateToProps = (state) => {
  console.log('mapStateToProps cate', state);
  return {
    auth: state.auth,
    service: state.service,
    currentRoute: state.RouterOwn.currentRoute,
    prevRoute: state.RouterOwn.prevRoute
  }
}
const mapDispatchToProps = dispatch => ({
  setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
