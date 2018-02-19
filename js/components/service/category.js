import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem,  } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Picker} from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width; 
const logo_hdr = require("../../../img/logo2.png");
const carveImage = require("../../../img/bg-5.png");
const img11 = require("../../../img/icon11.png");
const img12 = require("../../../img/icon12.png");
const img13 = require("../../../img/icon13.png");
const img14 = require("../../../img/icon14.png");
const img15 = require("../../../img/icon15.png");
const img16 = require("../../../img/icon16.png");
const img17 = require("../../../img/icon17.png");

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected1: "key0",
            coverImgWith: deviceWidth + 120,
        }
    }
    onValueChange(value) {
        this.setState({
            selected1: value
        });
        console.log(this.state.coverImgWith);
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
                            <SimpleLineIcons name="grid" style={styles.hd_lft_icon} />
                        </Button>
                        <Body style={{ alignItems: 'center' }}>
                            <Image source={logo_hdr} style={styles.logo_hdr_img} />
                        </Body>
                        <Button transparent >
                            <Ionicons name='ios-notifications-outline' style={styles.hd_rt_icon} />
                        </Button>
                        <Button transparent >
                            <Ionicons name='ios-search-outline' style={styles.hd_rt_icon} />
                        </Button>
                    </Header>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'row'  }}>
                            <Image source={carveImage} style={styles.carveImage}>
                            <View style={{ width: 120 }}>
                                <Picker
                                    mode="dropdown"
                                    mode="dropdown"
                                    selectedValue={this.state.selected1}
                                    onValueChange={this.onValueChange.bind(this)}
                                    supportedOrientations="Portrait"
                                >
                                    <Item label="Dubai" value="key0" />
                                    <Item label="London" value="key1" />
                                </Picker>
                            </View>
                        </Image>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>
                        <Image source={img17} style={{ width: deviceWidth, height: 50 }}></Image>
                    </View>

                    <View style={styles.catIten_hdr}>
                        <Text style={styles.catIten_hdr_txt}>Browse by categories</Text>
                    </View>

                    <View style={styles.catIten_txt_warp}>
                        <View style={styles.catIten}>
                            <View style={styles.catIten_img_view}>
                                <Image source={img11} style={styles.catIten_img} />
                            </View>
                            <Text style={styles.catIten_txt}>Cleaning</Text>
                        </View>
                        <View style={styles.catIten}>
                            <View style={styles.catIten_img_view}>
                                <Image source={img12} style={styles.catIten_img} />  
                            </View>                      
                            <Text style={styles.catIten_txt}>Handyman</Text>
                        </View>
                        <View style={styles.catIten}>
                            <View style={styles.catIten_img_view}>
                                <Image source={img13} style={styles.catIten_img}/>  
                            </View>
                            <Text style={styles.catIten_txt}>Plumbing</Text>
                        </View>
                        <View style={styles.catIten}>
                            <View style={styles.catIten_img_view}>
                                <Image source={img14} style={styles.catIten_img} />  
                            </View>
                            <Text style={styles.catIten_txt}>Electrical</Text>
                        </View>
                        <View style={styles.catIten}>
                            <View style={styles.catIten_img_view} >
                                <Image source={img15} style={styles.catIten_img} />
                            </View>
                            <Text style={styles.catIten_txt}>Air Conditioning</Text>
                        </View>
                        <View style={styles.catIten}>
                            <View style={styles.catIten_img_view}>
                                <Image source={img16} style={styles.catIten_img} />
                            </View>
                            <Text style={styles.catIten_txt}>Washing</Text>
                        </View>
                    </View>

                    {/* <GridView style={styles.gridView}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemName}>1</Text>
                            <Text style={styles.itemCode}>2</Text>
                        </View>
                    </GridView> */}

                </Content>
            </Container>
        );
    }
}

export default Categories;
