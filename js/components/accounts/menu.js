import React, { Component } from "react";
import {NavigationActions} from "react-navigation";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout } from './elements/authActions'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, BackHandler } from "react-native";
import FCM, {NotificationActionType} from "react-native-fcm";

import { Container, Header, Button, Content, Form, Item, Icon, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title  } from "native-base";

import I18n from '../../i18n/i18n';
import styles from "./styles";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
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
        console.log(props);

    }

    logout(){
      this.props.logout(res=>{
  			if(res){
  				//this.props.navigation.navigate("Login")
          this.props.navigation.dispatch(resetAction);
  			}else{
  				this.props.navigation.navigate("Menu")
  			}
  		})
    }

    render() {
      //let self=this;
      // BackHandler.addEventListener('hardwareBackPress', function() {
      //   console.log('menu props', self);
      //   //debugger;
      //   if(self.props.navigation.state.routeName === 'Menu'){
      //     Alert.alert(
      //       'Confirm',
      //       'Are you sure to exit the app?',
      //       [
      //         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      //         {text: 'OK', onPress: () =>  BackHandler.exitApp()},
      //       ],
      //       { cancelable: false }
      //     )
      //   }
        
      //   return true;
      // });

      
      // FCM.presentLocalNotification({
      //   id: new Date().valueOf().toString(),                // (optional for instant notification)
      //   title: "Test Notification with action",             // as FCM payload
      //   body: "Force touch to reply",                       // as FCM payload (required)
      //   sound: "bell.mp3",                                  // "default" or filename
      //   priority: "high",                                   // as FCM payload
      //   click_action: "com.myapp.MyCategory",               // as FCM payload - this is used as category identifier on iOS.
      //   badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
      //   number: 10,                                         // Android only
      //   ticker: "My Notification Ticker",                   // Android only
      //   auto_cancel: true,                                  // Android only (default true)
      //   large_icon: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",                           // Android only
      //   icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
      //   big_text: "Show when notification is expanded",     // Android only
      //   sub_text: "This is a subText",                      // Android only
      //   color: "red",                                       // Android only
      //   vibrate: 300,                                       // Android only default: 300, no vibration if you pass 0
      //   wake_screen: true,                                  // Android only, wake up screen when notification arrives
      //   group: "group",                                     // Android only
      //   picture: "https://google.png",                      // Android only bigPicture style
      //   ongoing: true,                                      // Android only
      //   my_custom_data:'my_custom_field_value',             // extra data you want to throw
      //   lights: true,                                       // Android only, LED blinking (default false)
      //   show_in_foreground: true                           // notification when app is in foreground (local & remote)
      // });


      // FCM.presentLocalNotification({
      //   title: 'Test Notification with action',
      //   body: 'Force touch to reply',
      //   priority: "high",
      //   show_in_foreground: true,
      //   click_action: "com.myidentifi.fcm.text", // for ios
      //   android_actions: JSON.stringify([{
      //     id: "view",
      //     title: 'view'
      //   },{
      //     id: "dismiss",
      //     title: 'dismiss'
      //   }]) // for android, take syntax similar to ios's. only buttons are supported
      // });

        return (
            <Container >
              <StatusBar
                backgroundColor="#81cdc7"
              />
              <Content>
                <Header style={{ backgroundColor: '#fff' }}>
                  <Button transparent/>
                  <Body style={styles.appHdrtitleWarp}>
                    <Image source={logo_hdr} style={{ height: 18, width: 110 }}/>
                  </Body>
                  <Button transparent >
                  <Icon name='search' style={{ color: '#81cdc7' }}/>
                  </Button>

                </Header>


                <Card>
                  <CardItem style={styles.pcard}>

                    <View style={styles.flx_View}>
                      {
                        this.props.auth.data.image ? (
                          <Image source={{uri: this.props.auth.data.image}} style={styles.profileImage}/>
                        ):(
                          <Image source={profileImage} style={styles.profileImage}/>
                        )
                      }

                      <View>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("EditProfile")}>
                          <Text style={styles.pname}>{this.props.auth.data.name}</Text>
                          <Text style={styles.pemail}>{this.props.auth.data.email}</Text>
                          <Text style={styles.pphone}>{this.props.auth.data.phone}</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </CardItem>

                  <CardItem>
                    <View style={styles.pBtmTxt }>
                      <Text style={styles.pBtmTxt_Txt}>Credit: AED 0.00</Text>
                    </View>
                  </CardItem>

                </Card>

                <Card>

                  <CardItem style={styles.menuCarditem}>
                    <View style={styles.menuCardView}>
                      <Image source={icon1} style={styles.menuCardIcon}/>
                      <Text style={styles.menuCardTxt}>Google Plus</Text>
                      <View style={styles.artNt}>
                        <Text style={styles.artNtTxt}>4</Text>
                      </View>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={ styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                    <View style={styles.menuCardView}>
                      <Image source={icon2} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>My Jobs</Text>
                      <View style={styles.artNt}>
                        <Text style={styles.artNtTxt}>2</Text>
                      </View>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                  <TouchableOpacity style={styles.menuCardView} onPress={() => this.props.navigation.navigate('Category')}>
                      <Image source={icon2} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>Post A New Job</Text>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                  </TouchableOpacity>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                      <TouchableOpacity style={styles.menuCardView} onPress={() => this.props.navigation.navigate('MyLocation')}>
                        <Image source={icon3} style={styles.menuCardIcon} />
                        <Text style={styles.menuCardTxt}>My Location</Text>
                        <View style={styles.arw_lft}>
                          <Image source={back_arow} style={styles.arw_lft_img} />
                        </View>
                      </TouchableOpacity>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                    <View style={styles.menuCardView}>
                      <Image source={icon4} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>My Card</Text>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                    <View style={styles.menuCardView}>
                      <Image source={icon5} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>MY promo Code</Text>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                    <View style={styles.menuCardView}>
                      <Image source={icon6} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>Support</Text>
                    <View style={styles.arw_lftgit}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                    <View style={ styles.menuCardView} >
                      <Image source={icon7} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>Settings</Text>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem} >
                    <View style={ styles.menuCardView} >

                      <Image source={icon8} style={styles.menuCardIcon} onPress={() =>this.logout()}/>
                      <Text style={styles.menuCardTxt} onPress={() =>this.logout()}>Logout</Text>
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

Menu.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout:(cb)=>dispatch(logout(cb))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
