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

import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require("../../../img/logo2.png");
const carve = require("../../../img/icon17.png");

class Confirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#cbf0ed"
                />
                <Content style={styles.bgWhite} >

                    <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                        <Button transparent >
                            <Ionicons name="ios-arrow-back-outline" style={styles.hd_lft_icon} />
                        </Button>
                        <Body style={{ alignItems: 'center' }}>
                            <Title style={ styles.appHdr2Txt }>Confirmation</Title>
                        </Body>
                        <Button transparent/>
                    </Header>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbf0ed', paddingBottom: 30, paddingTop: 14 }}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ borderRadius: 60, height: 60, width: 60, backgroundColor: '#81cdc7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="ios-home-outline" style={{ color: "#fff", fontSize: 34 }} />
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 18, padding: 5, fontSize:16 }}>Home Cleaning</Text>
                            <View style={{ color: "#747474", flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <EvilIcons name="clock" style={{ fontSize: 14, color: "#747474" }}/> 
                                <Text style={{ color: "#747474", fontSize: 14 }}>4 hours</Text>
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 16 }}>AED 360</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: -50 }}>
                        <Image source={carve} style={{ flex: 1, height: 50 }}></Image>
                    </View>
                    <View>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <Ico name='alarm' style={styles.confirmationViewIcon}></Ico>
                            </View>
                            <Text style={styles.confirmationMainTxt}>Date & Time</Text>
                            <Text style={styles.confirmationDateTime}>Mon, 07 Jun 2017, 2:00pm</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='location' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Location</Text>
                            <Text style={styles.confirmationDateTime}>Home</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='credit-card' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Payment</Text>
                            <Text style={styles.confirmationDateTime}>Credit Card / Debit Card</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <EvilIcons name='heart' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Favorite SP</Text>
                            <Text style={styles.confirmationDateTime}>James Harden</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                        <Item style={styles.confirmationItem}>
                            <View style={styles.confirmationIconView}>
                                <Entypo name='scissors' style={styles.confirmationViewIcon} />
                            </View>
                            <Text style={styles.confirmationMainTxt}>Promo Code</Text>
                            <Text style={styles.confirmationDateTime}>AED 50 off</Text>
                            <View style={styles.confirmationArwNxt}>
                                <Ico name="navigate-next" style={styles.confirmationArwNxtIcn} />
                            </View>
                        </Item>

                    </View>
                    <View style={styles.confirmationhd}>
                        <Text style={styles.confirmationhdtxt}>Add Service</Text>
                    </View>
                    <View style={styles.confirmationServicewarp}>
                        <View style={styles.confirmationServiceItem}>
                            <View style={styles.confirmationServiceItemIcon}>
                                <Ionicons name="ios-home-outline" style={styles.confirmationServiceItemIconIcn} />
                            </View>
                            <Text style={styles.confirmationServiceTxt}>Home</Text>
                            <View style={styles.confirmationServicePlusWarp}>
                                <Entypo name='plus' style={styles.confirmationServicePlusIcon} />
                            </View>
                        </View>
                        <View style={styles.confirmationServiceDvdr}></View>
                        <View style={styles.confirmationServiceItem}>
                            <View style={styles.confirmationServiceItemIcon}>
                                <Ionicons name="ios-home-outline" style={styles.confirmationServiceItemIconIcn} />
                            </View>
                            <Text style={styles.confirmationServiceTxt}>Home</Text>
                            <View style={styles.confirmationServicePlusWarp}>
                                <Entypo name='plus' style={styles.confirmationServicePlusIcon} />
                            </View>
                        </View>
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

export default Confirmation;
