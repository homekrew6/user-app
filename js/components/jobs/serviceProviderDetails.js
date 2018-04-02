import React, { Component } from 'react';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FSpinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import config from '../../config';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title, ActionSheet } from 'native-base';
import styles from './styles';
import Modal from "react-native-modal";
import Communications from 'react-native-communications';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const profileImage = require('../../../img/atul.png');
const carveImage = require('../../../img/bg-1.png');

class ServiceProviderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobDetails: '',
            IsModalVisible: false
        }

    }
    componentDidMount() {
        const value = this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails : '';
        this.setState({ jobDetails: value });

    }


    call() {
        this.setState({ IsModalVisible: true });
    }
    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Content>
                    <Modal isVisible={this.state.IsModalVisible}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                        hideModalContentWhileAnimating={true}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => this.setState({ IsModalVisible: false })}
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                        >


                            <View style={{ flex: 1, flexDirection:'column'}}>
                                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                                    {
                                        this.state.jobDetails && this.state.jobDetails.worker ? (
                                            <Text style={{ color: '#fff', fontSize: 20 }}>{this.state.jobDetails.worker.phone}</Text>
                                        ) : (
                                                <Text>jdfghj</Text>
                                            )
                                    }

                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <TouchableOpacity style={{ flex: 1 }}><Text>Cancel</Text></TouchableOpacity>
                                    </View>
                                   <View>
                                        <TouchableOpacity style={{ flex: 1 }}><Text>Call</Text></TouchableOpacity>
                                   </View>
                                    
                                </View>
                            </View>

                        </TouchableOpacity>
                    </Modal>
                    <Header style={styles.appHdr2} noShadow>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="chevron-left" style={{ fontSize: 18, color: '#71beb8' }} />
                        </Button>
                        <Body style={styles.appHdrtitleWarp}>
                            <Text style={{ color: '#1e3768' }}>Edit My Profile</Text>
                        </Body>
                        <Button transparent />
                    </Header>

                    <View style={styles.editPflHdr}>
                        {/* <View style={styles.editPflHdrWrap}>
                                {
                                    this.state.jobDetails.worker.image ? (
                                        <Thumbnail source={{ uri: this.state.jobDetails.worker.image }} style={styles.editPflHdrThumbnail} />
                                    ) : (
                                            <Thumbnail source={profileImage} style={styles.editPflHdrThumbnail} />
                                        )
                                }
                            </View> */}
                    </View>

                    <View style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Image source={carveImage} style={{ width: deviceWidth }} />
                    </View>

                    <View>
                        <View style={styles.editprofileLst}>
                            <View style={styles.editprofileWarp}>
                                <Text>Name</Text>
                            </View>
                            <View style={styles.editprofileInputwrap}>
                                <Text>gfjj</Text>
                            </View>
                        </View>
                        <View style={styles.editprofileLst}>
                            <View style={styles.editprofileWarp}>
                                <Text>Skills</Text>
                            </View>
                            <View style={styles.editprofileInputwrap}>
                                <Text>ghjghj</Text>
                            </View>
                        </View>
                    </View>

                    <Footer>
                        <FooterTab>
                            <TouchableOpacity full style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#81cdc7' }} onPress={() => this.pressSave()}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>LIVE CHAT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity full style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#81cdc7' }} onPress={() => this.call()}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>CALL ME</Text>
                            </TouchableOpacity>
                        </FooterTab>
                    </Footer>
                </Content>
            </Container>
        );
    }
}

export default ServiceProviderDetails;
