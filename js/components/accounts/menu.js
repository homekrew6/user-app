import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from './elements/authActions'
import FSpinner from 'react-native-loading-spinner-overlay';
import { Image, View, StatusBar, Alert, TouchableOpacity, BackHandler, AsyncStorage,Text, I18nManager } from "react-native";

import { Container, Header, Button, Content, Item, Icon, Input, Label, CardItem,  Card, Body} from "native-base";

import I18n from '../../i18n/i18n';
import styles from "./styles";
import api from '../../api';

const profileImage = require("../../../img/atul.png");
const icon1 = require("../../../img/icon1.png");
const icon2 = require("../../../img/icon2.png");
const icon3 = require("../../../img/icon3.png");
const icon4 = require("../../../img/icon4.png");
const icon5 = require("../../../img/icon5.png");
const icon6 = require("../../../img/icon6.png");
const icon7 = require("../../../img/icon7.png");
const icon8 = require("../../../img/icon8.png");
const back_arow = require("../../../img/arrow_back.png");
const logo_hdr = require("../../../img/logo2.png");
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
});


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible: false,
      notificatonCount: 0,
      reRender: '',
      IsNotDisabled:false,
      IsMyJobDisabled:false,
      IsPostDisabled:false,
      IsLocationDisabled:false,
      IsQuoteDisabled:false,
      IsPromoDisabled:false,
      IsSupportDisabled:false,
      IsSettingsDisabled:false,
      IsProfileDisabled:false
    }
    I18nManager.forceRTL(false);
    AsyncStorage.getItem("language").then((value)=>{
      if(value)
      {
        const value1=JSON.parse(value);
        I18n.locale = value1.Code;
        this.setState({reRender:'fhfh'});
        if (value1.Code == 'ar') {
          I18nManager.forceRTL(true);
        }
      }
    })
   // I18n.locale = 'ar';
  }

  logout() {
    this.setState({ visible: true });
    AsyncStorage.getItem("userToken").then((userToken) => {
      if (userToken) {
        const userToken1 = JSON.parse(userToken);
        api.put(`Customers/editCustomer/${userToken1.userId}?access_token=${userToken1.id}`, { deviceToken: '' }).then((resEdit) => {
          AsyncStorage.clear();
          AsyncStorage.removeItem('userToken');
          AsyncStorage.setItem("IsSliderShown", "true").then((res) => {
              I18n.locale = "en";
            this.setState({visible: false  });
              this.props.navigation.dispatch(resetAction);
          });
          // this.props.logout(res => {
          //   if (res) {
          //     //this.props.navigation.navigate("Login")
          //     this.props.navigation.dispatch(resetAction);
          //   } else {
          //     this.props.navigation.navigate("Menu");
          //   }
          // })
        }).catch((err) => {
        });
      }
    })
  }


  // navigate(screen) {
  //   const data = this.props.auth.data;
  //   data.activeScreen = screen;
  //   data.previousScreen = "Menu";
  //   this.props.navigateAndSaveCurrentScreen(data);
    
  //   if (screen =='MyPromoCode')
  //   {
  //     this.props.navigation.navigate("MyPromoCode", {id:this.props.auth.data.id});
  //   }
  //   else
  //   {
  //     this.props.navigation.navigate(screen);
  //   }
  // }

  componentDidMount() {
     BackHandler.addEventListener('hardwareBackPress', function () {
        if(this.props.currentRoute === 'Menu'){
            Alert.alert(
              I18n.t('Confirm'),
              I18n.t('are_you_sure'),
                [
                  { text: I18n.t('cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: I18n.t('ok'), onPress: () => BackHandler.exitApp() },
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

  componentWillMount() {
    const data = this.props.auth.data;
    // data.activeScreen = "Menu";
    // this.props.navigateAndSaveCurrentScreen(data);
    // BackHandler.addEventListener('hardwareBackPress', function () {

    //   const { dispatch, navigation, nav } = this.props;
    //   if (this.props.auth.data.activeScreen && this.props.auth.data.activeScreen == 'Menu') {
    //     Alert.alert(
    //       'Confirm',
    //       'Are you sure to exit the app?',
    //       [
    //         { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //         { text: 'OK', onPress: () => BackHandler.exitApp() },
    //       ],
    //       { cancelable: false }
    //     )
    //   }
    //   else {
    //     let saveData = this.props.auth.data;
    //     // if (this.props.auth.data.previousScreen)
    //     //   this.props.navigation.navigate(this.props.auth.data.previousScreen);
    //     // else {
    //     //   this.props.navigation.navigate('Menu');
    //     // }


    //     switch (this.props.auth.data.activeScreen) {
    //       case "EditProfile":
    //         saveData.activeScreen = "Menu";
    //         saveData.previousScreen = "";
    //         this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //         case "NotificationList":
    //         saveData.activeScreen = "Menu";
    //         saveData.previousScreen = "";
    //         this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       case "Category":
    //         // saveData.activeScreen = "Menu";
    //         // saveData.previousScreen = "";
    //         // this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       case "MyLocation":
    //         // saveData.activeScreen = "Menu";
    //         // saveData.previousScreen = "";
    //         // this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //         case "MyMap":
    //         // saveData.activeScreen = "MyLocation";
    //         // saveData.previousScreen = "Menu";
    //         // this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       case "ServiceDetails":
    //         //saveData.activeScreen = "Category";
    //         //saveData.previousScreen = "Menu";
    //         //this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       case "Confirmation":
    //          saveData.activeScreen = "Confirmation";
    //          saveData.previousScreen = "Category";
    //          this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       case "DateAndTime":
    //         saveData.activeScreen = "Confirmation";
    //         saveData.previousScreen = "ServiceDetails";
    //         this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       case "ServiceProviderListing":
    //         saveData.activeScreen = "Confirmation";
    //         saveData.previousScreen = "ServiceDetails";
    //         this.props.navigateAndSaveCurrentScreen(saveData);
    //       break;
    //       case "LocationList":
    //         // saveData.activeScreen = "Confirmation";
    //         // saveData.previousScreen = "ServiceDetails";
    //         // this.props.navigateAndSaveCurrentScreen(saveData);
    //         break;
    //       default:
    //         break;
    //     }
    //     if (this.props.auth.data.activeScreen == 'Confirmation' ) {
    //       saveData.activeScreen = "ServiceDetails";
    //       saveData.previousScreen = "Category";
    //       this.props.navigateAndSaveCurrentScreen(saveData);
    //       // this.props.navigation.dispatch({
    //       //   routeName: 'ServiceDetails'
    //       // });
    //       // Alert.alert(
    //       //   'Confirm',
    //       //   'Your data will be lost',
    //       //   [
    //       //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //       //     { text: 'OK', onPress: () => this.props.navigation.navigate('ServiceDetails') },
    //       //   ],
    //       //   { cancelable: false }
    //       // )
    //       this.props.navigation.navigate('ServiceDetails');
    //       //this.props.navigation.dispatch(NavigationActions.back({ routeName:'ServiceDetails'}));
    //       return true;
    //     }else if(this.props.auth.data.activeScreen === 'ServiceDetails'){
    //       saveData.activeScreen = "Category";
    //       saveData.previousScreen = "Menu";
    //       this.props.navigateAndSaveCurrentScreen(saveData);
    //       this.props.navigation.navigate('Category')
    //     }else if(this.props.auth.data.activeScreen === 'Category'){
    //       saveData.activeScreen = "Menu";
    //       saveData.previousScreen = "";
    //       this.props.navigateAndSaveCurrentScreen(saveData);
    //       this.props.navigation.navigate('Menu')
    //     }
    //     else if(this.props.auth.data.activeScreen==='MyLocation')
    //     {
    //       saveData.activeScreen = "Menu";
    //       saveData.previousScreen = "";
    //       this.props.navigateAndSaveCurrentScreen(saveData);
    //       this.props.navigation.navigate(saveData.activeScreen);
    //     }
    //     else if(this.props.auth.data.activeScreen==='LocationList')
    //     {
    //       saveData.activeScreen = "Confirmation";
    //       saveData.previousScreen = "ServiceDetails";
    //       this.props.navigateAndSaveCurrentScreen(saveData);
    //       this.props.navigation.navigate(saveData.activeScreen);
    //     }
    //     else if(this.props.auth.data.activeScreen==='MyMap')
    //     {
    //       AsyncStorage.getItem("fromConfirmation").then((value)=>{
    //         if(value)
    //         {
    //           saveData.activeScreen = "LocationList";
    //           saveData.previousScreen = "Menu";
    //           this.props.navigateAndSaveCurrentScreen(saveData);
    //           this.props.navigation.navigate(saveData.activeScreen);
    //         }
    //         else
    //         {
    //           saveData.activeScreen = "MyLocation";
    //           saveData.previousScreen = "Menu";
    //           this.props.navigateAndSaveCurrentScreen(saveData);
    //           this.props.navigation.navigate(saveData.activeScreen);
    //         }
    //       })
         
    //     }
        
    //     else {
    //       this.props.navigation.goBack(null);
    //       return true;
    //     }

    //   }



    //   return true;
    // }.bind(this));

    api.post('Notifications/getUnreadCustomerNot', { "customerId": this.props.auth.data.id }).then((res) => {
      this.setState({ 
        notificatonCount: res.response.message,
       })
    }).catch((err) => {
      console.log(err);
    });

  }
  navigateToNot()
{
  this.setState({IsNotDisabled:true});

 setTimeout(()=>{
this.setState({IsNotDisabled:false});
 }, 3000);
  this.props.navigation.navigate('NotificationList');
}
navigateToJob()
{
  this.setState({ IsMyJobDisabled: true });

  setTimeout(() => {
    this.setState({ IsMyJobDisabled: false });
  }, 3000);
  this.props.navigation.navigate("JobList");
}
navigateToPost()
{
  this.setState({ IsPostDisabled: true });

  setTimeout(() => {
    this.setState({ IsPostDisabled: false });
  }, 3000);
  this.props.navigation.navigate('Category');
}
navigateToLoc()
{
  this.setState({ IsLocationDisabled: true });

  setTimeout(() => {
    this.setState({ IsLocationDisabled: false });
  }, 3000);
  this.props.navigation.navigate('MyLocation');
}
navigateToQuote()
{
  this.setState({ IsQuoteDisabled: true });

  setTimeout(() => {
    this.setState({ IsQuoteDisabled: false });
  }, 3000);
  this.props.navigation.navigate('QuoteList');
}

navigateToPromo()
{
  this.setState({ IsPromoDisabled: true });

  setTimeout(() => {
    this.setState({ IsPromoDisabled: false });
  }, 3000);
  this.props.navigation.navigate('MyPromoCode', { id: this.props.auth.data.id })
}
goToProfile()
{
  this.setState({ IsProfileDisabled: true });

  setTimeout(() => {
    this.setState({ IsProfileDisabled: false });
  }, 3000);
  this.props.navigation.navigate('EditProfile');
}

navigateToSupport()
{
  this.setState({ IsSupportDisabled: true });

  setTimeout(() => {
    this.setState({ IsSupportDisabled: false });
  }, 3000);
  this.props.navigation.navigate('Support')
}
navigateToSettings()
{
  this.setState({ IsSettingsDisabled: true });

  setTimeout(() => {
    this.setState({ IsSettingsDisabled: false });
  }, 3000);
  this.props.navigation.navigate('Settings');
}
  render() {
    
    return (
      <Container >
        <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
        <StatusBar
          backgroundColor="#81cdc7"
        />
        <Content>

        <Header style={{ backgroundColor: '#fff' }}>
          {/* <Button transparent /> */}
          <Body style={styles.appHdrtitleWarp}>
            <Image source={logo_hdr} style={{ height: 18, width: 110 }} />
          </Body>
          {/* <Button transparent >
            <Icon name='search' style={{ color: '#81cdc7' }} />
          </Button> */}
        </Header>


        <Card>
          <CardItem style={styles.pcard}>

            <View style={styles.flx_View}>
              {
                this.props.auth.data.image ? (
                  <Image source={{ uri: this.props.auth.data.image }} style={styles.profileImage} />
                ) : (
                    <Image source={profileImage} style={styles.profileImage} />
                  )
              }

              <View>
                <TouchableOpacity disabled={this.state.IsProfileDisabled} onPress={() => this.goToProfile()}>
                  <Text style={[styles.pname, { lineHeight: 22 }]}>{this.props.auth.data.name}</Text>
                    <Text style={[styles.pemail, { lineHeight: 22 }]}>{this.props.auth.data.email}</Text>
                    <Text style={[styles.pphone, { lineHeight: 22 }]}>{this.props.auth.data.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CardItem>

          {/* <CardItem>
            <View style={styles.pBtmTxt}>
              <Text style={styles.pBtmTxt_Txt}>Credit: AED 0.00</Text>
            </View>
          </CardItem> */}
        </Card>

        <Card>

          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsNotDisabled} onPress={() => this.navigateToNot()}>
              <Image source={icon1} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('notification')}</Text>
              {
                this.state.notificatonCount != 0 ? (  
                  <View style={styles.artNt}>
                    <Text style={styles.artNtTxt}>{this.state.notificatonCount}</Text>
                  </View>
                ):null

              }
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </TouchableOpacity>
          </CardItem>

          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsMyJobDisabled} onPress={() => this.navigateToJob()}>
              <Image source={icon2} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('my_jobs')}</Text>
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </TouchableOpacity>
          </CardItem>
          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsPostDisabled} onPress={() => this.navigateToPost()}>
              <Image source={icon2} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('post_new_job')}</Text>
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </TouchableOpacity>
          </CardItem>

          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsLocationDisabled} onPress={() => this.navigateToLoc()}>
              <Image source={icon3} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('my_location')}</Text>
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </TouchableOpacity>
          </CardItem>

          {/* <CardItem style={styles.menuCarditem}>
            <View style={styles.menuCardView}>
              <Image source={icon4} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('my_card')}</Text>
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </View>
          </CardItem> */}
            <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsQuoteDisabled} onPress={() => this.navigateToQuote()}>
                <Image source={icon4} style={styles.menuCardIcon} />
                <Text style={styles.menuCardTxt}>{I18n.t('quoteOrFollow')}</Text>
                <View style={styles.arw_lft}>
                  <Image source={back_arow} style={styles.arw_lft_img} />
                </View>
              </TouchableOpacity>
            </CardItem>

          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsPromoDisabled} onPress={() => this.navigateToPromo()} >
                <Image source={icon5} style={styles.menuCardIcon} />
                <Text style={styles.menuCardTxt}>{I18n.t('my_promo_code')}</Text>
                <View style={styles.arw_lft}>
                  <Image source={back_arow} style={styles.arw_lft_img} />
                </View>
              </TouchableOpacity>
          </CardItem>

          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsSupportDisabled} onPress={() => this.navigateToSupport()}>
              <Image source={icon6} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('support')}</Text>
              <View style={styles.arw_lftgit}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </TouchableOpacity>
          </CardItem>

          <CardItem style={styles.menuCarditem}>
              <TouchableOpacity style={styles.menuCardView} disabled={this.state.IsSettingsDisabled} onPress={() => this.navigateToSettings()}>
              <Image source={icon7} style={styles.menuCardIcon} />
              <Text style={styles.menuCardTxt}>{I18n.t('settings')}</Text>
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </TouchableOpacity>
          </CardItem>

          <CardItem style={styles.menuCarditem} >
            <View style={styles.menuCardView} >
              <Image source={icon8} style={styles.menuCardIcon} onPress={() => this.logout()} />
              <Text style={styles.menuCardTxt} onPress={() => this.logout()}>{I18n.t('logout')}</Text>
              <View style={styles.arw_lft}>
                <Image source={back_arow} style={styles.arw_lft_img} />
              </View>
            </View>
          </CardItem>

        </Card>
        <View >
          <Text style={styles.version}>Ver 2.5 Build 2425 - Aug 2017</Text>
        </View>
        </Content>
      </Container>
    );
  }
}

// Menu.propTypes = {
//   auth: PropTypes.object.isRequired
// }
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    currentRoute: state.RouterOwn.currentRoute,
    prevRoute: state.RouterOwn.prevRoute
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (cb) => dispatch(logout(cb))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);