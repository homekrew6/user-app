import React, { Component } from 'react';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title, ActionSheet } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FSpinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import I18n from '../../i18n/i18n';
import api from '../../api/index';
import moment from 'moment';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class FollowUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'AED',
            IsVisible: false,
            materialsList: [],
            followUpDetails: '',
            totolePrice: '0.0',
            materialTotalPrice:'0.0'
        }
    }

    componentDidMount() {
        this.setState({ IsVisible: true });
        const jobId = this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails.id : '';
        api.post("jobMaterials/getJobMaterialByJobId", { "jobId": jobId }).then((addedList) => {
            if (addedList.type != "Error") {
                let addedItemsList = [];
                addedList.response.message.map((item) => {
                    let item1 = { id: item.id, name: item.materials ? item.materials.name : '', price: item.price, image: item.materials ? (item.materials.image ? item.materials.image : '') : '', count: item.count, actualPrice: item.materials ? item.materials.price : '' };
                    addedItemsList.push(item1);
                });
                if (addedItemsList.length > 0) {
                    let totalPrice = 0;
                    addedItemsList.map((item) => {
                        totalPrice = totalPrice + Number(item.price);
                    });
                    let totalPrice1=0;
                    totalPrice1=totalPrice+50;
                    totalPrice1 = totalPrice1.toFixed(2);
                    totalPrice = totalPrice.toFixed(2);
                    api.get('jobFollowUps').then((followupDetailsRes) => {
                        let followUpDetails;
                        followupDetailsRes.map((item) => {
                            if (item.jobId == jobId) {
                                followUpDetails = item;
                            }
                        });
                        if (followUpDetails && followUpDetails.followUpDate)
                        {
                            followUpDetails.followUpDate = this.getLocalTimeFormat(followUpDetails.followUpDate);
                        }
                        this.setState({ IsVisible: false, materialsList: addedItemsList, materialTotalPrice: totalPrice, followUpDetails: followUpDetails ? followUpDetails : '', totolePrice: totalPrice1});
                    }).catch((err2) => {
                        this.setState({ IsVisible: false, materialsList: addedItemsList });
                    });

                }
                else {
                    this.setState({ IsVisible: false });
                }

            }
        }).catch((err) => {
            this.setState({ loader: false });
        })
        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language })
            }
        })
    }

    getLocalTimeFormat(gmtTime) {
        

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
    }
    accept()
    {
        let jobDetails;
        jobDetails = this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails:'';
        if(jobDetails && jobDetails.worker && this.state.followUpDetails)
        {
            this.setState({ IsVisible: true });
            let updatePrice=Number(jobDetails.price);
            updatePrice=updatePrice+Number(this.state.totolePrice);
            updatePrice=updatePrice.toFixed(2);
            const toSendData = { id: this.state.followUpDetails.id, jobId: jobDetails.id, price: updatePrice, followupDate: this.state.followUpDetails.followUpDate, deviceToken:jobDetails.worker.deviceToken, workerId:jobDetails.worker.id   };
            api.post('jobFollowUps/acceptFollowUp',toSendData).then((res)=>{
                Alert.alert(res.response.message);
                this.setState({ IsVisible: false });
            }).catch((Err)=>{
                this.setState({})
            })

        }
       
    }
    decline() {
        let jobDetails;
        jobDetails = this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails : '';
        if (jobDetails && jobDetails.worker && this.state.followUpDetails) {
            this.setState({ IsVisible: true });
            let updatePrice = Number(jobDetails.price);
            updatePrice = updatePrice + Number(this.state.totolePrice);
            updatePrice = updatePrice.toFixed(2);
            const toSendData = { id: this.state.followUpDetails.id, jobId: jobDetails.id, price: updatePrice, followupDate: this.state.followUpDetails.followUpDate, deviceToken: jobDetails.worker.deviceToken, workerId: jobDetails.worker.id };
            api.post('jobFollowUps/declineFollowUp', toSendData).then((res) => {
                Alert.alert(res.response.message);
                this.setState({ IsVisible: false });
            }).catch((Err) => {
                this.setState({})
            })

        }
    }
    render() {
        let materialsList=this.state.materialsList.map((item, key)=>{
            return(
                <View style={styles.totalBillitem} key={key}>
                    <View style={styles.imagesWarp}>

                    </View>
                    <View>
                        <Text style={styles.text1}>{item.name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.text2}>{item.count}</Text>
                        <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>x {this.state.currency}{item.actualPrice}</Text>
                    </View>
                    <View style={styles.price}>
                        <Text style={[styles.priceText, { color: '#ccc' }]}>{this.state.currency} {item.price}</Text>
                    </View>
                </View>
            )
        });
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <FSpinner visible={this.state.IsVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
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
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}>
                            <Image source={require('../../../img/icon/shopping-cart.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>{I18n.t('materials')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                        </View>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{this.state.currency}{this.state.materialTotalPrice}</Text>
                        </View>
                    </View>
                   {
                       materialsList
                   }
                  
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}>
                            <Image source={require('../../../img/icon/timer.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>{I18n.t('hours')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text2}>{this.state.followUpDetails.hours}</Text>
                            <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>x {this.state.currency} 50</Text>
                        </View>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{this.state.currency} 50.00</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}>
                            <Image source={require('../../../img/icon/calendar.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>{I18n.t('date')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.text2, { fontSize: 14 }]}>{this.state.followUpDetails.followUpDate}</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View>
                            <Image source={require('../../../img/icon/coins.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>{I18n.t('total')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>

                        </View>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{this.state.currency} {this.state.totolePrice}</Text>
                        </View>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>

                        <TouchableOpacity style={styles.footerTab} onPress={() => this.accept()}>
                            <Text style={styles.footerTabText}>{I18n.t('accept')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.footerTab, { backgroundColor: '#fff' }]} onPress={() => this.decline()}>
                            <Text style={[styles.footerTabText, { color: '#81cdc7' }]}>{I18n.t('decline')}</Text>
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export default FollowUp;
