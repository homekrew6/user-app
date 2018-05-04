import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { setDateAndTime, setServiceDetails, checkIfThePostingDateIsValid } from './elements/serviceActions';
import { Image, View, StatusBar, Alert, TouchableOpacity, FlatList, ScrollView, AsyncStorage,Text } from "react-native";
import { Container, Header, Button, Content,Item, Body, Card, CardItem } from "native-base";
import styles from './styles';
import { Calendar } from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import I18n from '../../i18n/i18n';
import api from '../../api/index';
import FSpinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from "react-navigation";

const img1 = require('../../../img/splash-bg2.png');
const launchscreenBg = require("../../../img/bg-login.png");

class DateAndTime extends Component {
    constructor(props) {
        super(props);
        let today = new Date();
        let dy = parseInt(today.getMonth() + 1);
        let dm = today.getDate();
        if (dy < 10) {
            dy = '0' + dy;
        }
        if (dm < 10) {
            dm = '0' + dm;
        }

        date = today.getFullYear() + "-" + dy + "-" + dm;
        this.state = {
            daYSelected: '',
            minDate: [today],
            weekday: ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            colectionData: [
                { key: '1', time: '00:00AM', isActive: false },
                { key: '2', time: '01:00AM', isActive: false },
                { key: '3', time: '02:00AM', isActive: false },
                { key: '4', time: '03:00AM', isActive: false },
                { key: '5', time: '04:00AM', isActive: false },
                { key: '6', time: '05:00AM', isActive: false },
                { key: '7', time: '06:00AM', isActive: false },
                { key: '8', time: '07:00AM', isActive: false },
                { key: '9', time: '08:00AM', isActive: false },
                { key: '10', time: '09:00AM', isActive: false },
                { key: '11', time: '10:00AM', isActive: false },
                { key: '12', time: '11:00AM', isActive: false },
                { key: '13', time: '12:00AM', isActive: false },
                { key: '14', time: '01:00PM', isActive: false },
                { key: '15', time: '02:00PM', isActive: false },
                { key: '16', time: '03:00PM', isActive: false },
                { key: '17', time: '04:00PM', isActive: false },
                { key: '18', time: '05:00PM', isActive: false },
                { key: '19', time: '06:00PM', isActive: false },
                { key: '20', time: '07:00PM', isActive: false },
                { key: '21', time: '08:00PM', isActive: false },
                { key: '22', time: '09:00PM', isActive: false },
                { key: '23', time: '10:00PM', isActive: false },
                { key: '24', time: '11:00PM', isActive: false }
            ],
            satDate: '',
            setTime: '',
            setWeek: '',
            serviceDetails: this.props.service.data,
            selectedDate: '',
            selectedTimeID: '',
            IsSpinnerVisible: false,
            settings: 2
        };
    }

    componentWillMount() {

        let newColectionData = this.state.colectionData;
        let newIndex = this.props.service.data.selectedTimeID;
        let sltdt = this.props.service.data.selectedDate;
        if (sltdt) {
            this.onDaySelect(sltdt);
        }
        if (newIndex) {
            this.pressOnCircle(newIndex);
        }
    }

