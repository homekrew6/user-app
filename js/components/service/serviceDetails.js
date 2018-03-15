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
import styles from './styles';
import { setServiceDetails } from './elements/serviceActions';
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
      sliderData: [
        {
          'src': img19,
          'key': 1
        },
        {
          'src': img20,
          'key': 2
        },
        {
          'src': img21,
          'key': 3
        },
        {
          'src': img22,
          'key': 4
        },
        {
          'src': img19,
          'key': 5
        },
        {
          'src': img20,
          'key': 6
        },
        {
          'src': img21,
          'key': 7
        }
      ]
    };
    super(props);
    console.log("propsDetails in service details", props);


  }
  switchChange() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
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
        var data=this.props.service.data;
        data.questionList=this.state.questionList;
        data.price=price;
        this.props.setServiceDetails(data);
      }
    }).catch((err) => {
      console.log("error in catch");
      console.log(err);
    });
  }

 
  render() {

    let questionList = (
      this.state.questionList.map((data, key) => (
        data.type == "1" ? <View key={data.id} >
          <Item style={styles.confirmationItem}  >
            <View style={styles.confirmationIconView}>
              <Text name="scissors" style={styles.confirmationViewIcon} > ? </Text>
            </View>
            <Text style={styles.confirmationMainTxt}>{data.name}</Text>
            <IncrimentDecriment massage={data} onIncrement={this.handleIncrement} onDecrement={this.handleDecrement} />
          </Item>
        </View> : data.type == "2" ? <View key={data.id}>
          <Item style={styles.confirmationItem}>
            <View style={styles.confirmationIconView}>
              <Image source={logo22} style={{ height: 20, width: 20 }} />
            </View>
            <Text style={styles.confirmationMainTxt}>{data.name}</Text>
            <Switch value={this.state.isOpen} onValueChange={() => this.switchChange()} />
          </Item>
        </View> : data.type == "4" ? <View style={styles.confirmationItem2} key={data.id}>
          <Entypo name="home" style={styles.confirmationViewIcon2} />
          <View style={styles.confirmationMainTxt}>
            <Slider
              minimumTrackTintColor="#81cdc7"
              maximumTrackTintColor="#e1e1e1"
              thumbTintColor="#81cdc7"
              value={this.state.value}
              onValueChange={value => this.setState({ value })}
            />
            <Text style={styles.bedroomCount}>{data.name}</Text>
          </View>
          <Entypo name="home" style={styles.confirmationViewIcon2} />
        </View> : data.type == "5" ? <View key={data.id}>
          <View style={styles.imagesSliderWarp}>
            <FlatList
              data={this.state.sliderData}
              renderItem={({ item }) =>
                <Image key={item.key} source={item.src} style={styles.imagesSliderImage}></Image>
              }
              horizontal={true}
              style={styles.imagesSliderFlatList}
            />
          </View>
        </View> : <Text key={data.id}>No type found.</Text>

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
        <Content style={styles.bgWhite} >
          <FSpinner visible={this.props.service.busy} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
          <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
            <Button transparent onPress={() => this.props.navigation.goBack()} >
              <SimpleLineIcons name="grid" style={styles.hd_lft_icon} />
            </Button>
            <Body style={styles.appHdr2Bdy}>
              <Title style={styles.appHdr2Txt}>Service Details</Title>
            </Body>
            <Button transparent onPress={() => this.props.navigation.navigate('Expect')} >
              <Ionicons name="ios-information-circle" style={styles.hd_rt_icon} />
            </Button>
          </Header>
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
            {questionList}
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

          <Footer>
            <FooterTab>
              <TouchableOpacity style={styles.confirmationServicefooterItem}><Text style={styles.confirmationServicefooterItmTxt}>CONTINUE</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmationServicefooterItem2}><Text style={styles.confirmationServicefooterItmTxt}>AED {this.props.service.data.price}</Text></TouchableOpacity>
            </FooterTab>
          </Footer>

        </Content>
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
  setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(serviceDetails);
