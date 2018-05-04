import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signup, login, getUserDetail, checkAuth } from './elements/authActions';
import { Image, View, ScrollView, StatusBar, Alert, TouchableOpacity, ImageBackground, AsyncStorage,Text } from 'react-native';
import FCM, { FCMEvent, NotificationType } from "react-native-fcm";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import { Container, Header, Button, Content, Item, Input, Label, CheckBox } from 'native-base';
import styles from './styles';
import I18n from '../../i18n/i18n';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import api from '../../api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopoverTooltip from 'react-native-popover-tooltip';

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
  NavigationActions.navigate({ routeName: 'Confirmation' })
  ],
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      phone: '',
      chkbox_chk: false,
      deviceToken: '',
    };
  }

  componentDidMount() {
    FCM.getFCMToken().then(token => {
      this.setState({ deviceToken: token });
    });
  }

  pressSignup() {
    // return false;
    if (!this.state.name.trim()) {
      Alert.alert('Please enter name');
      return false;
    }
    if (!this.state.email.trim()) {
      Alert.alert('Please enter email');
      return false;
    }
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regEmail.test(this.state.email)) {
      Alert.alert('Please enter a valid email');
      return false;
      Alert.alert('Please enter a valid email');
      return false;
    }
    if (!this.state.password) {
      Alert.alert('Please enter password');
      return false;
    }
    const password_pattern = /(?=.*[A-Z]).{6,}/;
    if (!password_pattern.test(this.state.password)) {
      Alert.alert('Password must have one capital letter and min six characters');
      return false;
    }
    if (!this.state.phone.trim()) {
      Alert.alert('Please enter phone');
      return false;
    }
    if (!this.state.chkbox_chk) {
      Alert.alert('Please check Terms and Conditions');
      return false;
    }



    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    const phone = this.state.phone;
    const deviceToken = this.state.deviceToken;
    api.post('Customers/socialLoginEmailCheck', { 'email': email }).then((resEmail) => {
      if (resEmail.response.exist == 0) {
        this.props.signup(name, email, password, phone, deviceToken).then((res) => {
          if (res.type == 'success') {
            //	Alert.alert('Successfully registered.');
            //	this.props.navigation.navigate('Login');
            this.props.login(email, password).then((res) => {
              if (res.type == 'success') {

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
                              // data.activeScreen = "Confirmation";
                              // data.previousScreen = "ServiceDetails";
                              // this.props.navigateAndSaveCurrentScreen(data);
                              // this.props.navigation.dispatch(resetAction1);
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
          } else {
            Alert.alert('Please check all fields and try again');
          }
        }).catch((err) => {
          Alert.alert('Please check all fields and try again');
        });
      } else {
        Alert.alert('Email already exist')
      }
    }).catch((err) => {
      Alert.alert('please try again.');
    });

  }

  clickGmail() {
    GoogleSignin.signIn()
      .then((user) => {
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

  clcikFacebook() {
    FBLoginManager.loginWithPermissions(['email', 'user_friends'], (error, data) => {
      if (!error) {
        const profileDetails = JSON.parse(data.profile);
        if (profileDetails.email) {
          api.post('Customers/socialLoginEmailCheck', { 'email': profileDetails.email }).then((res) => {

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



  chkbox_check() {
    if (this.state.chkbox_chk) {
      this.setState({ chkbox_chk: false });
    } else {
      this.setState({ chkbox_chk: true });
    }
  }

  render() {
    return (
      <Container >
        {/* <StatusBar
					backgroundColor={'transparent'}
					translucent
				/> */}
        <StatusBar
          backgroundColor="#81cdc7"
        />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <Content>
            <View style={styles.logoContainer}>
              <Image source={launchscreenLogo} style={styles.logo} />
            </View>
            <View style={{ padding: 20 }}>
              <Item regular style={{ borderColor: '#29416f', borderWidth: 1, borderRadius: 2, height: 45 }}>
                <Input onChangeText={text => this.setState({ name: text })} value={this.state.name} placeholder={I18n.t('name')} style={{ textAlign: 'center', color: '#29416f', fontSize: 14 }} />
              </Item>
              <Item regular style={{ borderColor: '#29416f', marginTop: 10, borderWidth: 1, borderRadius: 2, height: 45 }}>
                <Input onChangeText={text => this.setState({ email: text })} value={this.state.email} placeholder={I18n.t('email')} keyboardType={'email-address'} style={{ textAlign: 'center', color: '#29416f', fontSize: 14 }} />
              </Item>
              <Item regular style={{ borderColor: '#29416f', marginTop: 10, borderWidth: 1, borderRadius: 2, height: 45 }}>
                <Input onChangeText={text => this.setState({ password: text })} value={this.state.password} placeholder={I18n.t('password')} secureTextEntry style={{ textAlign: 'center', color: '#29416f', fontSize: 14 }} />
                <PopoverTooltip
                  ref="tooltip1"
                  buttonComponent={
                    <Icon name="information-outline" style={{ fontSize: 26, paddingRight: 10, color: '#29416f', paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }} />
                  }
                  items={[
                    {
                      label: 'Min length six, one Caps',
                      onPress: () => { },
                    },
                  ]}
                // animationType='timing'
                // using the default timing animation
                />

              </Item>
              <Item regular style={{ borderColor: '#29416f', marginTop: 10, borderWidth: 1, borderRadius: 2, height: 45 }}>
                <Input onChangeText={text => this.setState({ phone: text })} value={this.state.phone} placeholder={I18n.t('phone_number')} keyboardType={'numeric'} style={{ textAlign: 'center', color: '#29416f', fontSize: 14 }} />
              </Item>
              {/* <Button block style={{marginTop:10},styles.buttonStyle}>
								<Text>Sign Up</Text>
							</Button> */}
              {/* <View>
								<Image
								source={buttonImage}
								style={{  resizeMode: 'contain' }}
								>
								<Text>Sign Up</Text>
								</Image>
							</View> */}
              <View style={{ flexDirection: 'row', flex: 1, paddingTop: 15, paddingBottom: 10 }} >
                <View style={{ width: 35 }}>
                  <CheckBox color="#29416f" checked={this.state.chkbox_chk} onPress={() => this.chkbox_check()} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 14 }}>{I18n.t('i_agree_to_the_term_and_conditions')}</Text>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 14, color: '#29416f' }}>{I18n.t('terms_and_conditions')}</Text>
                  </TouchableOpacity>
                </View>
              </View>


              <TouchableOpacity onPress={() => this.pressSignup()} style={{ height: 70, marginTop: 15, flexDirection: 'row' }}>
                <ImageBackground source={buttonImage} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 55 }} >
                  <Text style={{ color: '#fff', fontSize: 20, marginTop: -10, height: 30 }}>{I18n.t('signup')}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -13 }}>
                <Text>- {I18n.t('or')} -</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                <Button block transparent style={{ borderWidth: 1, borderColor: '#29416f', flex: 1 }} onPress={() => this.clcikFacebook()}>
                  <Icon name="facebook" style={{ color: '#29416f', marginRight: 5, fontSize: 20 }} />
                  <Text style={{ color: '#29416f' }}>{I18n.t('via_facebook')}</Text>
                </Button>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                <Button block transparent style={{ borderWidth: 1, borderColor: '#29416f', flex: 1 }} onPress={() => this.clickGmail()}>
                  <Icon name="gmail" style={{ color: '#29416f', marginRight: 5, fontSize: 20 }} />
                  <Text style={{ color: '#29416f' }}>{I18n.t('via_gmail')}</Text>
                </Button>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: '#252525' }} >{I18n.t('already_registered')} </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={{ color: '#29416f' }}>{I18n.t('login')}</Text>
                </TouchableOpacity>
              </View>


              {/* <Button transparent >
								<Image source={buttonImage} style={{width:50,backgroundColor:"#fff"}} />
								<Text>12 Likes</Text>
							</Button> */}


            </View>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

// Signup.propTypes = {
//   auth: PropTypes.object.isRequired,
// };
const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  signup: (name, email, password, phone, deviceToken) => dispatch(signup(name, email, password, phone, deviceToken)),
  login: (email, password) => dispatch(login(email, password)),
  getUserDetail: (id, auth) => dispatch(getUserDetail(id, auth)),
  checkAuth: cb => dispatch(checkAuth(cb))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
