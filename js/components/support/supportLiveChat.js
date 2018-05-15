import React, { Component } from "react";
import { Image, View, StatusBar, TouchableOpacity, Text, TextInput, ScrollView, Alert, Keyboard, AsyncStorage } from "react-native";
import { Container, Header, Content, Body, Title, Footer, FooterTab, Button, ActionSheet } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import I18n from '../../i18n/i18n';
import styles from "./styles";
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import config from '../../config';
import ImagePicker from 'react-native-image-crop-picker';
import FSpinner from 'react-native-loading-spinner-overlay';
// const firebaseConfig = {
//     apiKey: "AIzaSyCnS3M8ZZBYRH4QubDH3OJPKSgk-03Nm9w",
//     authDomain: "krew-user-app.firebaseapp.com",
//     databaseURL: "https://krew-user-app.firebaseio.com",
//     storageBucket: "krew-user-app.appspot.com"
// };
const firebaseConfig = {
    apiKey: "AIzaSyCRclijPdb65nW25fvZozVv0LekbC0GHRM",
    authDomain: "homekrew-91b4e.firebaseapp.com",
    databaseURL: "https://homekrew-91b4e.firebaseio.com",
    storageBucket: "homekrew-91b4e.appspot.com"
};
import { RNS3 } from 'react-native-aws3';
// var BUTTONS = [
//     { text: "Camera", icon: "ios-camera", iconColor: "#2c8ef4" },
//     { text: "File", icon: "ios-images", iconColor: "#f42ced" }
// ];
var BUTTONS = [
    { text: I18n.t('camera'), icon: "ios-camera", iconColor: "#2c8ef4" },
    { text: I18n.t('file'), icon: "ios-images", iconColor: "#f42ced" }
];
// AsyncStorage.getItem("language").then((value) => {
//     if (value) {
//         const value1 = JSON.parse(value);
//         I18n.locale = value1.Code;
//         BUTTONS = [
//             { text: I18n.t('camera'), icon: "ios-camera", iconColor: "#2c8ef4" },
//             { text: I18n.t('file'), icon: "ios-images", iconColor: "#f42ced" }
//         ]
//     }
// });
class SupportLiveChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeMessage: '',
            agentDetails: '',
            chatRoomId: '',
            chatList: [],
            chatRef: '',
            visible: false
        };
        if (!firebase.apps.length) {
            firebase.initializeApp({});
        }
        else {
            this.state.chatRef = firebase.apps[0].database().ref().child('supportChat');
        }
    }

    sendMessage() {
        if (this.state.typeMessage) {
            const data = {
                Message: this.state.typeMessage, IsAdminSender: false, chatRoomId:
                    this.state.chatRoomId, customerName: this.props.auth.data.name, customerId: this.props.auth.data.id, date: new Date().toUTCString(), adminId: this.props.navigation.state.params.agent.id
            };
            if (this.state.chatRef) {
                this.state.chatRef.push(data);
                this.setState({ typeMessage: '' });
            }
            else {
                firebase.apps[0].database().ref().child('supportChat').push(data);
                this.setState({ typeMessage: '' });
            }
        }
        else {
            Alert.alert(I18n.t('please_type_message_to_send'));
        }
    }
    componentDidMount() {

        if (this.props.auth.data && this.props.navigation.state.params) {
            this.setState({ LoginId: this.props.auth.data.id, agentDetails: this.props.navigation.state.params.agent });
            const chatRoomId = this.props.navigation.state.params.agent.id + "_" + this.props.auth.data.id;
            this.setState({ chatRoomId: chatRoomId });
        }

        if (this.state.chatRef) {
            const chatRoomId = this.props.navigation.state.params.agent.id + "_" + this.props.auth.data.id;
            this.state.chatRef.on('value', (chats) => {
                const chatList = chats.val();
                let finalChatList = [];
                if (chatList) {
                    for (let key in chatList) {
                        if (chatList[key].chatRoomId == chatRoomId) {
                            finalChatList.push(chatList[key]);
                        }
                    }
                    this.setState({ chatList: finalChatList });
                }
            });
        }
        else {
            firebase.apps[0].database().ref().child('supportChat').on('value', (chats) => {
                const chatList = chats.val();
                let finalChatList = [];
                if (chatList) {
                    for (let key in chatList) {
                        if (chatList[key].chatRoomId == chatRoomId) {
                            finalChatList.push(chatList[key]);
                        }
                    }
                    this.setState({ chatList: finalChatList });
                }
            });
        }
        setTimeout(() => {
            if (this.refs && this.refs.ScrollViewStart) {
                this.refs.ScrollViewStart.scrollToEnd(true);
            }

        }, 2000);

    }
    fileUploadType(buttonIndex) {
        if (buttonIndex == 0) {
            this.captureFile();
        }
        if (buttonIndex == 1) {
            this.attachFile();
        }
    }
    captureFile(data) {
        this.setState({ visible: true });
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
           
            const options = config.s3;
            RNS3.put(file, config.s3).then((response) => {
                if (response.status !== 201) {
                    this.setState({ visible: false });
                    throw new Error('Failed to upload image to S3');
                }


                if (response.status == 201) {

                    const data = {
                        Message: '', MessageImage: response.body.postResponse.location, IsAdminSender: false, chatRoomId:
                            this.state.chatRoomId, customerName: this.props.auth.data.name, customerId: this.props.auth.data.id, date: new Date().toUTCString(), adminId: this.props.navigation.state.params.agent.id
                    };
                    if (this.state.chatRef) {
                        this.state.chatRef.push(data);
                        this.setState({ typeMessage: '', visible: false });
                    }
                    else {
                        firebase.apps[0].database().ref().child('supportChat').push(data);
                        this.setState({ typeMessage: '', visible: false });
                    }

                }
            }).catch((err) => {
                this.setState({ visible: false });
           
            });
        }).catch((err) => {
            this.setState({ visible: false });
         
        });
    }

    attachFile() {

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
                    this.setState({ visible: false });
                    throw new Error('Failed to upload image to S3');
                }


                if (response.status == 201) {
                    const data = {
                        Message: '', MessageImage: response.body.postResponse.location, IsAdminSender: false, chatRoomId:
                            this.state.chatRoomId, customerName: this.props.auth.data.name, customerId: this.props.auth.data.id, date: new Date().toUTCString(), adminId: this.props.navigation.state.params.agent.id
                    };
                    if (this.state.chatRef) {
                        this.state.chatRef.push(data);
                        this.setState({ typeMessage: '', visible: false });
                    }
                    else {
                        firebase.apps[0].database().ref().child('supportChat').push(data);
                        this.setState({ typeMessage: '', visible: false });
                    }


                }
            }).catch((err) => {
             
                this.setState({ visible: false });
            });





        }).catch((err) => {
            this.setState({ visible: false });
        });
    }
    uploadPhoto() {
        ActionSheet.show(
            {
                options: BUTTONS,
            },
            (buttonIndex) => {
                this.setState({ clicked: BUTTONS[buttonIndex] });
                // this.setState({ filecat: buttonIndex });
                //console.log(buttonIndex);
                // this.setState({ filecat: buttonIndex});
                this.fileUploadType(buttonIndex);
            },
        )
    }

    render() {
        return (
            <Container >

                <StatusBar
                    backgroundColor="#81cdc7"
                />

                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" noShadow >
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={styles.buttonIconWarp}>
                        <Ionicons style={styles.headerIconClose} name='ios-arrow-back' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={{ fontSize: 14 }}>{I18n.t('typicallyRepliesInAFewMinutes')}</Title>
                    </Body>
                    <Button transparent style={styles.buttonIconWarp} >
                        <Ionicons style={styles.headerIconClose} name='ios-close' />
                    </Button>
                </Header>


                <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <View style={styles.scrollWarp}>

                    <View style={styles.chatterHeaderWarp}>
                        <View style={styles.chatterHeaderWarpInner}>
                            <View style={styles.chatterHeaderImageWarp}>
                                <Image source={require('../../../img/atul.png')} style={styles.chatterHeaderImage} />
                            </View>
                            <View style={styles.chatterHeadertextWarp}>
                                <Text>{this.state.agentDetails.name}</Text>
                                <Text style={styles.chatterHeaderTime}>Active in the last 15m</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.sortMassage}> Hi! Need help with a booking or have some feedback about the app? Let me know! I'm here to help. </Text>
                        </View>
                    </View>

                    <ScrollView
                        ref='ScrollViewStart'
                        style={styles.scrollChat}
                    >
                        {
                            this.state.chatList.map((item, key) => {
                                return (
                                    item.IsAdminSender ?
                                        (
                                            <View style={styles.chatWarp} key={key}>
                                                <View style={styles.person2ImageWarp}>
                                                    <Image source={require('../../../img/atul.png')} style={styles.person2Image} />
                                                </View>
                                                <View style={styles.person2Warp}>
                                                    <View style={styles.person2TextWarp}>
                                                        {
                                                            item.Message ? (
                                                                <Text style={styles.personText}>{item.Message}</Text>
                                                            ) : (
                                                                    <Image source={{ uri: item.MessageImage }} style={{ height: 100, width: 100, borderRadius: 4 }} />
                                                                )
                                                        }

                                                    </View>
                                                    <Image source={require('../../../img/icon/chats.png')} style={styles.person2Arrow} />
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.chatWarp} key={key}>

                                                <View style={styles.person1Warp}>
                                                    <View style={styles.person1TextWarp}>
                                                        {
                                                            item.Message ? (
                                                                <Text style={styles.personText}>{item.Message}</Text>
                                                            ) : (
                                                                    <Image source={{ uri: item.MessageImage }} style={{ height: 100, width: 100, borderRadius: 4 }} />
                                                                )
                                                        }
                                                    </View>
                                                    <Image source={require('../../../img/icon/chats2.png')} style={styles.person1Arrow} />
                                                </View>

                                                <View style={styles.person1ImageWarp} >
                                                    <Image source={require('../../../img/atul.png')} style={styles.person1Image} />
                                                </View>
                                            </View>
                                        )


                                )

                            })
                        }
                        {/* <View style={styles.chatWarp}>

                            <View style={styles.person1Warp}>
                                <View style={styles.person1TextWarp}>
                                    <Text style={styles.personText}>Hey there, I just wanted to let you know that during this Eid holiday, there will be limited availability on Friday, 1 Sept. and Saturday, 2 Sept. for all services. however, our support team will be available throughout the long weekend to assist you with anything you may meed. so fell free to send us a message here! Eid Mubarak and have a wonderful weekend</Text>
                                </View>
                                <Image source={require('../../../img/icon/chats2.png')} style={styles.person1Arrow} />
                            </View>

                            <View style={styles.person1ImageWarp} >
                                <Image source={require('../../../img/atul.png')} style={styles.person1Image} />
                            </View>
                        </View>
                        <View style={styles.chatWarp}>
                            <View style={styles.person2ImageWarp}>
                                <Image source={require('../../../img/atul.png')} style={styles.person2Image} />
                            </View>
                            <View style={styles.person2Warp}>
                                <View style={styles.person2TextWarp}>
                                    <Text style={styles.personText}>Hey there, I just wanted to let you know that during this Eid holiday, there will be limited availability on Friday, 1 Sept. and Saturday, 2 Sept. for all services. however, our support team will be available throughout the long weekend to assist you with anything you may meed. so fell free to send us a message here! Eid Mubarak and have a wonderful weekend</Text>
                                </View>
                                <Image source={require('../../../img/icon/chats.png')} style={styles.person2Arrow} />
                            </View>
                        </View> */}

                    </ScrollView>
                </View>

                <Footer>
                    <FooterTab>
                        <View style={styles.chatfooterWarp}>
                            <TouchableOpacity style={styles.chatIcon} onPress={() => this.uploadPhoto()}>
                                <Entypo name="camera" style={styles.chatCameraIcon} />
                            </TouchableOpacity>
                            <View style={styles.chatMiddleInputWarp}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.chatMiddleInput}
                                    onChangeText={(text) => this.setState({ typeMessage: text })}
                                    value={this.state.typeMessage} onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>
                            <TouchableOpacity style={styles.chatIcon} onPress={() => this.sendMessage()}>
                                <Ionicons name="md-send" style={styles.sendIcon} />
                            </TouchableOpacity>
                        </View>
                    </FooterTab>
                </Footer>

            </Container>
        );
    }
}
// SupportLiveChat.propTypes = {
//     auth: PropTypes.object.isRequired,
// };
const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({

});
//export default SupportLiveChat;
export default connect(mapStateToProps, mapDispatchToProps)(SupportLiveChat);
