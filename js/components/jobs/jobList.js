import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment';
import { Image, View, RefreshControl, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, ListView, Picker } from "react-native";
import { Container, Header, Button, Content, Form, Left, Right, Body, Title, Item, Icon, Frame, Input, Label, Text, List, ListItem } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import api from '../../api';
import FSpinner from 'react-native-loading-spinner-overlay';
import I18n from '../../i18n/i18n';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
const win = Dimensions.get('window').width;
const imageIcon1 = require('../../../img/icon/home.png');
import styles from "./styles";
class JobList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            visible: false,
            status: 'ALL',
            customerId: this.props.auth.data.id ? this.props.auth.data.id : '',
            jobList: [],
            refreshing: false,

        }
    }

    getLocalTimeFormat(gmtTime) {
        //const gmtToDeiveTimeObj = moment.tz(gmtTime, "Europe/London"); 
        //const timezoneDevice = DeviceInfo.getTimezone(); 
        //const gmtToDeiveTime = gmtToDeiveTimeObj.clone().tz('Asia/Kolkata').format('ddd DD-MMM-YYYY hh:mm A'); 

        let dateNow = new Date();
        var nUTC_diff = dateNow.getTimezoneOffset();
        let slicedDate = gmtTime.slice(0, -4);
        let timeToMan = Math.abs(nUTC_diff);
        let utc_check = Math.sign(nUTC_diff);
        let localTime;
        if(utc_check === 1 || utc_check === 0) {
            localTime = moment(slicedDate).subtract(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
        }else{
            localTime = moment(slicedDate).add(timeToMan, 'minutes').format('ddd DD-MMM-YYYY hh:mm A');
        }
        return localTime;
    }


    componentDidMount() {
        this.getData(this.state.status);
    }

    getData(status) {
        this.setState({ visible: true });
        api.post('Jobs/getJobListingForUser', { customerId: this.state.customerId, status: status }).then((res) => {
            res.response.message.map((item)=>{
                if(item.status=="STARTED")
                {
                    item.status="JOB POSTED";
                }
                else if (item.status == "ACCEPTED") {
                    item.status = "JOB ACCEPTED";
                }
                else if (item.status == "ONMYWAY") {
                    item.status = "KREW ON THE WAY";
                }
                else if (item.status == "JOBSTARTED") {
                    item.status = "JOB STARTED";
                }
                else if (item.status == "COMPLETED") {
                    item.status = "JOB COMPLETED";
                }
            });
            var finalList = res.response.message;
            var services = {};
            for (var i = 0; i < finalList.length; i++) {
                var serviceId = finalList[i].serviceId;
                if (!services[serviceId]) {
                    services[serviceId] = [];
                }
                services[serviceId].push(finalList[i]);
            }
            finalList = [];
            for (var groupName in services) {
                finalList.push({ group: groupName, color: services[groupName] });
            }
            finalServiceList = [];
            for (let key in finalList) {
                let data = { "serviceName": finalList[key].color[0].service.name.toUpperCase(), jobList: [] };
                for (let i = 0; i < finalList[key].color.length; i++) {
                    data.jobList.push(finalList[key].color[i]);
                }
                finalServiceList.push(data);
            }

            this.setState({ jobList: finalServiceList });
            this.setState({ visible: false });

        }).catch((err) => {
            this.setState({ visible: false });
            Alert.alert('Please try again later.');
        })
    }

    goToDetails(data) {
        this.props.navigation.navigate('JobDetails', { jobDetails: data });
    }

    setMenuRef = ref => {
        this.menu = ref;
    };

    jobType(data) {
        this.menu.hide();
        this.setState({ status: data })
        this.getData(data);
    }

    showMenu = () => {
        this.menu.show();
    };

    onRefresh(){
       this.getData(this.state.status);
    }


    render() {
        let jobListNow;
        jobListNow = (
            <Text>hi</Text>
        )
        return (

            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <Header style={styles.headerWarp} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('jobList')}</Title>
                    </Body>
                    <View>
                        <Menu
                            ref={this.setMenuRef}
                            button={
                                <Button transparent onPress={this.showMenu} style={{ width: 30 }} >
                                    <SimpleLineIcons name="options" style={{ color: '#fff' }} />
                                </Button>
                            }
                        >
                            <MenuItem onPress={() => this.jobType('ALL')}>ALL</MenuItem>
                            <MenuItem onPress={() => this.jobType('ACCEPTED')}>JOB ACCEPTED</MenuItem>
                            <MenuItem onPress={() => this.jobType('STARTED')}>JOB POSTED</MenuItem>
                            <MenuItem onPress={() => this.jobType('ONMYWAY')}>KREW ON WAY</MenuItem>
                            <MenuItem onPress={() => this.jobType('JOBSTARTED')}>JOB STARTED</MenuItem>
                            <MenuItem onPress={() => this.jobType('CANCELLED')}>CANCELLED</MenuItem>
                            <MenuItem onPress={() => this.jobType('COMPLETED')}>JOB COMPLETED</MenuItem>
                        </Menu>
                    </View>

                </Header>
                <Content  
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />}
                >
                    {
                        this.state.jobList.length ? (
                            <View>
                                {this.state.jobList.map((dataQ, key) => {
                                    return (
                                        <View key={key}>
                                            <View style={styles.dayHeading}>
                                                <Text>{dataQ.serviceName}</Text>
                                            </View>
                                            <List
                                                dataArray={dataQ.jobList}
                                                renderRow={(item) =>
                                                    <ListItem style={{ marginLeft: 0 }}>
                                                        <TouchableOpacity style={styles.listWarp} onPress={() => this.goToDetails(item)}>
                                                            <View style={styles.listWarpImageWarp}>
                                                                {
                                                                    item.service.banner_image ? (
                                                                        <Image source={{ uri: item.service.banner_image }} style={styles.listWarpImage} />
                                                                    ) : (
                                                                            <Image source={imageIcon1} style={styles.listWarpImage} />
                                                                        )
                                                                }
                                                            </View>
                                                            <View style={styles.listWarpTextWarp}>
                                                                <View style={styles.flexDirectionRow}>
                                                                    <Text>{item.service.name}</Text>
                                                                </View>
                                                                <View style={styles.flexDirectionRow}>
                                                                    <Text style={[styles.fontWeight700, { fontSize: 14 }]}> {this.getLocalTimeFormat(item.postedDate)} </Text>
                                                                    
                                                                </View>
                                                                <View style={styles.flexDirectionRow}>
                                                                    <Text>{item.userLocation.name}</Text>
                                                                </View>
                                                            </View>
                                                            <View>
                                                                <Text style={styles.listWarpPriceDown}>{item.status}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </ListItem>
                                                }
                                            />
                                        </View>
                                    )
                                })}
                            </View>
                        ) : (<View style={{ alignItems: 'center', padding: 10 }}><Text>No Data Found</Text></View>)



                    }

                </Content>

            </Container>
        );
    }
}

//export default JobList;
const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(JobList);
