import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDateAndTime } from './elements/serviceActions';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Card, CardItem } from "native-base";
// import ImageSlider from 'react-native-image-slider';
import styles from './styles';
import { Calendar } from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';






const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
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
            daYSelected: [date],
            weekday :[ 'Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'],
            months :['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            colectionData: [
                { key: '1', time: '9:30AM', isActive: false },
                { key: '2', time: '9:30AM', isActive: false },
                { key: '3', time: '9:30AM', isActive: false },
                { key: '4', time: '9:30AM', isActive: false },
                { key: '5', time: '9:30AM', isActive: false },
                { key: '6', time: '9:30AM', isActive: false },
                { key: '7', time: '9:30AM', isActive: false },
                { key: '8', time: '9:30AM', isActive: false }
            ],
            satDate: '',
            setTime: '',
            setWeek: '',
            serviceDetails: this.props.service.data,
        };
    }

    onDaySelect(day) {
        let d = new Date(day.dateString );
        let weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        let n = weekday[d.getDay()];
        console.log(n);
        //console.log(day);
        this.setState({ 
            daYSelected: day.dateString,
            satDate:  day.day + '-' + this.state.months[day.month - 1] + '-' + day.year,
            setWeek: n
         })
        
    }
    pressOnCircle(index) {
        let newColectionData = this.state.colectionData;

        for (var i = 0; i < (newColectionData.length); i++) {
            newColectionData[i].isActive = false;
            if (newColectionData[i].key == index) {
                newColectionData[i].isActive = true;
                this.setState({
                    setTime: newColectionData[i].time,
                })
            }

        }
        this.setState({
            colectionData: newColectionData,
        })
    }
    setDateAndTime(){
        console.log(this.props.service);
        if (this.state.satDate == ''){
            Alert.alert('Please set a Date');
        } else if (this.state.setTime == ''){
            Alert.alert('Please set a Time');
        } else {
            let data=this.state.serviceDetails;
            data.serviceTime = this.state.setWeek + ' ' + this.state.satDate + ' ' + this.state.setTime;
            this.props.setDateAndTime(data);
            this.props.navigation.navigate('Confirmation');
        }    
    }

    render() {
        return (
            <Container>
                <StatusBar
                    backgroundColor="#81cdc7" />

                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed">
                    <Button transparent >
                        <Text>Cancle</Text>
                    </Button>
                    <Body style={styles.tac}>
                        <Text style={styles.hdClr}>My Timings</Text>
                    </Body>
                    <Button transparent onPress={() => this.setDateAndTime()}>
                        <Text>Done</Text>
                    </Button>
                </Header>

                <Content>
                    <View style={{ paddingLeft: 15, paddingRight: 15, }}>
                        <Card style={{ backgroundColor: 'transparent', marginBottom: 20 }}>
                            <CardItem style={{ marginBottom: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <FontAwesome name='calendar' style={{ color: '#81cdc7', fontSize: 20, marginRight: 5 }} />
                                <Text>Date</Text>
                            </CardItem>
                            <CardItem>
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
                                />
                            </CardItem>

                            <CardItem style={{ marginTop: 2, marginBottom: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <FontAwesome name='clock-o' style={{ color: '#81cdc7', fontSize: 20, marginRight: 5 }} />
                                <Text> Time</Text>
                            </CardItem>
                            <CardItem>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <FlatList
                                        data={
                                            this.state.colectionData
                                        }
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

DateAndTime.propTypes = {
    service: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        service: state.service,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setDateAndTime: (data) => dispatch(setDateAndTime(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateAndTime);
