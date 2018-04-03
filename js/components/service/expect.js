import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, AsyncStorage } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import HTMLView from 'react-native-htmlview';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require("../../../img/logo2.png");
const carve = require("../../../img/icon17.png");
const bed = require("../../../img/bed.png");

class Expect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceDetails: props.service.data,
            currency: 'USD'
        }
    }
    
    componentDidMount() {
        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language })
            }
        })
    }

    render() {
        let featureList = (
            this.state.serviceDetails.features.map((data, key) => (
                <View style={{ padding: 10, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e1e1e1', paddingTop: 15, paddingBottom: 15 }} key={key}>
                    <View style={{ height: 50, width: 50, borderColor: '#81cdc7', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                        {
                            this.state.serviceDetails.icon ? (
                                <Image source={{ uri: this.state.serviceDetails.icon }} style={{ height: 30, width: 30 }} />
                            ) : (
                                    <Image source={bed} style={{ height: 30, width: 30 }} />
                                )
                        }

                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, marginTop: 10, color: "#1e3768" }}>{data.name}</Text>
                        <View style={{ paddingLeft: 15 }}>
                            {/* <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                            <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                            <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                            <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                            <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text> */}

                            <HTMLView
                                value={data.desc}
                            />
                        </View>
                    </View>
                </View>
            ))
        )
        return (
            <Container >
                <StatusBar
                    backgroundColor="#cbf0ed"
                />
                <Content style={styles.bgWhite} >

                    <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                        <Button transparent onPress={() => this.props.navigation.goBack()} >
                            <Ionicons name="ios-arrow-back-outline" style={styles.hd_lft_icon} />
                        </Button>
                        <Body style={{ alignItems: 'center' }}>
                            <Title style={styles.appHdr2Txt}>What To Expect</Title>
                        </Body>
                        <Button transparent />
                    </Header>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbf0ed', paddingBottom: 30, paddingTop: 14 }}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{ borderRadius: 60, height: 60, width: 60, backgroundColor: '#81cdc7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="ios-home-outline" style={{ color: "#fff", fontSize: 34 }} />
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 18, padding: 5, fontSize: 16 }}>{this.state.serviceDetails.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <EvilIcons name="clock" style={{ fontSize: 14, color: "#747474" }} />
                                <Text style={{ color: "#747474", fontSize: 14 }}>4 hours</Text>
                            </View>
                            <Text style={{ color: '#1e3768', fontSize: 16 }}>{this.state.currency} 360</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: -50 }}>
                        <Image source={carve} style={{ flex: 1, height: 50 }}></Image>
                    </View>

                    <View>
                        {/* <View style={{ padding: 10, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e1e1e1', paddingTop: 15, paddingBottom: 15}}>
                            <View style={{ height: 50, width: 50, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                <Image source={bed} style={{ height: 30, width: 30 }} />
                            </View>
                            <View style = {{ flex:1}}>
                                <Text style={{ fontSize: 16, marginTop: 10, color: "#1e3768" }}>Bedrooms & Common Areas</Text>
                                <View style={{ paddingLeft: 15 }}>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-all trash removed</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ padding: 10, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e1e1e1', paddingTop: 15, paddingBottom: 15 }}>
                            <View style={{ height: 50, width: 50, borderColor: '#81cdc7', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                <Image source={bed} style={{ height: 30, width: 30 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, marginTop: 10, color: "#1e3768"  }}>Bedrooms & Common Areas</Text>
                                <View style={{ paddingLeft: 15 }}>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-all trash removed</Text>
                                </View>
                            </View>
                        </View> */}
                        {/* <View style={{ padding: 10, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e1e1e1', paddingTop: 15, paddingBottom: 15 }}>
                            <View style={{ height: 50, width: 50, borderColor: '#81cdc7', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                <Image source={bed} style={{ height: 30, width: 30 }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, marginTop: 10, color: "#1e3768" }}>Bedrooms & Common Areas</Text>
                                <View style={{ paddingLeft: 15 }}>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                    <Text style={{ fontSize: 12, paddingTop: 6, color: '#747474' }}>-surfaces dusted and wiped</Text>
                                </View>
                            </View>
                        </View> */}
                        {featureList}
                    </View>
                </Content>
            </Container>
        );
    }
}

// export default Expect;
Expect.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});


export default connect(mapStateToProps)(Expect);
