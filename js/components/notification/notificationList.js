import React, { Component } from "react";
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Image, View, StatusBar, TouchableOpacity, Text, TextInput, Alert, ListView } from "react-native";
import { Container, Header, Content, Body, Title, Button, List, ListItem, Icon } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import I18n from '../../i18n/i18n';
import FSpinner from 'react-native-loading-spinner-overlay';
import styles from "./styles";
import api from '../../api/index';
import EvilIcons from 'react-native-vector-icons/EvilIcons';


class NotificationList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            NotificationListRead: [],
            NotificationListUnread: [],
            loader: false
        }
    }

    componentDidMount() {
        this.notificationListData()
        
    }

    getLocalTimeFormat(gmtTime) {
        if (gmtTime) {
            let dateNow = new Date();
            var nUTC_diff = dateNow.getTimezoneOffset();
            let slicedDate = gmtTime.slice(0, -4);
            let timeToMan = Math.abs(nUTC_diff);
            let utc_check = Math.sign(nUTC_diff);
            let localTime;
            if (utc_check === 1 || utc_check === 0) {
                localTime = moment(slicedDate).subtract(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
            } else {
                localTime = moment(slicedDate).add(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
            }
            return localTime;
        } else {
            return null;
        }

    }

    notificationListData(){
        let customerId = this.props.auth.data.id ? this.props.auth.data.id : '';
        if(customerId){
        let notiDataread = [], notiDataunread = [], notiData;
        this.setState({
            loader: true,
        })
        api.post('Notifications/getNotificationListByIdForCustomer', { "customerId":  customerId }).then((res) => {
            notiData = res.response.message;
            notiData.map((item) => {
                let i = item
                item.IsRead ? notiDataread.push(i) : notiDataunread.push(i)
                // console.log(item);
            })
            this.setState({
                NotificationListRead: notiDataread,
                NotificationListUnread: notiDataunread,
                loader: false
            })
            console.log('notiData', res);
        }).catch((err) => {
            console.log(err);
            this.setState({
                loader: false
            })
        });
    }
    else{
            Alert.alert(I18n.t("please_login"));
        }
    }

    deleteNotification(data){
        this.setState({
            loader: true
        })
        console.log(data.id);
        api.delete( 'Notifications/'+ data.id  ).then((res) => {
            this.setState({
                loader: false
            })
            this.props.navigation.navigate('NotificationList');
          
        }).catch((err) => {
            console.log(err);
            this.setState({
                loader: false
            })
        });
    }
    clearAll(){
        this.setState({
            loader: true
        })
        let customerId = this.props.auth.data.id ? this.props.auth.data.id : '';        
        api.post( 'Notifications/clearAllNotificationByCustomerId', { "customerId":  customerId }  ).then((res) => {
            this.setState({
                loader: false
            })
            this.notificationListData()
        }).catch((err) => {
            console.log(err);
            this.setState({
                loader: false
            })
        });
    }

    gotoDetails(data){
        let jobDetails = {};
        jobDetails.id = data.jobId;

        if(!data.IsRead){
            this.setState({
                loader: true
            })
            api.post( 'Notifications/updateCustomerUnReadNot', { "id":  data.id }  ).then((res) => {
                this.setState({
                    loader: false
                })
                this.notificationListData();                
            }).catch((err) => {
                console.log(err);
                this.setState({
                    loader: false
                })
            });                              
        }

        if (data.notificationType == "NewPromo") {
            this.props.navigation.navigate('MyPromoCode', { id: this.props.auth.data.id });
        } else if (data.notificationType == "Welcome") {
            this.props.navigation.navigate('Menu');
        } else{
            this.props.navigation.navigate('JobDetails', { jobDetails: jobDetails });
        }

    }

    render() {
        return (
            <Container >
					<FSpinner visible={this.state.loader} textContent={"Loading..."} textStyle={{color: '#FFF'}} />                
                    <StatusBar
                        backgroundColor="#81cdc7"
                    />

                <Header style={[styles.headerMain, { alignItems: 'center' }]} androidStatusBarColor="#81cdc7" noShadow>
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 75, justifyContent: 'flex-start' }}>
                        <Ionicons style={styles.headerIconClose} name='ios-arrow-back-outline' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}><Text>{I18n.t('notification')}</Text></Title>
                    </Body>
                    <TouchableOpacity transparent style={{ width: 75 }} onPress={()=>this.clearAll()}>
                        <Text style={{ color: '#fff', alignSelf: 'center' }}>{I18n.t('clearAll')}</Text>
                    </TouchableOpacity>
                </Header>

                {
                    !(this.state.NotificationListRead.length == 0 && this.state.NotificationListUnread.length == 0) ? 

                <Content style={{ flex: 1}}>
                    {
                        this.state.NotificationListUnread.length ?
                        <View style={styles.listHeadingWarp}>
                            <Text>{I18n.t('new')}</Text>
                        </View> : null
                    }

                    {
                        this.state.NotificationListUnread.length ?
                            <List
                                dataSource={this.ds.cloneWithRows(this.state.NotificationListUnread)}
                                disableRightSwipe={true}
                                renderRow={data =>
                                <ListItem style={styles.listWarp}>
                                    <TouchableOpacity style={styles.listWarpInner} onPress={()=> this.gotoDetails(data)}>
                                         <View style={styles.listImageWarp}>
                                             <Image source={require('../../../img/icon/notificationIcon1.png')} style={styles.listImage} />
                                         </View>
                                         <View style={styles.listTextWarp}>
                                             <Text>{data.title}</Text>
                                                <Text numberOfLines={1} style={styles.listTextsecend}>{this.getLocalTimeFormat(data.notificationDate)}</Text>                                             
                                             {/* <Text numberOfLines={1} style={styles.listTextsecend}>{data.notificationDate}</Text>                                              */}
                                             {/* <Text style={styles.listTextthird}>Home</Text> */}
                                         </View>
                                         <View>
                                             <Text>{data.notificationType}</Text>
                                         </View>
                                     </TouchableOpacity>
                                </ListItem>}
                                renderLeftHiddenRow={data =>
                                <View></View>}
                                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                    <View onPress={() => this.deleteNotification(data)} style={styles.deleteWarp}>
                                        <TouchableOpacity onPress={() => this.deleteNotification(data)} style={ styles.deleteWarpInner }>
                                            <EvilIcons name="close" style={styles.deleteWarpIcon} />
                                            <Text style={styles.deleteWarpText}>DELETE</Text>
                                        </TouchableOpacity>
                                    </View>}
                                leftOpenValue={75}
                                rightOpenValue={-75}
                            />
                            : null
                    }

                    {
                        this.state.NotificationListRead.length ?
                            <View style={styles.listHeadingWarp}>
                                <Text>{I18n.t('earlier')}</Text>
                            </View> : null
                    }

                    {
                        this.state.NotificationListRead.length ?

                        <List
                            dataSource={this.ds.cloneWithRows(this.state.NotificationListRead)}
                            disableRightSwipe={true}
                            renderRow={data =>
                            <ListItem style={styles.listWarp}>
                                <TouchableOpacity style={styles.listWarpInner} onPress={()=> this.gotoDetails(data)} >
                                    <View style={styles.listImageWarp}>
                                        <Image source={require('../../../img/icon/notificationIcon1.png')} style={styles.listImage} />
                                    </View>
                                    <View style={styles.listTextWarp}>
                                        <Text>{data.title}</Text>
                                        <Text numberOfLines={1} style={styles.listTextsecend}>{this.getLocalTimeFormat(data.notificationDate)}</Text>
                                        {/* <Text numberOfLines={1} style={data.listTextsecend}>{data.notificationDate}</Text> */}
                                        {/* <Text style={styles.listTextthird}>Home</Text> */}
                                    </View>
                                    <View>
                                        <Text>{data.notificationType}</Text>
                                    </View>
                                </TouchableOpacity>
                            </ListItem>}
                            renderLeftHiddenRow={data =>
                                <View></View>}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <View onPress={() => this.deleteNotification(data)} style={styles.deleteWarp}>
                                <TouchableOpacity onPress={() => this.deleteNotification(data)} style={ styles.deleteWarpInner }>
                                    <EvilIcons name="close" style={styles.deleteWarpIcon} />
                                    <Text style={styles.deleteWarpText}>DELETE</Text>
                                </TouchableOpacity>
                            </View>}
                            leftOpenValue={75}
                            rightOpenValue={-75}
                        />: null
                    }

                </Content>
                 : <View style={[styles.noDataFound, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}><Text> {I18n.t('nodatafound')} </Text></View>
                }
            </Container>
        );
    }
}

// NotificationList.propTypes = {
//     auth: PropTypes.object.isRequired
// }
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}


// export default NotificationList;
export default connect(mapStateToProps)(NotificationList);