    onDaySelect(day) {
        let d = new Date(day.dateString);
        let weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        let n = weekday[d.getDay()];
        this.setState({
            daYSelected: day.dateString,
            satDate: day.day + '-' + this.state.months[day.month - 1] + '-' + day.year,
            setWeek: n,
        })

        let data = this.props.service.data;
        data.selectedDate = day;
        this.props.setServiceDetails(data);

    }
    pressOnCircle(index) {
        let newColectionData = this.state.colectionData;
        let selectedTimeId;
        for (var i = 0; i < (newColectionData.length); i++) {
            newColectionData[i].isActive = false;
            if (newColectionData[i].key == index) {
                newColectionData[i].isActive = true;
                selectedTimeId = newColectionData[i].key;
                this.setState({
                    setTime: newColectionData[i].time,
                    selectedTimeID: newColectionData[i].key,
                })
            }

        }


        this.setState({
            colectionData: newColectionData,
        })
        let data = this.props.service.data;
        //data.selectedTimeID = this.state.selectedTimeID;
        data.selectedTimeID = selectedTimeId;
        this.props.setServiceDetails(data);
    }
    navigate() {
        // const data = this.props.auth.data;
        // data.activeScreen = 'Confirmation';
        // data.previousScreen = "ServiceDetails";
        // this.props.navigateAndSaveCurrentScreen(data);
        //this.props.navigation.navigate('Confirmation');

        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 3,
                actions: [
                NavigationActions.navigate({ routeName: 'Menu' }),
                NavigationActions.navigate({ routeName: 'Category' }),
                NavigationActions.navigate({ routeName: 'ServiceDetails' }),
                NavigationActions.navigate({ routeName: 'Confirmation' }),
                ],
            })
        );
    }
    componentDidMount() {
        api.get("Settings").then((res) => {
            if(res.length && res.length>0)
            {
                this.setState({ settings: res[0].minimumPostingDiff });
            }
        }).catch((err) => {

        })
    }
    setDateAndTime() {
        let saveDBTime = this.state.setTime.slice(0, -5) + " " + this.state.setTime.slice(5).toLowerCase();
        const saveDateDB = this.state.daYSelected + " " + this.state.setTime.slice(0, -2) + ':00' + " " + this.state.setTime.slice(5).toLowerCase();
        
        let dateDay = moment(this.state.daYSelected).format('ddd, DD MMM YYYY');
        let dateTime = this.state.setTime.slice(0, -2) + ':00' + " " + this.state.setTime.slice(5).toLowerCase();

        let dateFinal = dateDay + " " + dateTime;

        var timeNow = new Date();
        var now = moment(timeNow);
        var cus_post_time = moment(dateFinal);
        let duration;
        duration = moment.duration(now.diff(cus_post_time)).as('hour');
        checkPosNeg = Math.sign(duration);
        let durPosHour = Math.abs(duration);

        if(checkPosNeg === 1 || checkPosNeg === 0){
            Alert.alert(I18n.t("you_cannot_set_back"));
        } else{
            if (durPosHour > this.state.settings) {
                let zeroPos = saveDBTime.search("0");
                if (zeroPos >= 0) {
                    if (this.state.setTime === "10:00AM" || this.state.setTime === "10:00PM") {
                        saveDBTime = saveDBTime;
                    } else {
                        saveDBTime = saveDBTime.slice(1);
                    }
                } else {
                    saveDBTime = saveDBTime
                }
                let saveDbDay = this.state.setWeek;
                //const saveDateDB = this.state.daYSelected + " " + this.state.setTime.slice(0, -2) + ':00';

                if (this.state.satDate == '') {
                    Alert.alert(I18n.t("please_set_date"));
                } else if (this.state.setTime == '') {
                    Alert.alert(I18n.t("please_set_time"));
                } else {
                    this.setState({ IsSpinnerVisible: true });
                    data = { serviceId: this.props.service.data.id, saveDbDay: saveDbDay, saveDBTime: saveDBTime }
                    this.props.checkIfThePostingDateIsValid(data).then((response) => {
                        this.setState({ IsSpinnerVisible: false });
                        if (response.response.type == "Error") {
                            Alert.alert(response.response.message);
                        }
                        else {
                            let data = this.state.serviceDetails;
                            data.serviceTime = this.state.setWeek + ' ' + this.state.satDate + ' ' + this.state.setTime;
                            data.saveDateDB = saveDateDB;
                            data.saveDBTime = saveDBTime;
                            data.saveDbDay = saveDbDay;
                            this.props.setDateAndTime(data);
                            this.navigate();
                        }

                    }).catch((error) => {
                        this.setState({ IsSpinnerVisible: false });
                    })
                }
            } else {
                Alert.alert('Please post the job at least ' + this.state.settings + ' hours ago ')
            }
        }

    }

    render() {
        return (
            <Container>
                <StatusBar
                    backgroundColor="#81cdc7" />
                <FSpinner visible={this.state.IsSpinnerVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed">
                    <Button transparent onPress={() => this.props.navigation.navigate('Confirmation')}>
                        <Text>{I18n.t('cancel')}</Text>
                    </Button>
                    <Body style={styles.tac}>
                        <Text style={styles.hdClr}>{I18n.t('my_timings')}</Text>
                    </Body>
                    <Button transparent onPress={() => this.setDateAndTime()}>
                        <Text>{I18n.t('done')}</Text>
                    </Button>
                </Header>

                <Content>
                    <View style={{ paddingLeft: 15, paddingRight: 15, }}>
                        <Card style={{ backgroundColor: 'transparent', marginBottom: 20 }}>
                            <CardItem style={{ marginBottom: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <FontAwesome name='calendar' style={{ color: '#81cdc7', fontSize: 20, marginRight: 5 }} />
                                <Text>{I18n.t('date')}</Text>
                            </CardItem>
                            <CardItem style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar
                                    onDayPress={(day) => this.onDaySelect(day)}
                                    monthFormat={'MMM yyyy'}
                                    hideArrows={false}
                                    hideExtraDays={true}
                                    disableMonthChange={false}
                                    markedDates={{
                                        [this.state.daYSelected]: { selected: true, selectedColor: '#81cdc7' }
                                    }}
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        textSectionTitleColor: '#2d4150',
                                        selectedDayBackgroundColor: '#2d4150',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#81cdc7',
                                        dayTextColor: '#2d4150',
                                        weekTextColor: '#000',
                                        textDisabledColor: '#ccc',
                                        arrowColor: '#81cdc7',
                                        textDayFontSize: 14,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 16,

                                    }}
                                    minDate={this.state.minDate}
                                />
                            </CardItem>

                            <CardItem style={{ marginTop: 2, marginBottom: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <FontAwesome name='clock-o' style={{ color: '#81cdc7', fontSize: 20, marginRight: 5 }} />
                                <Text> {I18n.t('time')}</Text>
                            </CardItem>

                            <CardItem>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <FlatList
                                        data={this.state.colectionData}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity onPress={() => this.pressOnCircle(item.key)} id={item.key} >
                                                <Text style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: (item.isActive ? '#81cdc7' : '#ffffff'), color: (item.isActive ? '#ffffff' : '#81cdc7'), marginRight: 5 }}>
                                                    {item.time}
                                                </Text>
                                            </TouchableOpacity>
                                        }
                                        style={{ paddingTop: 10, paddingBottom: 10 }}
                                        horizontal={true}
                                    />
                                </View>
                            </CardItem>

                        </Card>
                    </View>
                </Content>
            </Container>

        );
    }
}

// DateAndTime.propTypes = {
//     service: PropTypes.object.isRequired,
//     auth: PropTypes.object.isRequired
// }

const mapStateToProps = (state) => {
    return {
        service: state.service,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setDateAndTime: (data) => dispatch(setDateAndTime(data)),
        setServiceDetails: (data) => dispatch(setServiceDetails(data)),
        checkIfThePostingDateIsValid: (data) => dispatch(checkIfThePostingDateIsValid(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateAndTime);