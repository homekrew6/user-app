import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkAuth, getUserDetail } from './elements/authActions';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FSpinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import config from '../../config';
import { RNS3 } from 'react-native-aws3';
import api from '../../api';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Input, Body, ActionSheet } from 'native-base';


import I18n from '../../i18n/i18n';
import styles from './styles';
const deviceWidth = Dimensions.get('window').width;
const profileImage = require('../../../img/atul.png');
const carveImage = require('../../../img/bg-1.png');
var BUTTONS = [
  { text: I18n.t('camera'), icon: "ios-camera", iconColor: "#2c8ef4" },
  { text: I18n.t('file'), icon: "ios-images", iconColor: "#f42ced" }
];
// AsyncStorage.getItem("language").then((value) => {
//   if (value) {
//     const value1 = JSON.parse(value);
//     I18n.locale = value1.Code;
//     BUTTONS=[
//       { text: I18n.t('camera'), icon: "ios-camera", iconColor: "#2c8ef4" },
//       { text: I18n.t('file'), icon: "ios-images", iconColor: "#f42ced" }
//     ]
//   }
// })

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.auth.data.email,
      name: props.auth.data.name,
      phone: props.auth.data.phone,
      image: props.auth.data.image,
      id: props.auth.data.id,
      visible: false,
      uploadButton: true,
      uploaded: false,
      cameraButton: true,
      cameraUploaded: false,
    };
  }



  attachFile() {
    // this.setState({ uploadButton: false });

    ImagePicker.openPicker({
      width: 400,
      height: 300,
      cropping: true,
    }).then((response) => {
      this.setState({ visible: true });
      let uri;
      if (!response.path) {
        uri = response.uri;
      } else {
        uri = response.path;
      }
      const file = {
        uri,
        name: `${Math.floor((Math.random() * 100000000) + 1)}_.png`,
        type: response.mime || 'image/png',
      };

      const options = config.s3;

      RNS3.put(file, config.s3).then((response) => {
        if (response.status !== 201) {
          this.setState({ uploadButton: true });

          this.setState({ visible: false });
          throw new Error('Failed to upload image to S3');
        }


        if (response.status == 201) {
          this.setState({ uploadButton: true });
          this.setState({ uploaded: true });

          // this.props.setProfilePic(response.body.postResponse.location);
          this.setState({ image: response.body.postResponse.location });
          this.setState({ visible: false });
          Alert.alert('', I18n.t('press_save_to_image'));
        }
      }).catch((err) => {
        this.setState({ visible: false });
      });
    }).catch((err) => {
      this.setState({ visible: false });
      // this.setState({ uploadButton: true });
    });
  }

  captureFile() {
    this.setState({ cameraButton: false });

    ImagePicker.openCamera({
      width: 400,
      height: 300,
      cropping: true
    }).then((response) => {
      this.setState({ visible: true });
      let uri;

      if (!response.path) {
        uri = response.uri;
      } else {
        uri = response.path;
      }
      const file = {
        uri,
        name: `${Math.floor((Math.random() * 100000000) + 1)}_.png`,
        type: response.mime || 'image/png',
      };

      const options = config.s3;
      RNS3.put(file, config.s3).then((response) => {
        if (response.status !== 201) {
          this.setState({ cameraButton: true });
          this.setState({ visible: true });
          throw new Error('Failed to upload image to S3');
        }


        if (response.status == 201) {
          this.setState({ cameraButton: true });
          this.setState({ cameraUploaded: true });
          this.setState({ image: response.body.postResponse.location })
          this.setState({ visible: false });
          Alert.alert('', I18n.t('press_save_to_image'));
        }
      }).catch((err) => {
        this.setState({ visible: false });
      });
    }).catch((err) => {
      this.setState({ visible: false });
      this.setState({ cameraButton: true });
    });
  }

  pressSave() {
    if (!this.state.email) {
      Alert.alert(I18n.t('enter_email'));
      return false;
    }
    if (!this.state.name) {
      Alert.alert(I18n.t('enter_name'));
      return false;
    }
    if (!this.state.phone) {
      Alert.alert(I18n.t('enter_phone'));
      return false;
    }
    this.setState({ visible: true });
    this.props.checkAuth((res) => {
      if (res) {
        api.put(`Customers/editCustomer/${res.userId}?access_token=${res.id}`, { name: this.state.name, phone: this.state.phone, image: this.state.image }).then((resEdit) => {
          this.props.getUserDetail(res.userId, res.id).then((userRes) => {
            // this.props.navigation.navigate("Menu");
            this.setState({ visible: false });
            Alert.alert(I18n.t('successfully_saved'));
          }).catch((err) => {
            this.setState({ visible: false });
            Alert.alert('', I18n.t('please_try_again_later'));
          });
        }).catch((err) => {
          this.setState({ visible: false });
          Alert.alert('', I18n.t('please_try_again_later'));
        });
      } else {
        this.setState({ visible: false });
        this.props.navigation.navigate('Login');
      }
    });
  }

  fileUploadType(buttonIndex) {
    if (buttonIndex == 0) {
      this.captureFile();
    }
    if (buttonIndex == 1) {
      this.attachFile();
    }
  }

  render() {
    return (
      <Container >
        <StatusBar
          backgroundColor="#81cdc7"
        />
        <Content>
          <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
          <Header style={styles.appHdr2} noShadow>
            <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 40 }}>
              <Icon name="chevron-left" style={{ fontSize: 18, color: '#71beb8' }} />
            </Button>
            <Body style={styles.appHdrtitleWarp}>
              <Text style={{ color: '#1e3768' }}>{I18n.t('edit_my_profile')}</Text>
            </Body>
            <Button transparent style={{ width: 40, backgroundColor: 'transparent' }} disabled />
          </Header>

          <View style={styles.editPflHdr}>
            <View style={styles.editPflHdrWrap}>
              {
                this.props.auth.data.image ? (
                  <Thumbnail source={{ uri: this.state.image }} style={styles.editPflHdrThumbnail} />
                ) : (
                    <Thumbnail source={profileImage} style={styles.editPflHdrThumbnail} />
                  )
              }

              <Button
                primary noShadow small
                style={styles.editPflHdrBtn}
                onPress={() =>
                  ActionSheet.show(
                    {
                      options: BUTTONS,
                    },
                    (buttonIndex) => {
                      this.setState({ clicked: BUTTONS[buttonIndex] });
                      // this.setState({ filecat: buttonIndex });
                      // this.setState({ filecat: buttonIndex});
                      this.fileUploadType(buttonIndex);
                    },
                  )}
              ><Text style={{ color: '#fff' }}>{I18n.t('change_photo')}</Text></Button>
            </View>
          </View>

          <View style={{ paddingBottom: 0, marginBottom: 0 }}>
            <Image source={carveImage} style={{ width: deviceWidth }} />
          </View>

          <View>
            <View style={styles.editprofileLst}>
              <View style={styles.editprofileWarp}>
                <Text>{I18n.t('name')}</Text>
              </View>
              <View style={styles.editprofileInputwrap}>
                <Input style={styles.editprofileInput} onChangeText={text => this.setState({ name: text })} value={this.state.name} />
              </View>
            </View>
            <View style={styles.editprofileLst}>
              <View style={styles.editprofileWarp}>
                <Text>{I18n.t('email_id')}</Text>
              </View>
              <View style={styles.editprofileInputwrap}>
                <Input editable={false} style={styles.editprofileInput} onChangeText={text => this.setState({ email: text })} value={this.state.email} />
              </View>
            </View>

            <View style={styles.editprofileLst}>
              <View style={styles.editprofileWarp}>
                <Text>{I18n.t('phone_number')}</Text>
              </View>
              <View style={styles.editprofileInputwrap}>
                <Input style={styles.editprofileInput} keyboardType={'numeric'} onChangeText={text => this.setState({ phone: text })} value={this.state.phone} />
              </View>
            </View>
          </View>

          <Footer>
            <FooterTab>
              <TouchableOpacity full style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#81cdc7' }} onPress={() => this.pressSave()}>
                <Text style={{ color: '#fff', fontSize: 16 }}>{I18n.t('save')}</Text>
              </TouchableOpacity>
            </FooterTab>
          </Footer>
        </Content>
      </Container>
    );
  }
}

// EditProfile.propTypes = {
//   auth: PropTypes.object.isRequired,
// };
const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  checkAuth: cb => dispatch(checkAuth(cb)),
  getUserDetail: (id, auth) => dispatch(getUserDetail(id, auth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
