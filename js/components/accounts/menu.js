import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from './elements/authActions'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity } from "react-native";

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
const back_arow = require("../../../img/arrow_back.png");
const logo_hdr = require("../../../img/logo2.png");

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
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
        this.props.login(email, password).then(res => {
            console.log(res);
            if (res.status === 200) {
                console.log(res.json())
            } else {
                Alert.alert('Login fail,please try again');
            }

            // if(res.status!=='success'){
            //
            //   this.setState({email:'',password:''});
            // }else{
            // 	Alert.alert('Login success');
            //   //this.props.navigation.navigate("Home");
            // }
        }).catch(err => {
            Alert.alert('Login fail,please try again');
            //return err
        })
    }


    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Content>
                <Header style={styles.appHdr}>
                    <Button transparent/>
                        <Body style={styles.appHdrtitleWarp}>
                            <Image source={logo_hdr} style={{ height: 18, width: 100 }}/>
                    </Body>
                       <Button transparent >
                            <Icon name='search'/>
                       </Button>
  
                </Header>
                <Card>
                        <CardItem style={styles.pcard}>
                        <View style={styles.flx_View}>
                            <Image source={profileImage} style={styles.profileImage}/>
                            <View>
                                <Text style={styles.pname}>Tiffany Krew</Text>
                                <Text style={styles.pemail}>tiffany@email.com</Text>
                                <Text style={styles.pphone}>123456789</Text>
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
                        <View style={styles.menuCardView}>
                            <Image source={icon3} style={styles.menuCardIcon} />
                            <Text style={styles.menuCardTxt}>My Location</Text>
                                <View style={styles.arw_lft}>
                                    <Image source={back_arow} style={styles.arw_lft_img} />
                            </View>
                        </View>
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
                            <View style={{ width: 20 }}>
                                    <Image source={back_arow} style={styles.arw_lft_img} />
                            </View>
                        </View>
                    </CardItem>
                    <CardItem style={styles.menuCarditem}>
                        <View style={ styles.menuCardView} >
                            <Image source={icon6} style={styles.menuCardIcon} />
                            <Text style={styles.menuCardTxt}>Settings</Text>
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

Login.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (email, password) => dispatch(login(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
