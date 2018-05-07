import React, { Component } from "react";
import { Image, View, StatusBar, TouchableOpacity, Text, AsyncStorage, Alert } from "react-native";
import { Container, Header, Content, Body, Title, Button } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import I18n from '../../i18n/i18n';
import styles from "./styles";
import api from '../../api';
import FSpinner from 'react-native-loading-spinner-overlay';
const icon1 = require('../../../img/chatIcon3.png');
const icon2 = require('../../../img/chatIcon1.png');
const icon3 = require('../../../img/chatIcon2.png');


class SupportLiveChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supportAgents: [],
            IsVisible: false
        }
    }



    componentDidMount() {
        this.setState({ IsVisible: true });
        AsyncStorage.getItem("userToken").then((token) => {
            if (token) {
                api.get('roleTypes?access_token=' + JSON.parse(token).id).then((roles) => {
                    api.get('Admins/getAllAgents?access_token=' + JSON.parse(token).id).then((agents) => {
                        console.log(roles);
                        let supportId;
                        roles.map((item) => {
                            if (item.name.includes('Support')) {
                                supportId = item.id;
                            }
                        });
                        if (supportId) {
                            let aggentList = [];
                            agents.response.map((item) => {
                                if (item.role == supportId) {
                                    aggentList.push(item);
                                }
                            });
                            this.setState({ supportAgents: aggentList, IsVisible: false });
                        }

                    }).catch((err1) => {
                        this.setState({ IsVisible: false });
                        Alert.alert(I18n.t('please_login'));
                    });
                }).catch((err2) => {
                    this.setState({ IsVisible: false });
                    Alert.alert(I18n.t('please_login'));
                });

            }
            else {
                this.setState({ IsVisible: false });
                Alert.alert(I18n.t('please_login'));
            }
        }).catch((err) => {
            this.setState({ IsVisible: false });
            Alert.alert(I18n.t('please_login'));
        });
    }
    render() {
        let agentsList = this.state.supportAgents.map((item, key) => {
            return (
                <TouchableOpacity key={key} style={styles.liveChatWarp} onPress={() => this.props.navigation.navigate('SupportLiveChat', {agent:item})}>
                    <View style={styles.grayCointenner}>
                        <View style={styles.ImageContnr}></View>
                        <View style={styles.textWarp}>
                            <Text style={styles.liveChartTitle}>{item.name}</Text>
                            <Text numberOfLines={1}>Hey thtre, I just want to let Hey thtre, I just want to let</Text>
                        </View>
                        <View>
                            <Text style={styles.timeWarp}>4d ago</Text>
                        </View>
                    </View>
                    <View style={styles.absoluteImageWarp}>
                        <Image source={icon1} style={styles.absoluteImage} />
                    </View>
                </TouchableOpacity>
            )
        });
        return (
            <Container >

                <StatusBar
                    backgroundColor="#81cdc7"
                />

                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" noShadow >
                    <Button transparent  style={[styles.buttonIconWarp, { backgroundColor: 'transparent' }]} disabled />
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>{I18n.t('liveChat')}</Title>
                    </Body>
                    <Button transparent style={styles.buttonIconWarp} onPress={() => this.props.navigation.goBack()}>
                        <Ionicons style={styles.headerIconClose} name='ios-close' />
                    </Button>
                </Header>

                <Content>
                    <FSpinner visible={this.state.IsVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                    {agentsList}


                </Content>
            </Container>
        );
    }
}

export default SupportLiveChatList;
