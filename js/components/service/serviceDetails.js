import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IncrimentDecriment from './incrimentDecrimentCompt'
import Slider from 'react-native-slider'

import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Picker, Switch, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require("../../../img/logo2.png");
const carveImage = require("../../../img/bg-6.png");
const logo22 = require("../../../img/logo22.png");
const img17 = require("../../../img/icon17.png");
const img18 = require("../../../img/img22.png");

class serviceDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen : true,
            value: 0.2,
        }
    }
    switchChange(){
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Container >
              <StatusBar
                backgroundColor="#cbf0ed"
              />
              <Content style={styles.bgWhite} >

                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                  <Button transparent onPress={() => this.props.navigation.goBack()} >
                    <SimpleLineIcons name="grid" style={styles.hd_lft_icon}  />
                  </Button>
                  <Body style={styles.appHdr2Bdy}>
                    <Title style={styles.appHdr2Txt}>Service Details</Title>
                  </Body>
                  <Button transparent onPress={() => this.props.navigation.navigate("Expect")} >
                    <Ionicons name='ios-information-circle' style={styles.hd_rt_icon} />
                  </Button>
                </Header>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'row', position: 'relative' }}>
                    <Image source={carveImage} style={styles.carveImage} />
                  </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>
                  <Image source={img17} style={{ width: deviceWidth, height: 50 }}></Image>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', marginBottom: 15, marginRight: 15 }}>
                  <View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: -40, justifyContent: 'flex-end', marginRight: 20 }}>
                      <Image source={img18} style={{ width: 50, height: 50 }}></Image>
                    </View>
                    <Text style={{ color: '#1e3768' }}>Cleaning</Text>
                  </View>
                </View>



                <View style={styles.confirmationServicewarp}>
                  <View style={styles.confirmationServiceItem}>
                    <View style={styles.confirmationServiceItemIcon2}>
                      <Ionicons name="ios-man-outline" style={styles.confirmationServiceItemIconIcn2} />
                    </View>
                    <Text style={styles.confirmationServiceTxt}>Cleaners</Text>
                    <IncrimentDecriment />
                  </View>
                  <View style={styles.confirmationServiceDvdr}></View>
                  <View style={styles.confirmationServiceItem}>
                    <View style={styles.confirmationServiceItemIcon2}>
                      <MaterialCommunityIcons name="timer-sand-empty" style={styles.confirmationServiceItemIconIcn2} />
                    </View>
                    <Text style={styles.confirmationServiceTxt}>Hours</Text>
                    <IncrimentDecriment />
                  </View>
                </View>

                <View>
                  <Item style={styles.confirmationItem}>
                    <View style={styles.confirmationIconView}>
                      <Image source={logo22} style={{ height: 20, width: 20 }} />
                    </View>
                    <Text style={styles.confirmationMainTxt}>Question A</Text>
                    <Switch value={this.state.isOpen} onValueChange={() => this.switchChange()} />
                  </Item>

                  <View style={styles.confirmationItem2}>
                    <Entypo name='home' style={styles.confirmationViewIcon2} />
                    <View style={styles.confirmationMainTxt}>
                      <Slider
                        minimumTrackTintColor='#81cdc7'
                        maximumTrackTintColor="#e1e1e1"
                        thumbTintColor='#81cdc7'
                        value={this.state.value}
                        onValueChange={(value) => this.setState({ value })} />
                      <Text style={ styles.bedroomCount }>2 Bedroom</Text>
                    </View>
                    <Entypo name='home' style={styles.confirmationViewIcon2} />
                  </View>
                  <View style={styles.confirmationItem}>

                  </View>

                  <Item style={styles.confirmationItem}>
                    <View style={styles.confirmationIconView}>
                      <Text name='scissors' style={styles.confirmationViewIcon} > ? </Text>
                    </View>
                    <Text style={styles.confirmationMainTxt}>Question A</Text>
                    <IncrimentDecriment />
                  </Item>

                  <Item style={styles.confirmationItem}>
                    <View style={styles.confirmationIconView}>
                      <Text name='scissors' style={styles.confirmationViewIcon} > ? </Text>
                    </View>
                    <Text style={styles.confirmationMainTxt}>Question B</Text>
                    <View style={styles.confirmationArwNxt}>
                      <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                    </View>
                  </Item>
                  <Item style={styles.confirmationItem}>
                    <View style={styles.confirmationIconView}>
                      <Icon name='file-photo-o' style={styles.confirmationViewIcon} />
                    </View>
                    <Text style={styles.confirmationMainTxt}>Insert Photo</Text>
                    <View style={{ alignItems: 'center' }}>
                      <EvilIcons name="camera" style={{ color: '#81cdc7' }} />
                      <Text style={{ fontSize: 10 }}>Take Photo</Text>
                    </View>
                  </Item>
                    </View>

                    <Footer>
                        <FooterTab>
                            <TouchableOpacity style={styles.confirmationServicefooterItem}><Text style={styles.confirmationServicefooterItmTxt}>CONTINUE</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.confirmationServicefooterItem2}><Text style={styles.confirmationServicefooterItmTxt}>AED 295.00</Text></TouchableOpacity>
                        </FooterTab>
                    </Footer>

                </Content>
            </Container>
        );
    }
}

export default serviceDetails;
