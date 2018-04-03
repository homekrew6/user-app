import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground, ListView, Picker } from "react-native";
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
            jobList: []

        }
    }

    componentWillMount() {
        this.getData(this.state.status);
    }

    getData(status){
        this.setState({ visible: true });
        api.post('Jobs/getJobListingForUser', { customerId: this.state.customerId, status: status }).then((res) => {
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

    goToDetails(data)
    {
        this.props.navigation.navigate('JobDetails', {jobDetails:data});
    }

    setMenuRef = ref => {
        this.menu = ref;
    };

    jobType(data)
    {
        this.menu.hide();
        this.setState({ status: data })      
        this.getData(data);
    }

    showMenu = () => {
        this.menu.show();
    };
    

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
                            <MenuItem onPress={() =>this.jobType('ALL')}>ALL</MenuItem>
                            <MenuItem onPress={() =>this.jobType('ACCEPTED')}>ACCEPTED</MenuItem>
                            <MenuItem onPress={() =>this.jobType('STARTED')}>STARTED</MenuItem>
                            <MenuItem onPress={() =>this.jobType('DECLINED')}>DECLINED</MenuItem>
                            <MenuItem onPress={() => this.jobType('CANCELLED')}>CANCELLED</MenuItem>
                            <MenuItem onPress={() => this.jobType('COMPLETED')}>COMPLETED</MenuItem>
                        </Menu>
                    </View>
                    
                </Header>
                <Content>
                    {
                        this.state.jobList.length ? (
                            <View>
                             { this.state.jobList.map((dataQ, key) => {
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
                                                        <Text style={[styles.fontWeight700, { fontSize: 14 }]}> Tuesday </Text>
                                                        <Text style={{ fontSize: 14 }}> 10:00 AM</Text>
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
