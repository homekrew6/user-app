import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, FlatList } from 'react-native';
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IncrimentDecriment from './incrimentDecrimentCompt';
import Slider from 'react-native-slider';
import { getQuestionListByServiceId } from './elements/serviceActions';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Picker, Switch, Footer, FooterTab } from 'native-base';
import I18n from '../../i18n/i18n';
import ImagePicker from 'react-native-image-crop-picker';
import styles from './styles';
import { setServiceDetails } from './elements/serviceActions';
import { navigateAndSaveCurrentScreen } from '../accounts/elements/authActions';
import { RNS3 } from 'react-native-aws3';
import config from '../../config';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require('../../../img/logo2.png');
const carveImage = require('../../../img/bg-6.png');
const logo22 = require('../../../img/logo22.png');
const img17 = require('../../../img/icon17.png');
const img18 = require('../../../img/img22.png');
const img19 = require('../../../img/swiper-2.png');
const img20 = require('../../../img/swiper-2.png');
const img21 = require('../../../img/swiper-2.png');
const img22 = require('../../../img/swiper-2.png');


class serviceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      value: 0.2,
      questionList: [],
      serviceName: props.service.data.name,
      banner_image: props.service.data.banner_image,
      cover_image: props.service.data.cover_image,
      numberValue: 1,
      activeRadioArray: [false, false, false],
      IsSpinnerVisible: false,
      // sliderData: [
      //   {
      //     'src': img19,
      //     'key': 1
      //   },
      //   {
      //     'src': img20,
      //     'key': 2
      //   },
      //   {
      //     'src': img21,
      //     'key': 3
      //   },
      //   {
      //     'src': img22,
      //     'key': 4
      //   },
      //   {
      //     'src': img19,
      //     'key': 5
      //   },
      //   {
      //     'src': img20,
      //     'key': 6
      //   },
      //   {
      //     'src': img21,
      //     'key': 7
      //   }
      // ]
      sliderData: [
        {
          'src': 'https://homekrewbooking.s3.amazonaws.com/66665615_.png',
          'key': 1
        }
      ]
    };
    super(props);
    console.log("propsDetails in service details", props);


  }
  uploadPhoto() {
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
      console.log(options);
      RNS3.put(file, config.s3).then((response) => {
        console.log(response);
        if (response.status !== 201) {
          this.setState({ IsSpinnerVisible: false });
          throw new Error('Failed to upload image to S3');
        }


        if (response.status == 201) {
          let slider = [];
          this.state.sliderData.map(sdata => {
            slider.push(sdata);
          });
          let lengthOfSlider = slider.length;
          lengthOfSlider = lengthOfSlider - 1;
          let latestKey = slider[lengthOfSlider].key;
          latestKey = latestKey + 1;
          let newData = {
            'src': response.body.postResponse.location,
            'key': latestKey
          };
          slider.push(newData);
          this.setState({ IsSpinnerVisible: false });
          this.setState({ sliderData: slider });
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
  changeActiveRadio(data) {
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
                price=Number(price);
                if (dataselected.option_price_impact == "Addition") {
                  price = price - Number(dataselected.price_impact);
                }
                else {
                  price = price / Number(dataselected.price_impact);
                }
                var data = this.props.service.data;
                price = this.addZeroes(price);
                data.price = price;
                this.props.setServiceDetails(data);
              }

            }
          })
        }
      }
    }
    var price = this.props.service.data.price;
    price=Number(price);
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
    var price = this.props.service.data.price;
    price=Number(price);
    data.Status = !data.Status;
    console.log(data.Status);
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
          if (data1.answers[0].option_price_impact == "Addition") {
            price = price - Number(data1.answers[0].price_impact);
          }
          else {
            price = price / Number(data1.answers[0].price_impact);
          }
          var data = this.props.service.data;
          price = this.addZeroes(price);
          data.price = price;
          this.props.setServiceDetails(data);
        }
      }
      else {
        var data1 = this.state.questionList[index];
        if (data1.answers && data1.answers.length > 0) {
          if (data1.answers[0].option_price_impact == "Addition") {
            price = price + Number(data1.answers[0].price_impact);
          }
          else {
            price = price * Number(data1.answers[0].price_impact);
          }
          var data = this.props.service.data;
          price = this.addZeroes(price);
          data.price = price;
          this.props.setServiceDetails(data);
        }
      }




    }
  }
  componentWillMount() {
    this.props.getQuestionListByServiceId(this.props.service.data).then((res) => {
      if (res.type == "success") {
        console.log("success", res);
        this.setState({ questionList: res });
        var price = 0.0;
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
        this.props.setServiceDetails(data);
      }
    }).catch((err) => {
      console.log("error in catch");
      console.log(err);
    });
  }


  addZeroes(num) {
    // var value = Number(num);
    // var res = num.split(".");
    // if (res.length == 1 || (res[1].length < 3)) {
    //   value = value.toFixed(2);
    // }
    let value=num.toFixed(2);
    return value
  }

  sliderChanged(value, data) {
    debugger;
    if (value != 0) {
      value = parseFloat(Math.round(value * 100) / 100).toFixed(2);
      value = Number(value);
      var price = this.props.service.data.price;
      price=Number(price);
      if (data.answers) {
        if (data.answers[0].option_price_impact == "Addition") {
          if (this.props.service.data.value) {
            if (value < this.props.service.data.value) {
              price = price - (value + Number(data.answers[0].price_impact));
            }
            else {
              price = price + (value + Number(data.answers[0].price_impact));
            }
          }
          else {
            price = price + (value + Number(data.answers[0].price_impact));
          }

        }
        else {
          if (this.props.service.data.value) {
            if (value < this.props.service.data.value) {
              price = price + (value + Number(data.answers[0].price_impact));
            }
            else {
              price = price + (value + Number(data.answers[0].price_impact));
            }
          }
          else {
            price = price + (value * Number(data.answers[0].price_impact));
          }

        }

        price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
        price = Number(price);
        var data = this.props.service.data;
        price = this.addZeroes(price);
        data.price = price;
        data.value = value;
        this.props.setServiceDetails(data);
      }
    }


  }


  goToConfirmation()
  {
    const data = this.props.auth.data;
    data.activeScreen = "Confirmation";
    data.previousScreen ="ServiceDetails";
    this.props.navigateAndSaveCurrentScreen(data);
    console.log(this.props.auth.data);
    this.props.navigation.navigate('Confirmation');
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
            <IncrimentDecriment massage={data} onIncrement={this.handleIncrement} onDecrement={this.handleDecrement} />
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
              value={data.start_range}
              onValueChange={value => this.sliderChanged(value, data)}
            />
            <Text style={styles.bedroomCount}>{data.name}</Text>
          </View>
          <Entypo name="home" style={styles.confirmationViewIcon2} />
        </View> : data.type == "5" ? <View key={data.id}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <Text style={{ flex: 1 }}>
              Insert Photo
                </Text>
            <TouchableOpacity onPress={() => this.uploadPhoto()}>
              <Icon name="camera" style={{ fontSize: 16 }}></Icon>
            </TouchableOpacity>
          </View>
          <View style={styles.imagesSliderWarp}>
            <FlatList
              data={this.state.sliderData}
              renderItem={({ item }) =>
                <View>
                  <Image key={item.key} source={{ uri: item.src }} style={styles.imagesSliderImage}></Image>
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
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
                      <View style={{ borderRadius: 10, borderWidth: 1, borderColor: "#ccc", flexDirection: 'row', overflow: 'hidden', }}>

                        {
                          data.answers.map((data1, key1) => {
                            return (<View key={data1.id}>
                              <TouchableOpacity style={[{ paddingRight: 10, paddingLeft: 10, paddingTop: 3, paddingBottom: 4, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }, [
                                data1.selected ?
                                  { backgroundColor: '#ccc' } : {}
                              ]]} onPress={() => this.changeActiveRadio(data1)}><Text style={[[
                                data1.selected ?
                                  { color: '#fff' } : {}
                              ]]}>{data1.title}</Text></TouchableOpacity>
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
          <Button transparent onPress={() => this.props.navigation.goBack()} >
            <SimpleLineIcons name="grid" style={styles.hd_lft_icon} />
          </Button>
          <Body style={styles.appHdr2Bdy}>
            <Title style={styles.appHdr2Txt}>Service Details</Title>
          </Body>
          {/* <Button transparent onPress={() => this.props.navigation.navigate('Expect')} >
            <Ionicons name="ios-information-circle" style={styles.hd_rt_icon} />
          </Button> */}
          {
            this.props.service.data.features ? (
              <Button transparent onPress={() => this.props.navigation.navigate('Expect')} >
                <Ionicons name="ios-information-circle" style={styles.hd_rt_icon} />
              </Button>
            ) : (
                <View ></View>
              )
          }
        </Header>
        <Content style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', position: 'relative' }}>
              {/* <Image source={carveImage} style={styles.carveImage} /> */}

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

          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', marginBottom: 15, marginRight: 15 }}>
            <View>
              <View style={{ flex: 1, flexDirection: 'row', marginTop: -40, justifyContent: 'flex-end', marginRight: 20 }}>
                {/* <Image source={img18} style={{ width: 50, height: 50 }} /> */}
                {
                  this.state.banner_image ? (
                    <Image source={{ uri: this.state.banner_image }} style={{ width: 50, height: 50 }} />
                  ) : (
                      <Image source={img18} style={{ width: 50, height: 50 }} />
                    )
                }
              </View>
              <Text style={{ color: '#1e3768' }}>{this.state.serviceName}</Text>
            </View>
          </View>


          {/* <View style={styles.confirmationServicewarp}>
            <View style={styles.confirmationServiceItem}>
              <View style={styles.confirmationServiceItemIcon2}>
                <Ionicons name="ios-man-outline" style={styles.confirmationServiceItemIconIcn2} />
              </View>
              <Text style={styles.confirmationServiceTxt}>Cleaners</Text>
              <IncrimentDecriment />
            </View>
            <View style={styles.confirmationServiceDvdr} />
            <View style={styles.confirmationServiceItem}>
              <View style={styles.confirmationServiceItemIcon2}>
                <MaterialCommunityIcons name="timer-sand-empty" style={styles.confirmationServiceItemIconIcn2} />
              </View>
              <Text style={styles.confirmationServiceTxt}>Hours</Text>
              <IncrimentDecriment />
            </View>
          </View> */}

          <View>
            {/* {questionList} */}
            {
              this.state.questionList.length > 0 ? (
                questionList
              ) : (
                  <View style={{ flex: 1, alignItems: 'center' }}><Text>No questions found.</Text></View>
                )
            }
            {/* <Item style={styles.confirmationItem}>
              <View style={styles.confirmationIconView}>
                <Image source={logo22} style={{ height: 20, width: 20 }} />
              </View>
              <Text style={styles.confirmationMainTxt}>Question A</Text>
              <Switch value={this.state.isOpen} onValueChange={() => this.switchChange()} />
            </Item>

            <View style={styles.confirmationItem2}>
              <Entypo name="home" style={styles.confirmationViewIcon2} />
              <View style={styles.confirmationMainTxt}>
                <Slider
                  minimumTrackTintColor="#81cdc7"
                  maximumTrackTintColor="#e1e1e1"
                  thumbTintColor="#81cdc7"
                  value={this.state.value}
                  onValueChange={value => this.setState({ value })}
                />
                <Text style={styles.bedroomCount}>2 Bedroom</Text>
              </View>
              <Entypo name="home" style={styles.confirmationViewIcon2} />
            </View>
            <View style={styles.confirmationItem} />

            <Item style={styles.confirmationItem}>
              <View style={styles.confirmationIconView}>
                <Text name="scissors" style={styles.confirmationViewIcon} > ? </Text>
              </View>
              <Text style={styles.confirmationMainTxt}>Question A</Text>
              <IncrimentDecriment />
            </Item>

            <Item style={styles.confirmationItem}>
              <View style={styles.confirmationIconView}>
                <Text name="scissors" style={styles.confirmationViewIcon} > ? </Text>
              </View>
              <Text style={styles.confirmationMainTxt}>Question B</Text>
              <View style={styles.confirmationArwNxt}>
                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
              </View>
            </Item>
            <Item style={styles.confirmationItem}>
              <View style={styles.confirmationIconView}>
                <Icon name="file-photo-o" style={styles.confirmationViewIcon} />
              </View>
              <Text style={styles.confirmationMainTxt}>Insert Photo</Text>
              <View style={{ alignItems: 'center' }}>
                <EvilIcons name="camera" style={{ color: '#81cdc7' }} />
                <Text style={{ fontSize: 10 }}>Take Photo</Text>
              </View>
            </Item> */}
          </View>
        </Content>
        {
          this.state.questionList.length > 0 ? (
            <Footer>
              <FooterTab>
                <TouchableOpacity onPress={() => this.goToConfirmation()} style={styles.confirmationServicefooterItem}><Text style={styles.confirmationServicefooterItmTxt} >CONTINUE</Text></TouchableOpacity>
                <TouchableOpacity style={styles.confirmationServicefooterItem2}><Text style={styles.confirmationServicefooterItmTxt}>AED {this.props.service.data.price}</Text></TouchableOpacity>
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
serviceDetails.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  service: state.service,
});
const mapDispatchToProps = dispatch => ({
  getQuestionListByServiceId: (data) => dispatch(getQuestionListByServiceId(data)),
  setServiceDetails: (data) => dispatch(setServiceDetails(data)),
  navigateAndSaveCurrentScreen: (data) => dispatch(navigateAndSaveCurrentScreen(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(serviceDetails);
