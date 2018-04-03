import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, AsyncStorage } from "react-native";
import { Container, Header, Button, Content, Form, Left, Right, Body, Title, Item, Icon, Frame, Input, Label, Text } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Communications from 'react-native-communications';
import I18n from '../../i18n/i18n';
const win = Dimensions.get('window').width;

import styles from "./styles";
class JobDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobDetails: this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails : '',
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
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.headerWarp} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('jobDetails')}</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent', }} disabled={true} />
                </Header>
                <Content style={{ backgroundColor: '#ccc' }}>
                    {
                        this.state.jobDetails.service.banner_image ? (
                            <ImageBackground source={{ uri: this.state.jobDetails.service.cover_image }} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontWeight: '700', fontSize: 18 }}>{this.state.jobDetails.service.name}</Text>
                                    <Text>{this.state.currency} {this.state.jobDetails.price}</Text>
                                </View>
                            </ImageBackground>
                        ) : (
                                <ImageBackground source={require('../../../img/bg-6.png')} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>{this.state.jobDetails.service.name}</Text>
                                        <Text>{this.state.currency} {this.state.jobDetails.price}</Text>
                                    </View>
                                </ImageBackground>
                            )
                    }

                    <Image source={require('../../../img/icon17.png')} style={{ width: win, height: (win * 0.1), marginTop: -(win * 0.1) }} />
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <Ionicons name="ios-man-outline" style={styles.jobItemIconIonicons} />
                        </View>
                        <Text style={styles.jobItemName}>{I18n.t('jobTracker')}</Text>
                        <Text style={styles.jobItemValue}>Job Requested</Text>
                    </View>
                    {
                        this.state.jobDetails.worker ? (
                            <View>
                                <View style={styles.jobItemWarp}>
                                    <View>
                                        {
                                            this.state.jobDetails.worker ? (
                                                <Image source={{ uri: this.state.jobDetails.worker.image }} style={{ height: 50, width: 50, borderRadius: 45, }} />
                                            ) : (
                                                    <Image source={require('../../../img/atul_bk.png')} style={{ height: 50, width: 50, borderRadius: 45, }} />
                                                )
                                        }

                                    </View>
                                    <View style={{ paddingLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '700' }}>Service Provider</Text>
                                        <Text style={{ fontSize: 12 }}>{this.state.jobDetails.worker.name}</Text>
                                    </View>
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('ServiceProviderDetails', { jobDetails: this.state.jobDetails })} >
                                        <Image source={require('../../../img/icon/chat-support.png')} style={{ height: 25, width: 25 }} />
                                        <Text style={{ fontSize: 12 }}>{I18n.t('chat')}/{I18n.t('call')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                                <View></View>
                            )
                    }

                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <MaterialIcons name="date-range" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>{I18n.t('dateAndTime')}</Text>
                        <Text style={[styles.jobItemValue, styles.jobItemValueDateandTime]}>{this.state.jobDetails.postedDate}</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <MaterialIcons name="location-on" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>{I18n.t('location')}</Text>
                        <Text style={styles.jobItemValue}>{this.state.jobDetails.userLocation.name}</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <SimpleLineIcons name="docs" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>{I18n.t('jobSummary')}</Text>
                        <Text style={styles.jobItemValue}>{this.state.currency} {this.state.jobDetails.price}</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <Ionicons name="ios-flag-outline" style={styles.jobItemIconIonicons} />
                        </View>
                        <Text style={styles.jobItemName}>{I18n.t('quoteOrFollow')}</Text>
                        <Text style={styles.jobItemValue}>Yes</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <MaterialIcons name="payment" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>{I18n.t('payment')}</Text>
                        <Text style={styles.jobItemValue}>1234</Text>
                    </View>
                </Content>

            </Container>
        );
    }
}

export default JobDetails;
