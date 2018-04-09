import React, { Component } from 'react';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title, ActionSheet } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FSpinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import I18n from '../../i18n/i18n';

class JobTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.appHdr2} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }}>
                        <EvilIcons name="close" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('followUp')}</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent', }} disabled={true} />
                </Header>
                <Content>
                    <View style={{ backgroundColor: '#fff', paddingTop: 20, paddingBottom: 20, marginBottom: 10 }}>
                        <Text style={{ width: '100%', textAlign: 'center', paddingBottom: 15 }}>Job Status</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={styles.trackLogo}>
                                <Image source={require('../../../img/icon/home.png')} style={styles.trackLogoImg} />
                            </View>
                            <View style={styles.trackArrowWarp}>
                                <Image source={require('../../../img/icon/move-to-the-next-page-symbol.png')} style={styles.trackArrow} />
                            </View>
                            <View style={styles.trackLogo}>
                                <Image source={require('../../../img/icon/man-walking-directions-button.png')} style={styles.trackLogoImg} />
                            </View>
                            <View style={styles.trackArrowWarp}>
                                <Image source={require('../../../img/icon/move-to-the-next-page-symbol.png')} style={styles.trackArrow} />
                            </View>
                            <View style={styles.trackLogo}>
                                <Image source={require('../../../img/icon/people-time.png')} style={styles.trackLogoImg} />
                            </View>
                            <View style={styles.trackArrowWarp}>
                                <Image source={require('../../../img/icon/move-to-the-next-page-symbol.png')} style={styles.trackArrow} />
                            </View>
                            <View style={[styles.trackLogo, true ? { backgroundColor: '#ffd228' } : {}] }>
                                <Image source={require('../../../img/icon/home_ok.png')} style={styles.trackLogoImg} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.trackmetterWarp}>

                        <Text style={styles.trackmetterHeader}>Job Tracking</Text>
                        <View style={styles.trackmetterMainWarp}>
                            <View style={styles.trackmetterItem}>
                                <View style={styles.trackmetterItemInner}>
                                    <Text>Job Requested</Text>
                                    <Text style={styles.trackmetterItemDate}>Thursday, 29 June 2017, 5:00pm</Text>
                                    <View style={styles.crcl}></View>
                                    <View style={styles.line}></View>
                                </View>
                            </View>
                            <View style={styles.trackmetterItem}>
                                <View style={styles.trackmetterItemInner}>
                                    <Text>Krew Assigned</Text>
                                    <Text style={styles.trackmetterItemDate}>Thursday, 29 June 2017, 5:00pm</Text>
                                    <View style={styles.crcl}></View>
                                    <View style={styles.line}></View>
                                </View>
                            </View>
                            <View style={styles.trackmetterItem}>
                                <View style={styles.trackmetterItemInner}>
                                    <Text>Krew On The way</Text>
                                    <Text style={styles.trackmetterItemDate}>Thursday, 29 June 2017, 5:00pm</Text>
                                    <View style={styles.crcl}></View>
                                    <View style={styles.line}></View>
                                </View>
                            </View>
                            <View style={styles.trackmetterItem}>
                                <View style={styles.trackmetterItemInner}>
                                    <Text>Job Started</Text>
                                    <Text style={styles.trackmetterItemDate}>Thursday, 29 June 2017, 5:00pm</Text>
                                    <View style={styles.crcl}></View>
                                    <View style={styles.line}></View>
                                </View>
                            </View>
                            <View style={styles.trackmetterItem}>
                                <View style={styles.trackmetterItemInner}>
                                    <Text>Follow Up</Text>
                                    <Text style={styles.trackmetterItemDate}>Thursday, 29 June 2017, 5:00pm</Text>
                                    <View style={styles.crcl}></View>
                                    <View style={styles.line}></View>
                                </View>
                            </View>
                            <View style={styles.trackmetterItem}>
                                <View style={styles.trackmetterItemInner}>
                                    <Text>Job Completed</Text>
                                    <Text style={styles.trackmetterItemDate}>Thursday, 29 June 2017, 5:00pm</Text>
                                    <View style={styles.crcl}></View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default JobTracker;
