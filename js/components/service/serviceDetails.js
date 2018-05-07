import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, AsyncStorage, View, StatusBar, Dimensions, Alert, TouchableOpacity, FlatList,Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import IncrimentDecriment from './incrimentDecrimentCompt';
import Slider from 'react-native-slider';
import { getQuestionListByServiceId } from './elements/serviceActions';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Button, Content,Item, Body, Title, Switch, Footer, FooterTab, ActionSheet } from 'native-base';
import I18n from '../../i18n/i18n';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import { setServiceDetails } from './elements/serviceActions';
import { RNS3 } from 'react-native-aws3';
import config from '../../config';
import api from '../../api';
import { NavigationActions } from 'react-navigation';

const deviceWidth = Dimensions.get('window').width;
const carveImage = require('../../../img/bg-6.png');
const logo22 = require('../../../img/logo22.png');
const img17 = require('../../../img/icon17.png');
const img18 = require('../../../img/img22.png');
const krew_logo = require('../../../img/krew.png');

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
});

var BUTTONS = [
  { text: "Camera", icon: "ios-camera", iconColor: "#2c8ef4" },
  { text: "File", icon: "ios-images", iconColor: "#f42ced" }
];
class serviceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      value: 0.2,
      questionList: [],
      serviceName: 'props.service.data.name',
      banner_image: 'props.service.data.banner_image',
      cover_image: 'props.service.data.cover_image',
      start_range: 0,
      numberValue: 1,
      currency: 'AED',
      activeRadioArray: [false, false, false],
      IsSpinnerVisible: false,
      isSlided: false,
      sliderData: [

      ]
    };
    super(props);
  }
  captureFile(data) {
    this.setState({ IsSpinnerVisible: true });
    ImagePicker.openCamera({
      width: 400,
      height: 300,
      cropping: true
    }).then((response) => {
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
      console.log(file);

      const options = config.s3;
      RNS3.put(file, config.s3).then((response) => {
        if (response.status !== 201) {
          this.setState({ IsSpinnerVisible: false });
          throw new Error('Failed to upload image to S3');
        }


        if (response.status == 201) {
          let slider = [];
          if (!data.sliderValues) {
            data.sliderValues = [];
          }
          data.sliderValues.map(sdata => {
            slider.push(sdata);
          });

          let lengthOfSlider = data.sliderValues.length;
          if (lengthOfSlider === 0) {
            let newData = {
              'src': response.body.postResponse.location,
              'key': 1
            };

            slider.push(newData);
            this.setState({ IsSpinnerVisible: false });
            //this.setState({ sliderData: slider });
          } else {
            lengthOfSlider = lengthOfSlider - 1;
            let latestKey = slider[lengthOfSlider].key;
            latestKey = latestKey + 1;
            let newData = {
              'src': response.body.postResponse.location,
              'key': latestKey
            };
            slider.push(newData);
            this.setState({ IsSpinnerVisible: false });
            //this.setState({ sliderData: slider });
          }


          const questionId = data.id;
          const sliderDump = slider;

          AsyncStorage.getItem("keyQuestionList").then((value) => {
            if (value !== '') {
              const jsonKeyQuestion = JSON.parse(value);
              jsonKeyQuestion.map((dataQ, key) => {
                if (dataQ.id === questionId) {
                  console.log('sliderDump', sliderDump);
                  jsonKeyQuestion[key].sliderValues = sliderDump;
                }
              });
              console.log('jsonKeyQuestion cature photo', jsonKeyQuestion);
              this.setState({ questionList: jsonKeyQuestion });
              const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
              AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
                console.log('====FirstPage====captureFile===' + res);
              });
            }
          }).catch(res => {
            //AsyncStorage.setItem('StoreData', dataRemoteString);
            console.log('switchChange err', res);
          });

        }
      }).catch((err) => {
        this.setState({ IsSpinnerVisible: false });
        console.log(err);
      });
    }).catch((err) => {
      this.setState({ IsSpinnerVisible: false });
      console.log(err);
    });
  }

  attachFile(data) {
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
        console.log(response);
        if (response.status !== 201) {
          this.setState({ IsSpinnerVisible: false });
          throw new Error('Failed to upload image to S3');
        }


        if (response.status == 201) {
          // let slider = [];
          // this.state.sliderData.map(sdata => {
          //   slider.push(sdata);
          // });
          // let lengthOfSlider = slider.length;
          // lengthOfSlider = lengthOfSlider - 1;
          // let latestKey = slider[lengthOfSlider].key;
          // latestKey = latestKey + 1;
          // let newData = {
          //   'src': response.body.postResponse.location,
          //   'key': latestKey
          // };
          // slider.push(newData);
          // this.setState({ IsSpinnerVisible: false });
          // this.setState({ sliderData: slider });
          let slider = [];
          if (!data.sliderValues) {
            data.sliderValues = [];
          }
          data.sliderValues.map(sdata => {
            slider.push(sdata);
          });

          let lengthOfSlider = data.sliderValues.length;
          if (lengthOfSlider === 0) {
            let newData = {
              'src': response.body.postResponse.location,
              'key': 1
            };

            slider.push(newData);
            this.setState({ IsSpinnerVisible: false });
            //this.setState({ sliderData: slider });
          } else {
            lengthOfSlider = lengthOfSlider - 1;
            let latestKey = slider[lengthOfSlider].key;
            latestKey = latestKey + 1;
            let newData = {
              'src': response.body.postResponse.location,
              'key': latestKey
            };
            slider.push(newData);
            this.setState({ IsSpinnerVisible: false });
            //this.setState({ sliderData: slider });
          }

          const questionId = data.id;
          const sliderDump = slider;

          AsyncStorage.getItem("keyQuestionList").then((value) => {
            if (value !== '') {
              const jsonKeyQuestion = JSON.parse(value);
              jsonKeyQuestion.map((dataQ, key) => {
                if (dataQ.id === questionId) {
                  console.log('sliderDump', sliderDump);
                  jsonKeyQuestion[key].sliderValues = sliderDump;
                }
              });
              console.log('jsonKeyQuestion cature photo', jsonKeyQuestion);
              this.setState({ questionList: jsonKeyQuestion });
              const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
              AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
                console.log('====FirstPage====captureFile===' + res);
              });
            }
          }).catch(res => {
            //AsyncStorage.setItem('StoreData', dataRemoteString);
            console.log('switchChange err', res);
          });

        }
      }).catch((err) => {
        console.log(err);
        this.setState({ IsSpinnerVisible: false });
      });
    }).catch((err) => {
      this.setState({ IsSpinnerVisible: false });
      // console.log(err);
      // this.setState({ uploadButton: true });
    });
  }
  fileUploadType(buttonIndex, data) {
    console.log('fileUploadType func', data);
    if (buttonIndex == 0) {
      this.captureFile(data);
    }
    if (buttonIndex == 1) {
      this.attachFile(data);
    }
  }
  uploadPhoto(data) {
    ActionSheet.show(
      {
        options: BUTTONS,
      },
      (buttonIndex) => {
        this.setState({ clicked: BUTTONS[buttonIndex] });
        // this.setState({ filecat: buttonIndex });
        //console.log(buttonIndex);
        // this.setState({ filecat: buttonIndex});
        this.fileUploadType(buttonIndex, data);
      },
    )

  }
  changeActiveRadio(data) {
    console.log('data changeActiveRadio', data);
    const answersId = data.id;
    const questionId = data.questionId;
    AsyncStorage.getItem("keyQuestionList").then((value) => {
      if (value !== '') {
        const jsonKeyQuestion = JSON.parse(value);
        jsonKeyQuestion.map((dataQ, key) => {
          if (dataQ.answers && dataQ.answers.length && dataQ.answers[0].questionId === questionId) {
            dataQ.answers.map((dataA, keyA) => {
              if (dataA.id === answersId) {
                jsonKeyQuestion[key].answers[keyA].selected = true;
              } else {
                jsonKeyQuestion[key].answers[keyA].selected = false;
              }

            })
          }
        });
        const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
        AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
          console.log('====FirstPage====changeActiveRadio===' + res)
        });
      }
    }).catch(res => {
      //AsyncStorage.setItem('StoreData', dataRemoteString);
      console.log('switchChange err', res);
    });


    data.selected = !data.selected;
    let dataselected = data;
    let item;
    this.state.questionList.map((ques) => {
      if (ques.id == data.questionId) {
        item = ques;
      }
    });
    if (item) {
      if (item.answers) {
        noofselected = 0;
        item.answers.map((item1) => {
          if (item1.selected == true) {
            noofselected++;
          }
        });
        if (noofselected > 1) {
          item.answers.map((item1) => {
            if (item1.id == dataselected.id) {

            }
            else {
              if (item1.selected == true) {
                item1.selected = false;
                var price = this.props.service.data.price;
                price = Number(price);
                if (dataselected.option_price_impact == "Addition") {
                  price = price - Number(dataselected.price_impact);
                }
                else {
                  price = price / Number(dataselected.price_impact);
                }
                var data = this.props.service.data;
                price = this.addZeroes(price);
                AsyncStorage.setItem("servicePrice", price).then((success) => {

                })
                data.price = price;
                this.props.setServiceDetails(data);
              }

            }
          })
        }
      }
    }
    var price = this.props.service.data.price;
    price = Number(price);
    if (data.selected == false) {
      if (data.option_price_impact == "Addition") {
        price = price - Number(data.price_impact);
      }
      else {
        price = price / Number(data.price_impact);
      }
    }
    else {
      if (data.option_price_impact == "Addition") {
        price = price + Number(data.price_impact);
      }
      else {
        price = price * Number(data.price_impact);
      }
    }

    var data = this.props.service.data;
    price = this.addZeroes(price);
    data.price = price;
    AsyncStorage.setItem("servicePrice", price).then((success) => {

    })
    this.props.setServiceDetails(data);
  }
  activeRadio(index) {
    let newradio = [false, false, false];
    newradio[index] = true;
    this.setState({
      activeRadioArray: newradio
    });

  }
  switchChange(data) {
    // this.setState({
    //   isOpen: !this.state.isOpen,
    // });
    const questionId = data.answers[0].questionId;
    const switchStatus = data;
    AsyncStorage.getItem("keyQuestionList").then((value) => {
      if (value !== '') {

        const jsonKeyQuestion = JSON.parse(value);
        jsonKeyQuestion.map((dataQ, key) => {
          if (dataQ.answers && dataQ.answers.length && dataQ.answers[0].questionId === questionId) {
            jsonKeyQuestion[key].Status = switchStatus.Status;
          }
        });
        const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
        AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
          console.log('====FirstPage====switch change===' + res)
        });
      }
    }).catch(res => {
      //AsyncStorage.setItem('StoreData', dataRemoteString);
      console.log('switchChange err', res);
    });

    var price = this.props.service.data.price;
    price = Number(price);
    var timeInterval=this.props.service.data.time_interval;
    data.Status = !data.Status;
    let index;
    for (var i = 0; i < this.state.questionList.length; i++) {
      if (this.state.questionList[i].id == data.id) {
        index = i;
        break;
      }
    }
    if (index || index == 0) {
      if (data.Status == false) {
        var data1 = this.state.questionList[index];
        if (data1.answers && data1.answers.length > 0) {
          if (data1.answers[0].option_time_impact == "Addition") {
            timeInterval = timeInterval - Number(data1.answers[0].time_impact);
          }
          else {
            timeInterval = timeInterval / Number(data1.answers[0].time_impact);
          }
          if (data1.answers[0].option_price_impact == "Addition") {
            price = price - Number(data1.answers[0].price_impact);
          }
          else {
            price = price / Number(data1.answers[0].price_impact);
          }

          var data = this.props.service.data;
          price = this.addZeroes(price);
          data.price = price;
          data.time_interval=timeInterval;
          AsyncStorage.setItem("servicePrice", price).then((success) => {

          })
          this.props.setServiceDetails(data);
        }
      }
      else {
        var data1 = this.state.questionList[index];
        if (data1.answers && data1.answers.length > 0) {
          if (data1.answers[0].option_time_impact == "Addition") {
            timeInterval = timeInterval - Number(data1.answers[0].time_impact);
          }
          else {
            timeInterval = timeInterval / Number(data1.answers[0].time_impact);
          }
          if (data1.answers[0].option_price_impact == "Addition") {
            price = price + Number(data1.answers[0].price_impact);
          }
          else {
            price = price * Number(data1.answers[0].price_impact);
          }
          var data = this.props.service.data;
          price = this.addZeroes(price);
          data.price = price;
          data.time_interval = timeInterval;
          AsyncStorage.setItem("servicePrice", price).then((success) => {

          })
          this.props.setServiceDetails(data);
        }
      }

    }
  }

  calculatePriceOnStart() {
    this.props.getQuestionListByServiceId(this.props.service.data).then((res) => {
      if (res.type == "success") {
        console.log("success componentWillMount", res);
        //this.setState({ questionList: res });
        var price = 0.0;
        AsyncStorage.getItem("servicePrice").then((priceValue) => {
          if (priceValue) {
            var data = this.props.service.data;
            data.questionList = this.state.questionList;
            //priceValue = this.addZeroes(priceValue);
            data.price = priceValue;
            this.props.setServiceDetails(data);
          }
          else {
            for (var i = 0; i < this.state.questionList.length; i++) {
              if (this.state.questionList[i].type == 1 || this.state.questionList[i].type == 2 || this.state.questionList[i].type == 3 || this.state.questionList[i].type == 4) {
                if (this.state.questionList[i].answers && this.state.questionList[i].answers.length > 0) {
                  if (this.state.questionList[i].type == 1) {
                    if (this.state.questionList[i].answers[0].option_price_impact == "Addition") {
                      price = price + (this.state.questionList[i].IncrementId + Number(this.state.questionList[i].answers[0].price_impact));
                    }
                    else {
                      price = price + (this.state.questionList[i].IncrementId * Number(this.state.questionList[i].answers[0].price_impact));
                    }
                  }
                  else if (this.state.questionList[i].type == 2) {
                    if (this.state.questionList[i].answers[0].option_price_impact == "Addition") {
                      price = price + Number(this.state.questionList[i].answers[0].price_impact);
                    }
                    else {
                      price = price * Number(this.state.questionList[i].answers[0].price_impact);
                    }
                  }
                }
              }
            }
            var data = this.props.service.data;
            data.questionList = this.state.questionList;
            price = this.addZeroes(price);
            data.price = price;
            AsyncStorage.setItem("servicePrice", price).then((success) => {

            })
            this.props.setServiceDetails(data);
          }
        })

      }
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {
    
    AsyncStorage.getItem("currency").then((value) => {
      if (value) {
          const value1 = JSON.parse(value);
          this.setState({ currency: value1.language })
      }
    })
    // AsyncStorage.getItem("fromLogin").then((storeValue) => {
    //       if (storeValue) {
    //           BackHandler.addEventListener('hardwareBackPress', function () {
    //               const { dispatch, navigation, nav } = this.props;
    //               if (this.props.auth.data.activeScreen) {
    //                 Alert.alert(
    //                   'Confirm',
    //                   'Are you sure to exit the app?',
    //                   [
    //                     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //                     { text: 'OK', onPress: () => BackHandler.exitApp() },
    //                   ],
    //                   { cancelable: false }
    //                 )
    //               }
    //           }.bind(this));
    //       }
    //   })
    console.log('componentDidMount begin', this.props);
    const serviceId = this.props.service.data.id;
    // this.setState({
    //   serviceName: this.props.navigation.state.params.ServiceName,
    //   cover_image: this.props.navigation.state.params.cover_image,
    //   banner_image: this.props.navigation.state.params.banner_image
    // });
    this.setState({
      serviceName: this.props.service.data.name,
      cover_image: this.props.service.data.cover_image,
      banner_image: this.props.service.data.banner_image
    })
    
    // AsyncStorage.removeItem('serviceId', (err) => console.log('finished', err));

    AsyncStorage.getItem('serviceId').then((serviceValue) => {
      console.log('AsyncStorage serviceId', serviceValue);
      if (serviceValue && serviceValue === serviceId.toString()) {
        AsyncStorage.getItem("keyQuestionList").then((value) => {
          if (value) {
            const jsonDump = JSON.parse(value);
            this.setState({ questionList: jsonDump });
            jsonDump.map((item)=>{
              if(item.type==4)
              {
                if(!item.rangeValue)
                {
               item.rangeValue=item.start_range;
                }
              }
            })
            this.calculatePriceOnStart();
            console.log('jsonDump DidMount', jsonDump);
          } else {
            let questionServiceUrl = 'Questions?filter={"include": [{"relation": "answers"}],"where": {"serviceId": ' + serviceId + '} }';
          
            api.get(questionServiceUrl).then(responseJson => {
              console.log('questionServiceUrl', responseJson);
              responseJson.map((item)=>{
                if(item.type==4)
                {
                  if(!item.rangeValue)
                  {
                 item.rangeValue=item.start_range;
                  }
                }
              })
              this.setState({ questionList: responseJson });
              const dataStringQuestion = JSON.stringify(responseJson);
              AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
                this.calculatePriceOnStart();
                console.log('====FirstPage====keyQuestionList===' + res)
              });
            }).catch(err => {
              console.log(err);
              reject(err)
            })
          }
        }).catch(res => {
          //AsyncStorage.setItem('StoreData', dataRemoteString);
          console.log('switchChange err', res);
        });
      } else {
        console.log('AsyncStorage inside else');
        AsyncStorage.setItem('serviceId', serviceId.toString(), (res) => {
          if (serviceValue) {
            let questionServiceUrl = 'Questions?filter={"include": [{"relation": "answers"}],"where": {"serviceId": ' + serviceId + '} }';
            api.get(questionServiceUrl).then(responseJson => {
              AsyncStorage.removeItem('servicePrice', (err) => console.log('finished', err));
              console.log('questionServiceUrl', responseJson);
              responseJson.map((item)=>{
                if(item.type==4){
                  if(!item.rangeValue)
                  {
                 item.rangeValue=item.start_range;
                  }
                }
              })
              this.setState({ questionList: responseJson });
              const dataStringQuestion = JSON.stringify(responseJson);
              AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
                this.calculatePriceOnStart();
                console.log('====FirstPage====keyQuestionList===' + res)
              });
            }).catch(err => {
              console.log(err);
              reject(err)
            })
          } else {
            AsyncStorage.getItem("keyQuestionList").then((value) => {
              AsyncStorage.removeItem('keyQuestionList', (err) => console.log('finished', err));
              AsyncStorage.removeItem('servicePrice', (err) => console.log('finished', err));
              let questionServiceUrl = 'Questions?filter={"include": [{"relation": "answers"}],"where": {"serviceId": ' + serviceId + '} }';
              api.get(questionServiceUrl).then(responseJson => {
                AsyncStorage.removeItem('servicePrice', (err) => console.log('finished', err));
                responseJson.map((item)=>{
                  if(item.type==4){
                    if(!item.rangeValue)
                    {
                   item.rangeValue=item.start_range;
                    }
                  }
                })
                this.setState({ questionList: responseJson });
                const dataStringQuestion = JSON.stringify(responseJson);
                AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
                  this.calculatePriceOnStart();
                  console.log('====FirstPage====keyQuestionList===' + res)
                });
              }).catch(err => {
                console.log(err);
                reject(err)
              })
            }).catch(res => {
              console.log('switchChange err', res);
            });
          }
        });
      }
    }).catch(err => {
      AsyncStorage.setItem('serviceId', toString(serviceId), (res) => {
        console.log('serviceId set in catch');
      });
    })
    //AsyncStorage.removeItem('keyQuestionList', (err) => console.log('finished', err));



  }

  componentWillMount() {
    // BackHandler.addEventListener('hardwareBackPress', function () {
    //   const { dispatch, navigation, nav } = this.props;
    //   AsyncStorage.getItem("fromLogin").then((storeValue)=>{
    //     if(storeValue)
    //     {
    //       if (this.props.auth.data.activeScreen && this.props.auth.data.activeScreen == 'Menu') {
    //         Alert.alert(
    //           'Confirm',
    //           'Are you sure to exit the app?',
    //           [
    //             { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //             { text: 'OK', onPress: () => BackHandler.exitApp() },
    //           ],
    //           { cancelable: false }
    //         )
    //       }
    //     }
    //   })




    //   return true;
    // }.bind(this));
    // this.props.getQuestionListByServiceId(this.props.service.data).then((res) => {
    //   if (res.type == "success") {
    //     console.log("success componentWillMount", res);
    //     //this.setState({ questionList: res });
    //     var price = 0.0;
    //     for (var i = 0; i < this.state.questionList.length; i++) {
    //       if (this.state.questionList[i].type == 1 || this.state.questionList[i].type == 2 || this.state.questionList[i].type == 3 || this.state.questionList[i].type == 4) {
    //         if (this.state.questionList[i].answers && this.state.questionList[i].answers.length > 0) {
    //           if (this.state.questionList[i].type == 1) {
    //             if (this.state.questionList[i].answers[0].option_price_impact == "Addition") {
    //               price = price + (this.state.questionList[i].IncrementId + Number(this.state.questionList[i].answers[0].price_impact));
    //             }
    //             else {
    //               price = price + (this.state.questionList[i].IncrementId * Number(this.state.questionList[i].answers[0].price_impact));
    //             }
    //           }
    //           else if (this.state.questionList[i].type == 2) {
    //             if (this.state.questionList[i].answers[0].option_price_impact == "Addition") {
    //               price = price + Number(this.state.questionList[i].answers[0].price_impact);
    //             }
    //             else {
    //               price = price * Number(this.state.questionList[i].answers[0].price_impact);
    //             }
    //           }
    //         }
    //       }
    //     }
    //     var data = this.props.service.data;
    //     data.questionList = this.state.questionList;
    //     price = this.addZeroes(price);
    //     data.price = price;
    //     this.props.setServiceDetails(data);
    //   }
    // }).catch((err) => {
    //   console.log(err);
    // });
  }


  addZeroes(num) {
    // var value = Number(num);
    // var res = num.split(".");
    // if (res.length == 1 || (res[1].length < 3)) {
    //   value = value.toFixed(2);
    // }
    let value = num.toFixed(2);
    return value
  }

  sliderChanged(value, data) {
    console.log('sliderChanged', value, data);
    if (value != 0) {
      value = parseFloat(Math.round(value * 100) / 100).toFixed(2);
      value = Number(value);

      const setRangeValue = value;
      this.setState({ start_range: value });
      const questionId = data.answers[0].questionId;
      AsyncStorage.getItem("keyQuestionList").then((value) => {
        if (value !== '') {
          const jsonKeyQuestion = JSON.parse(value);
          jsonKeyQuestion.map((dataQ, key) => {
            if (dataQ.answers && dataQ.answers.length && dataQ.answers[0].questionId === questionId) {
              jsonKeyQuestion[key].start_range = setRangeValue;
            }
          });
          console.log('jsonKeyQuestion', jsonKeyQuestion);
          const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
          AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
            console.log('====FirstPage====sliderChanged===' + res)
          });
        }
      }).catch(res => {
        //AsyncStorage.setItem('StoreData', dataRemoteString);
        console.log('switchChange err', res);
      });

      var price = this.props.service.data.price;
      var timeInterval = this.props.service.data.time_interval;
      price = Number(price);
      let isSlidedTest;

      if (data.answers) {
        if (data.answers[0].option_price_impact == "Addition") {
          if (data.isSlided === 'true') {
            if (data.answers[0].option_time_impact == "Addition") {
              timeInterval = timeInterval - Number(data.answers[0].time_impact);
            }
            else {
              timeInterval = timeInterval / Number(data.answers[0].time_impact);
            }

            let redux_value = Number(data.rangeValue);
            if(value === data.start_range){
              price = price - (redux_value + Number(data.answers[0].price_impact));
              isSlidedTest = 'false';
            }else{
              isSlidedTest = 'true';
              if(value < redux_value){
                price = (price - redux_value ) + Number(value);
              }else if(redux_value <= value){
                price = (price + Number(value)) - redux_value;
              }
            }
          }else {
            //if(value === data.start_range){ }else{
              price = price + (value + Number(data.answers[0].price_impact));
              isSlidedTest = 'true';
            //}
          }
        }
        else {
          if (data.rangeValue) {
            if (data.answers[0].option_time_impact == "Addition") {
              timeInterval = timeInterval - Number(data.answers[0].time_impact);
            }
            else {
              timeInterval = timeInterval / Number(data.answers[0].time_impact);
            }
            // if (value < this.props.service.data.value) {
            //   price = price + (value + Number(data.answers[0].price_impact));
            // }
            // else {
            //   price = price + (value + Number(data.answers[0].price_impact));
            // }

            let redux_value = Number(data.rangeValue);
            if(value === data.start_range){
              price = price - (redux_value * Number(data.answers[0].price_impact));
            }else{
              if(value < redux_value){
                  price = (price - (redux_value * Number(data.answers[0].price_impact))) + (value * Number(data.answers[0].price_impact));
              }else if(redux_value <= value){
                  price = (price - (redux_value * Number(data.answers[0].price_impact))) + (value * Number(data.answers[0].price_impact));
              }
            }

          }
          else {
            if(value === data.start_range){ }else{
              price = price + (value * Number(data.answers[0].price_impact));
            }
            
          }

        }

        price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
        price = Number(price);
        let start_range_data = data.start_range;
        var data1 = this.props.service.data;
        price = this.addZeroes(price);
        data1.price = price;
        
        data1.questionList.map((item1)=>{
          if(item1.id==data.id) {
            item1.isSlided = isSlidedTest;
            if(value === start_range_data){
              item1.rangeValue=value;
            }else{
              item1.rangeValue=value;
            }
          }
        })
        data1.time_interval = timeInterval;
        this.props.setServiceDetails(data1);
        AsyncStorage.setItem("keyQuestionList", JSON.stringify(data1.questionList)).then((success)=>{

        })
        console.log('setServiceDetails data', data1);
      }
    }


  }


  goToConfirmation() {
    if (this.props.auth.data) {
      this.setState({ IsSpinnerVisible: true });
      // const data = this.props.auth.data;
      // data.activeScreen = "Confirmation";
      // data.previousScreen = "ServiceDetails";
      // this.props.navigateAndSaveCurrentScreen(data);
      this.setState({ IsSpinnerVisible: false });
      this.props.navigation.navigate('Confirmation');

    }
    else {
      this.props.navigation.dispatch(resetAction);
    }
  }
  delete(data, item) {
    this.setState({ IsSpinnerVisible: true });
    let newArray = [];
    data.sliderValues.map((item1) => {
      if (item1.key != item.key) {
        newArray.push(item1);
      }
    });
    let existingQuestion = [];
    this.state.questionList.map((questn) => {
      existingQuestion.push(questn);
    })
    existingQuestion.map((question) => {
      if (question.id == data.id) {
        question.sliderValues = newArray;
      }
    });
    this.setState({ questionList: existingQuestion });
    AsyncStorage.getItem("keyQuestionList").then((value) => {
      if (value !== '') {
        const jsonKeyQuestion = JSON.parse(value);
        jsonKeyQuestion.map((dataQ, key) => {
          if (dataQ.id === data.id) {
            jsonKeyQuestion[key].sliderValues = newArray;
          }
        });
        const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
        AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
          this.setState({ IsSpinnerVisible: false });
        });
      }
    }).catch(res => {
      this.setState({ IsSpinnerVisible: false });
      //AsyncStorage.setItem('StoreData', dataRemoteString);
    });

  }
  deleteImage(data, item) {
    Alert.alert(
      'Confirm',
      'Are you sure to delete this image?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.delete(data, item) },
      ],
      { cancelable: false }
    )
  }

  render() {

    let questionList = (
      this.state.questionList.map((data, key) => (
        data.type == "1" ? <View key={data.id} >
          <Item style={styles.confirmationItem}  >
            <View style={styles.confirmationIconView}>
              <Text name="scissors" style={styles.confirmationViewIcon} > {
                data.image ? (
                  <Image source={{ uri: data.image }} style={{ width: 20, height: 20 }} />
                ) : (
                    <Image source={logo22} style={{ height: 20, width: 20 }} />
                  )
              } </Text>
            </View>
            <Text style={styles.confirmationMainTxt}>{data.name}</Text>
            <IncrimentDecriment
              massage={data}
            //onIncrement={this.handleIncrement} 
            //onDecrement={this.handleDecrement} 
            />
          </Item>
        </View> : data.type == "2" ? <View key={data.id}>
          <Item style={styles.confirmationItem}>
            <View style={styles.confirmationIconView}>
              {
                data.image ? (
                  <Image source={{ uri: data.image }} style={{ width: 20, height: 20 }} />
                ) : (
                    <Image source={logo22} style={{ height: 20, width: 20 }} />
                  )
              }
            </View>
            <Text style={styles.confirmationMainTxt}>{data.name}</Text>
            <Switch value={data.Status} onValueChange={() => this.switchChange(data)} />
          </Item>
        </View> : data.type == "4" ? <View style={styles.confirmationItem2} key={data.id}>
          <Entypo name="home" style={styles.confirmationViewIcon2} />
          <View style={styles.confirmationMainTxt}>
            <Slider
              minimumTrackTintColor="#81cdc7"
              maximumTrackTintColor="#e1e1e1"
              thumbTintColor="#81cdc7"
              minimumValue={data.start_range}
              maximumValue={data.end_range}
              value={data.rangeValue ? data.rangeValue : 0}
              onValueChange={value => this.sliderChanged(value, data)}
            />
            <Text style={styles.bedroomCount}>{data.name}</Text>
          </View>
          <Entypo name="home" style={styles.confirmationViewIcon2} />
        </View> : data.type == "5" ? <View key={data.id}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <Text style={{ flex: 1 }}>
                    {I18n.t('insert_photo')}
                </Text>
            <TouchableOpacity onPress={() => this.uploadPhoto(data)}>
              <Icon name="camera" style={{ fontSize: 16 }}></Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.imagesSliderWarp}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={data.sliderValues === null ? this.state.sliderData : data.sliderValues}
              renderItem={({ item }) =>
                <View>
                  <Image key={item.key} source={{ uri: item.src }} style={styles.imagesSliderImage}></Image>
                  <TouchableOpacity style={{ marginTop: 5, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.deleteImage(data, item)}>
                    <View>
                      <Ionicons name="ios-close-circle-outline" style={{ fontSize: 20, color: '#8B0000' }} />
                    </View>
                  </TouchableOpacity>
                </View>
              }
              horizontal={true}
              style={styles.imagesSliderFlatList}
            />
          </View>
        </View> : <View key={data.id}>
                  <Item style={styles.confirmationItem}>
                    <View style={styles.confirmationIconView}>
                      <Text >
                        {
                          data.image ? (
                            <Image source={{ uri: data.image }} style={{ width: 20, height: 20 }} />
                          ) : (
                              <Image source={logo22} style={{ height: 20, width: 20 }} />
                            )
                        }
                      </Text>
                    </View>
                      <Text style={styles.confirmationMainTxt}>{data.name}</Text>
                      
                      <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "#ccc", flexDirection: 'row', overflow: 'hidden', }}>

                        {
                          data.answers.map((data1, key1) => {
                            return (<View key={data1.id}>
                              <TouchableOpacity
                                style={[{ paddingRight: 10, paddingLeft: 10, height: 25, alignItems: 'center', justifyContent: 'center' }, [
                                  data1.selected ? { backgroundColor: '#ccc' } : {}]]}
                                onPress={() => this.changeActiveRadio(data1)}
                              >
                                <Text style={[data1.selected ? { color: '#fff' } : {}]}>
                                  {data1.title}
                                </Text>
                              </TouchableOpacity>
                            </View>)

                          })
                        }
                        {/* <TouchableOpacity style={[{ paddingRight: 10, paddingLeft: 10, paddingTop: 3, paddingBottom:4, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }, [
                    this.state.activeRadioArray[0] ?
                      { backgroundColor: '#ccc' } : {}
                  ]]} onPress={() => this.activeRadio(0)}><Text style={[ [
                    this.state.activeRadioArray[0] ?
                      { color: '#fff' } : { }
                  ]]}>One</Text></TouchableOpacity>
                  <TouchableOpacity style={[{ paddingRight: 10, paddingLeft: 10, paddingTop: 3, paddingBottom: 4, borderLeftColor: '#ccc', borderLeftWidth: 1, borderRightColor: '#ccc', borderRightWidth: 1 }, [
                    this.state.activeRadioArray[1] ?
                      { backgroundColor: '#ccc' } : {}
                  ]]} onPress={() => this.activeRadio(1)}><Text style={[[
                    this.state.activeRadioArray[1] ?
                      { color: '#fff' } : {}
                  ]]}>Two</Text></TouchableOpacity>
                  <TouchableOpacity style={[{ paddingRight: 10, paddingLeft: 10, paddingTop: 3, paddingBottom: 4, borderBottomRightRadius: 10, borderTopRightRadius: 10 }, [
                    this.state.activeRadioArray[2] ?
                      { backgroundColor: '#ccc' } : {}
                  ]]} onPress={() => this.activeRadio(2)}><Text style={[[
                    this.state.activeRadioArray[2] ?
                      { color: '#fff' } : {}
                  ]]}>Three</Text></TouchableOpacity> */}
                      </View>
                  </Item>
                </View>

        // <View key={ data.id } style={styles.catIten}>
        //   <View style={styles.catIten_img_view}>
        //     <TouchableOpacity onPress={() => this.openModal(data.service)}>
        //       <Image source={{uri: data.service.banner_image }} style={styles.catIten_img} />
        //     </TouchableOpacity>
        //   </View>
        //   <Text style={styles.catIten_txt}>{data.service.name}</Text>
        // </View>
      ))
    )
    return (
      <Container >
        <StatusBar
          backgroundColor="#cbf0ed"
        />
        <FSpinner visible={this.props.service.busy || this.state.IsSpinnerVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
        <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
          {
            this.props.auth.data.id ?
              <Button transparent style={{ width: 40 }} onPress={() => this.props.navigation.navigate('Menu')}>
                <SimpleLineIcons name="grid" style={[styles.hd_lft_icon, { fontSize: 14, color: '#fff' }]} />
              </Button> : null
          }
          {
            this.props.service.data.features ? <Button transparent style={{ width: 40, backgroundColor: 'transparent' }} disabled /> : null
          }
          <Body style={styles.appHdr2Bdy}>
            <Title style={styles.appHdr2Txt}>{I18n.t('serviceDetails')}</Title>
          </Body>
          
          {
            this.props.auth.data.id ? <Button transparent style={{ width: 40, backgroundColor: 'transparent' }} disabled /> : null
          }
          {
            this.props.service.data.features ? (
              <Button transparent onPress={() => this.props.navigation.navigate('Expect')} style={{ width: 40 }} >
                <Ionicons name="ios-information-circle" style={[styles.hd_rt_icon, { color: '#fff', fontSize: 22 }]} />
              </Button>
            ) : null
          }
        </Header>
        <Content style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', position: 'relative' }}>
              {
                this.state.cover_image ? (
                  <Image source={{ uri: this.state.cover_image }} style={styles.carveImage} />
                ) : (
                    <Image source={carveImage} style={styles.carveImage} />
                  )
              }
            </View></View>

          <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>
            <Image source={img17} style={{ width: deviceWidth, height: 50 }} />
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', marginBottom: 15, marginRight: 15, overflow: 'visible' }}>
            <View style={{ overflow: 'visible', alignItems: 'center' }}>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: -40, justifyContent: 'center', borderWidth: 1, borderRadius: 100, borderColor: 'transparent', height: 50, width: 50, alignItems: 'center', shadowColor: '#ccc', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.5, shadowRadius: 100, elevation: 5, backgroundColor: '#fff'  }}>
                {
                  this.state.banner_image ? (
                    <Image source={{ uri: this.state.banner_image }} style={{ width: 40, height: 40 }} />
                  ) : (
                      <Image source={img18} style={{ width: 50, height: 50 }} />
                    )
                }
              </View>
              <Text style={{ color: '#1e3768' }}>{this.state.serviceName}</Text>
            </View>
          </View>
          <View>
            {
              this.state.questionList.length > 0 ? (
                questionList
              ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={krew_logo} style={{ justifyContent: 'center', width: 100, height: 100 }} />
                  </View>
                )
            }
          </View>
        </Content>
        {
          this.state.questionList.length > 0 ? (
            <Footer>
              <FooterTab>
                <TouchableOpacity onPress={this.goToConfirmation.bind(this)} style={styles.confirmationServicefooterItem}>
                  <Text style={styles.confirmationServicefooterItmTxt} >CONTINUE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmationServicefooterItem2}>
                  <Text style={styles.confirmationServicefooterItmTxt}>{this.state.currency} {this.props.service.data.price}</Text>
                </TouchableOpacity>
              </FooterTab>
            </Footer>
          ) : (
              <View></View>
            )
        }

      </Container>
    );
  }
}

// export default serviceDetails;
// serviceDetails.propTypes = {
//   auth: PropTypes.object.isRequired,
// };
const mapStateToProps = state => ({
  auth: state.auth,
  service: state.service,
});
const mapDispatchToProps = dispatch => ({
  getQuestionListByServiceId: (data) => dispatch(getQuestionListByServiceId(data)),
  setServiceDetails: (data) => dispatch(setServiceDetails(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(serviceDetails);
