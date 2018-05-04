import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, getUserDetail, checkAuth } from './elements/authActions';
import { Image, View, StatusBar, Alert, TouchableOpacity, ImageBackground, AsyncStorage } from 'react-native';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import {GoogleSignin} from 'react-native-google-signin';
import FCM, { FCMEvent } from "react-native-fcm";
import api from '../../api';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Button, Content, Item, Input, Label, Text } from 'native-base';

import I18n from '../../i18n/i18n';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const launchscreenBg = require('../../../img/bg-login.png');
const launchscreenLogo = require('../../../img/logo.png');
const buttonImage = require('../../../img/bg-button.png');

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Menu' })],
});

const resetAction1 = NavigationActions.reset({
  index: 1,
  actions: [NavigationActions.navigate({ routeName: 'ServiceDetails' }),
    NavigationActions.navigate({ routeName: 'Confirmation'})
   ],
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
	      email: '',
        password: '',
        deviceToken: '',
    };
  }
  componentDidMount(){
    FCM.getFCMToken().then(token => {
      this.setState({ deviceToken: token });
    });
    GoogleSignin.configure({
      webClientId: '16831185707-hpfq3aigemrct3qnfogjf19t864fr0kp.apps.googleusercontent.com', 
      offlineAccess: true 
    }).then(() => {
      // you can now call currentUserAsync()
    });
  }

  clickGmail(){
    GoogleSignin.signIn().then((user) => {
        if (user.email) {
          api.post('Customers/socialLoginEmailCheck', { email: user.email }).then((res) => {
            if (res.response.exist == 1) {
              Alert.alert('Email already exist');
            } else if (res.response.exist == 2) {
              this.props.login(user.email, user.id).then((resLogin) => {
                if (resLogin.type == 'success') {
                  //updating Device token for push notification
                  this.props.checkAuth((res) => {
                    if (res) {
                      api.put(`Customers/editCustomer/${res.userId}?access_token=${res.id}`, { deviceToken: this.state.deviceToken }).then((resEdit) => {
                        //getting user details
                        this.props.getUserDetail(resLogin.userId, resLogin.id).then((userRes) => {
                          this.props.navigation.dispatch(resetAction);
                        }).catch((err) => {
                          Alert.alert('Login failed, please try again');
                        });
                        //getting user details end
                      }).catch((err) => {

                      });
                    }
                  }, (err) => {
                  });
                  //update device token for push notification end

                } else {
                  Alert.alert('Login failed, please try again');
                }
              }).catch((err) => {
                Alert.alert('Login fail,please try again');
                // return err
              });
            } else {
              api.post('Customers/signup', { name: user.name, email: user.email, password: user.id, social_type: 'google', social_id: user.id, is_active: 1, "deviceToken": this.state.deviceToken }).then((responseJson) => {
                this.props.login(user.email, user.id).then((resLogin) => {
                  if (resLogin.type == 'success') {
                    this.props.getUserDetail(resLogin.userId, resLogin.id).then((userRes) => {
                      // this.props.navigation.navigate("Menu");
                      this.props.navigation.dispatch(resetAction);
                    }).catch((err) => {
                      Alert.alert('Login failed, please try again');
                    });
                  } else {
                    Alert.alert('Login failed, please try again');
                  }
                }).catch((err) => {
                  Alert.alert('Login fail,please try again');
                  // return err
                });
              }).catch((err) => {
              });
            }
          }).catch((err) => {
            Alert.alert('please try again.');
          });
        } else {
          Alert.alert('Email not found');
        }
        //this.setState({ user: user });
      })
      .catch((err) => {
        Alert.alert('Login failed, please try again');
      })
      .done();
  }

  pressForgotPassword() {
    this.props.navigation.navigate('ForgotPassword');
  }

  pressLogin() {
	    if (!this.state.email) {
	      Alert.alert('Please enter email');
	      return false;
      }
      let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!regEmail.test(this.state.email)) {
        Alert.alert('Please enter a valid email');
        return false;
      }
	    if (!this.state.password) {
	      Alert.alert('Please enter password');
	      return false;
      }
	    const email = this.state.email.trim();
      const password = this.state.password.trim();
    api.post('Customers/approveChecking', { email: this.state.email }).then((resEdit) => {
      if (resEdit.response.is_active) {
        this.props.login(email, password).then((res1) => {
          if (res1.type == 'success') {

            //updating Device token for push notification
            this.props.checkAuth((res) => {
              if (res) {
                api.put(`Customers/editCustomer/${res.userId}?access_token=${res.id}`, { deviceToken: this.state.deviceToken }).then((resEdit) => {
                  //check from local storage
                  this.props.getUserDetail(res.userId, res.id).then((userRes) => {
                    AsyncStorage.getItem('keyQuestionList').then((value) => {
                      if (value) {
                        AsyncStorage.setItem("fromLogin", "true").then((resT) => {
                          const data = this.props.auth.data;
                          //this.props.navigation.dispatch(resetAction1);
                          this.props.navigation.dispatch( 
                            NavigationActions.reset({
                                index: 3,
                                actions: [
                                  NavigationActions.navigate({ routeName: 'Menu' }),
                                  NavigationActions.navigate({ routeName: 'Category' }),
                                  NavigationActions.navigate({ routeName: 'ServiceDetails' }),
                                  NavigationActions.navigate({ routeName: 'Confirmation' }),
                                ],
                            })
                          );
                          //this.props.navigation.navigate('Confirmation');
                        })

                      } else {
                        this.props.navigation.dispatch(resetAction);
                      }
                    })
                  }).catch((err) => {
                    Alert.alert('Login failed, please try again');
                  });
                  //local storage check end
                }).catch((err) => {
                  Alert.alert('Login failed, please try again');
                });
              }
            }, (err) => {
              Alert.alert('Login failed, please try again');
            });
            //update device token for push notification end

            
          } else {
            Alert.alert('Login failed, please try again');
          }
        }).catch((err) => {
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
        const profileDetails = JSON.parse(data.profile);
        if (profileDetails.email) {
          api.post('Customers/socialLoginEmailCheck', { email: profileDetails.email }).then((res) => {
            if (res.response.exist == 1) {
              Alert.alert('Email already exist');
            } else if (res.response.exist == 2) {
              this.props.login(profileDetails.email, profileDetails.id).then((resLogin) => {
                if (resLogin.type == 'success') {

                  //updating Device token for push notification
                  this.props.checkAuth((res) => {
                    if (res) {
                      api.put(`Customers/editCustomer/${res.userId}?access_token=${res.id}`, { deviceToken: this.state.deviceToken }).then((resEdit) => {
                        //getting user details
                        this.props.getUserDetail(resLogin.userId, resLogin.id).then((userRes) => {
                          // this.props.navigation.navigate("Menu");
                          this.props.navigation.dispatch(resetAction);
                        }).catch((err) => {
                          Alert.alert('Login failed, please try again');
                        });
                        //getting user details end
                      }).catch((err) => {

                      });
                    }
                  }, (err) => {
                    Alert.alert('Login failed, please try again');
                  });
                  //update device token for push notification end


                  
                } else {
                  Alert.alert('Login failed, please try again');
                }
              }).catch((err) => {
							 Alert.alert('Login fail,please try again');
							  // return err
              });
            } else {
              api.post('Customers/signup', { name: profileDetails.name, email: profileDetails.email, password: profileDetails.id, social_type: 'facebook', social_id: profileDetails.id, is_active: 1, "deviceToken": this.state.deviceToken }).then((responseJson) => {
                this.props.login(profileDetails.email, profileDetails.id).then((resLogin) => {
                  if (resLogin.type == 'success') {
                    this.props.getUserDetail(resLogin.userId, resLogin.id).then((userRes) => {
                      // this.props.navigation.navigate("Menu");
                      this.props.navigation.dispatch(resetAction);
                    }).catch((err) => {
                      Alert.alert('Login failed, please try again');
                    });
                  } else {
                    Alert.alert('Login failed, please try again');
                  }
                }).catch((err) => {
								 Alert.alert('Login fail,please try again');
								  // return err
                });
              }).catch((err) => {
                Alert.alert('Login fail,please try again');
              });
            }
          }).catch((err) => {
            Alert.alert('please try again.');
          });
        } else {
          Alert.alert('Email not found');
        }

			  } else {
            Alert.alert(error.message);
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
            <TouchableOpacity transparent style={{ height: 50, marginTop: 2, flexDirection: 'row', paddingLeft: 15, paddingRight: 15 }} onPress={() => this.pressLogin()}>
              <ImageBackground source={buttonImage} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 55 }} >
                <Text style={{ color: '#fff', fontSize: 20, marginTop: -10, height: 30 }}>{I18n.t('login')}</Text>
              </ImageBackground>
            </TouchableOpacity>
    <View>
              <TouchableOpacity onPress={() => this.pressForgotPassword()} style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 15 }}>
                <Text style={{ textAlign: 'right', color: '#29416f', fontSize: 12, paddingBottom: 20,  }}>
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
              <Button block transparent style={{ borderWidth: 1, borderColor: '#29416f', flex: 1 }} onPress={() => this.clickGmail()}>
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

// Login.propTypes = {
//   auth: PropTypes.object.isRequired,
// };
const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
  getUserDetail: (id, auth) => dispatch(getUserDetail(id, auth)),
  checkAuth: cb => dispatch(checkAuth(cb))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
