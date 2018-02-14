import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout } from './elements/authActions'
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
const icon8 = require("../../../img/icon8.png");
const back_arow = require("../../../img/arrow_back.png");
const logo_hdr = require("../../../img/logo2.png");

class Menu extends Component {
    constructor(props) {
        super(props);
        console.log(props);

    }

    logout(){
      this.props.logout(res=>{
  			if(res){
  				this.props.navigation.navigate("Login")
  			}else{
  				this.props.navigation.navigate("Menu")
  			}
  		})
    }

    render() {
        return (
            <Container >
              <StatusBar
                backgroundColor="#81cdc7"
              />
              <Content>


                <Header style={{ backgroundColor: '#fff' }}>
                  <Button transparent/>
                  <Body style={styles.appHdrtitleWarp}>
                    <Image source={logo_hdr} style={{ height: 18, width: 110 }}/>
                  </Body>
                  <Button transparent >
                  <Icon name='search' style={{ color: '#81cdc7' }}/>
                  </Button>

                </Header>


                <Card>
                  <CardItem style={styles.pcard}>

                    <View style={styles.flx_View}>
                      {
                        this.props.auth.data.image ? (
                          <Image source={profileImage} style={styles.profileImage}/>
                        ):(
                          <Image source={profileImage} style={styles.profileImage}/>
                        )
                      }

                      <View>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("EditProfile")}>
                          <Text style={styles.pname}>{this.props.auth.data.name}</Text>
                          <Text style={styles.pemail}>{this.props.auth.data.email}</Text>
                          <Text style={styles.pphone}>{this.props.auth.data.phone}</Text>
                        </TouchableOpacity>
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
                    <View style={styles.arw_lftgit}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem}>
                    <View style={ styles.menuCardView} >
                      <Image source={icon7} style={styles.menuCardIcon} />
                      <Text style={styles.menuCardTxt}>Settings</Text>
                      <View style={styles.arw_lft}>
                        <Image source={back_arow} style={styles.arw_lft_img} />
                      </View>
                    </View>
                  </CardItem>

                  <CardItem style={styles.menuCarditem} >
                    <View style={ styles.menuCardView} >

                      <Image source={icon8} style={styles.menuCardIcon} onPress={() =>this.logout()}/>
                      <Text style={styles.menuCardTxt} onPress={() =>this.logout()}>Logout</Text>
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

Menu.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout:(cb)=>dispatch(logout(cb))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
