import React, { Component } from "react";
import { Image, View, StatusBar, TouchableOpacity, Text, TextInput } from "react-native";
import { Container, Header, Content, Body, Title, Footer, FooterTab, Button, List, ListItem, ListView } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import I18n from '../../i18n/i18n';
import styles from "./styles";
import api from '../../api/index';

const icon1 = require('../../../img/chatIcon3.png');
const icon2 = require('../../../img/chatIcon1.png');
const icon3 = require('../../../img/chatIcon2.png');


class NotificationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NotificationListRead: [],
            NotificationListUnread: []
        }
    }

    componentDidMount() {
        // let customerId = this.props.navigation.state.params.customerId;
        let notiDataread = [], notiDataunread = [], notiData;

        api.post('Notifications/getNotificationListByIdForCustomer', { "customerId": 19 }).then((res) => {
            notiData = res.response.message;
            notiData.map((item) => {
                let i = item
                item.IsRead ? notiDataread.push(i) : notiDataunread.push(i)
                // console.log(item);
                notiDataread.push(i);
            })
            this.setState({
                NotificationListRead: notiDataread,
                NotificationListUnread: notiDataunread
            })
            console.log(notiDataunread);
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <Container >

                <StatusBar
                    backgroundColor="#81cdc7"
                />

                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" noShadow >
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 70, justifyContent: 'flex-start' }}>
                        <Ionicons style={styles.headerIconClose} name='ios-arrow-back-outline' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>Notification</Title>
                    </Body>
                    <Button transparent style={{ width: 70 }} >
                        <Text style={{ color: '#fff' }}>Clear All</Text>
                    </Button>
                </Header>

                <Content>
                    {
                        this.state.NotificationListUnread ?
                            <View style={{ marginTop: 10, paddingLeft: 15 }}>
                                <Text>NEW</Text>
                            </View> : null
                    }
                    {
                        this.state.NotificationListUnread ?
                            this.state.NotificationListUnread.map((data) => {
                                return (
                                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 10 }}>
                                        <View style={{ borderRightWidth: 1, borderRightColor: '#ccc', width: 55, marginRight: 10 }}>
                                            <Image source={require('../../../img/icon/notificationIcon1.png')} style={{ height: 45, width: 45 }} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text>{data.title}</Text>
                                            <Text numberOfLines={1} style={{ color: '#000', fontSize: 12 }}>{data.notificationDate}</Text>
                                            <Text style={{ fontSize: 12 }}>Home</Text>
                                        </View>
                                        <View>
                                            <Text>{data.notificationType}</Text>
                                        </View>
                                    </View>

                                    

                                )
                            })
                            : null
                    }

                    

                    {
                        this.state.NotificationListUnread ?
                            <View style={{ marginTop: 10, paddingLeft: 15 }}>
                                <Text>EARLIER</Text>
                            </View> : null
                    }

                    {
                        this.state.NotificationListUnread ?
                            this.state.NotificationListUnread.map((data) => {
                                return (
                                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 10 }}>
                                        <View style={{ borderRightWidth: 1, borderRightColor: '#ccc', width: 55, marginRight: 10 }}>
                                            <Image source={require('../../../img/icon/notificationIcon1.png')} style={{ height: 45, width: 45 }} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text>{data.title}</Text>
                                            <Text numberOfLines={1} style={{ color: '#000', fontSize: 12 }}>{data.notificationDate}</Text>
                                            <Text style={{ fontSize: 12 }}>Home</Text>
                                        </View>
                                        <View>
                                            <Text>{data.notificationType}</Text>
                                        </View>
                                    </View>
                                )
                            })
                            : null
                    }

                </Content>
            </Container>
        );
    }
}

export default NotificationList;