import React, { Component } from 'react';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FSpinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import config from '../../config';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title, ActionSheet } from 'native-base';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import Communications from 'react-native-communications';
import I18n from '../../i18n/i18n';
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
    componentWillMount() {
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
                <Header style={styles.appHdr2} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('serviceProvider')}</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent', }} disabled={true} />
                </Header>
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


                            <View style={{flexDirection:'column', flex: 1, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden'}}>
                                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                                    {
                                        this.state.jobDetails && this.state.jobDetails.worker ? (
                                            <Text style={{ paddingTop: 10,  fontSize: 20 }}>{this.state.jobDetails.worker.phone}</Text>
                                        ) : (
                                                <Text></Text>
                                            )
                                    }

                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity 
                                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', height: 40 }}
                                        onPressOut={() => this.setState({ IsModalVisible: false })}
                                    ><Text style={{ color: '#fff' }}>{I18n.t('cancel')}</Text></TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#81cdc7', height: 40 }} onPress={() => Communications.phonecall(this.state.jobDetails.worker.phone, true)}><Text style={{ color: '#fff' }}>{I18n.t('call')}</Text></TouchableOpacity>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </Modal>

                    

                    <View style={{ backgroundColor: '#fff', marginTop: 8 }}>

                        <View style={{ paddingBottom: 0, marginBottom: 0, alignItems: 'center', paddingTop: 15, paddingBottom: 15 }}>
                            {
                                this.state.jobDetails && this.state.jobDetails.worker ? (
                                    <Image source={{ uri: this.state.jobDetails.worker.image }} style={{ width: 130, height: 130, borderRadius: 100 }} />
                                ) : (
                                        <Text></Text>
                                    )
                            }
                            
                        </View>

                        <View style={{padding: 8 }}>
                            <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', flex: 1 }}>
                                <Text style={{ fontSize: 14 }}>{I18n.t('name')}</Text>
                                {
                                    this.state.jobDetails && this.state.jobDetails.worker ? (
                                        <Text style={{ color: '#848282' }}>
                                        {this.state.jobDetails.worker.name}

                                        </Text>
                                    ) : (
                                        <Text></Text>
                                        )
                                }
                                
                            </View>
                            <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', }} >
                                <Text style={{ fontSize: 14, }}>
                                    {I18n.t('skills').toUpperCase()}
                                </Text>
                                <Text style={{ color: '#848282' }}>avcc</Text>
                            </View>
                        </View>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#81cdc7' }} onPress={() => this.pressSave()}>
                            <Text style={{ color: '#fff', fontSize: 14 }}>{I18n.t('liveChat')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#81cdc7' }} onPress={() => this.call()}>
                            <Text style={{ color: '#fff', fontSize: 14 }}>{I18n.t('callMe')}</Text>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export default ServiceProviderDetails;
