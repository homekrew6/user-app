import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, getUserDetail } from './elements/authActions';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import api from '../../api';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text } from 'native-base';

import I18n from '../../i18n/i18n';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const launchscreenBg = require('../../../img/bg-login.png');
const launchscreenLogo = require('../../../img/logo.png');
const buttonImage = require('../../../img/bg-button.png');

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Menu' })],
});
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
	        email: '',
      password: '',
    };
  }
  pressForgotPassword() {
    this.props.navigation.navigate('ForgotPassword');
  }

  pressLogin() {
	    if (!this.state.email) {
	      Alert.alert('Please enter email');
	      return false;
	    }
	    if (!this.state.password) {
	      Alert.alert('Please enter password');
	      return false;
	    }
	    const email = this.state.email;
    const password = this.state.password;
    api.post('Customers/approveChecking', { email: this.state.email }).then((resEdit) => {
      if (resEdit.response.is_active) {
        this.props.login(email, password).then((res) => {
          console.log(res);
          if (res.type == 'success') {
            this.props.getUserDetail(res.userId, res.id).then((userRes) => {
              console.log(userRes);
              // this.props.navigation.navigate("Menu");
              this.props.navigation.dispatch(resetAction);
            }).catch((err) => {
              Alert.alert('Login failed, please try again');
            });
          } else {
            Alert.alert('Login failed, please try again');
          }
        }).catch((err) => {
          console.log(err);
          Alert.alert('Login fail,please try again');
          // return err
        });
      }else {
        Alert.alert('You account not active, contact with admin.');
      }
    }).catch((err) => {
      Alert.alert('Login fail,please try again');
    });
  }

  clcikFacebook() {
    FBLoginManager.loginWithPermissions(['email', 'user_friends'], (error, data) => {
			  if (!error) {
        console.log('Login data: ', data);
        const profileDetails = JSON.parse(data.profile);
        if (profileDetails.email) {
          api.post('Customers/socialLoginEmailCheck', { email: profileDetails.email }).then((res) => {
            console.log(res);
            if (res.response.exist == 1) {
              Alert.alert('Email already exist');
            } else if (res.response.exist == 2) {
              this.props.login(profileDetails.email, profileDetails.id).then((resLogin) => {
                console.log(resLogin);
                if (resLogin.type == 'success') {
                  this.props.getUserDetail(resLogin.userId, resLogin.id).then((userRes) => {
                    console.log(userRes);
                    // this.props.navigation.navigate("Menu");
                    this.props.navigation.dispatch(resetAction);
                  }).catch((err) => {
                    Alert.alert('Login failed, please try again');
                  });
                } else {
                  Alert.alert('Login failed, please try again');
                }
              }).catch((err) => {
                console.log(err);
							 Alert.alert('Login fail,please try again');
							  // return err
              });
            } else {
              api.post('Customers/signup', { name: profileDetails.name, email: profileDetails.email, password: profileDetails.id, social_type: 'facebook', social_id: profileDetails.id, is_active: 1 }).then((responseJson) => {
                this.props.login(profileDetails.email, profileDetails.id).then((resLogin) => {
                  console.log(resLogin);
                  if (resLogin.type == 'success') {
                    this.props.getUserDetail(resLogin.userId, resLogin.id).then((userRes) => {
                      console.log(userRes);
                      // this.props.navigation.navigate("Menu");
                      this.props.navigation.dispatch(resetAction);
                    }).catch((err) => {
                      Alert.alert('Login failed, please try again');
                    });
                  } else {
                    Alert.alert('Login failed, please try again');
                  }
                }).catch((err) => {
                  console.log(err);
								 Alert.alert('Login fail,please try again');
								  // return err
                });
              }).catch((err) => {
                console.log(err);
              });
            }
          }).catch((err) => {
            Alert.alert('please try again.');
          });
        } else {
          Alert.alert('Email not found');
        }


        // console.log(profileDetails);
			  } else {
						  console.log('Error: ', error);
			  }
					  });
		  }


  render() {
    return (
      <Container >
        <StatusBar
          backgroundColor="#81cdc7"
        />
        {/* <Image source={launchscreenBg}> */}
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <Content>
            <FSpinner visible={this.props.auth.busy} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
            <View style={styles.logoContainer}>
            <Image source={launchscreenLogo} style={styles.logo} />
  </View>
            <View style={{ padding: 20 }}>
    <Item regular style={{ borderColor: '#29416f', borderWidth: 1, borderRadius: 2, height: 45 }}>
                <Input keyboardType={'email-address'} onChangeText={text => this.setState({ email: text })} value={this.state.email} placeholder={I18n.t('email')} style={{ textAlign: 'center', color: '#29416f', fontSize: 14 }} />
              </Item>
    <Item regular style={{ borderColor: '#29416f', marginTop: 10, borderWidth: 1, borderRadius: 2, height: 45 }}>
                <Input onChangeText={text => this.setState({ password: text })} value={this.state.password} placeholder={I18n.t('password')} secureTextEntry style={{ textAlign: 'center', color: '#29416f', fontSize: 14 }} />
              </Item>
  </View>
            <TouchableOpacity transparent style={{ height: 70, marginTop: 2, flexDirection: 'row', paddingLeft: 15, paddingRight: 15 }} onPress={() => this.pressLogin()}>
    <ImageBackground source={buttonImage} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 55 }} >
                <Text style={{ color: '#fff', fontSize: 20, marginTop: -10, height: 30 }}>{I18n.t('login')}</Text>
              </ImageBackground>
  </TouchableOpacity>
    <View>
              <TouchableOpacity onPress={() => this.pressForgotPassword()}>
    <Text style={{ textAlign: 'center', color: 'red', fontSize: 16, paddingBottom: 20 }}>
                  {I18n.t('forgot_password')}
                </Text>
  </TouchableOpacity>
  </View>
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -13 }}>
              <Text>- {I18n.t('or')} -</Text>
            </View>
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, paddingLeft: 15, paddingRight: 15 }}>
    <Button block transparent style={{ borderWidth: 1, borderColor: '#29416f', flex: 1 }} onPress={() => this.clcikFacebook()} >
                <Icon name="facebook" style={{ color: '#29416f', marginRight: 5, fontSize: 20 }} />
                <Text style={{ color: '#29416f' }}>{I18n.t('via_facebook')}</Text>
              </Button>
  </View>
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, paddingLeft: 15, paddingRight: 15 }}>
              <Button block transparent style={{ borderWidth: 1, borderColor: '#29416f', flex: 1 }}>
    <Icon name="gmail" style={{ color: '#29416f', marginRight: 5, fontSize: 20 }} />
    <Text style={{ color: '#29416f' }}>{I18n.t('via_gmail')}</Text>
  </Button>
            </View>

    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
              <Text style={{ color: '#252525' }}>{I18n.t('not_a_register_member')} </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                <Text style={{ color: '#29416f' }}>{I18n.t('signup')}</Text>
              </TouchableOpacity>
            </View>
  </Content>
  </ImageBackground>
      </Container>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
  getUserDetail: (id, auth) => dispatch(getUserDetail(id, auth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
