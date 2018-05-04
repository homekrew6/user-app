import React, { Component } from 'react';
import { Image, View, StatusBar, Alert, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import { Container, Header, Button, Content, Text, Body, Title } from 'native-base';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Calendar } from 'react-native-calendars';
import styles from './styles';
import I18n from '../../i18n/i18n';
import Modal from "react-native-modal";
import api from '../../api';


class Reschedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colectionData: [],
            selectedDate: '',
            selectedTime: '',
            toDay: '',
            rescheduleModal: false,
            saveDateDB: '',
            jobDetails: this.props.navigation.state.params.jobDetails ? this.props.navigation.state.params.jobDetails: '',
            loader: false,
            reprice: '',
            currency: 'AED'
        }
    }

    selectTime(data){
        let newTime = this.state.colectionData;
        for (let i = 0; i < newTime.length; i++){
            newTime[i].isActive = false;
            if (data.key == newTime[i].key){
                newTime[i].isActive = true;
                this.setState({
                    selectedTime: newTime[i].time,
                })
            }
        }        
        this.setState({
            colectionData: newTime,
        })

    }

    rescheduleModalfn(){
        if (this.state.selectedDate == '' || this.state.selectedTime == '') {
            Alert.alert(I18n.t("select_date_and_time"));            
        }
        else {
            let saveDateDB = this.state.selectedDate + " " + this.state.selectedTime.slice(0, -2) + ':00' + " " + this.state.selectedTime.slice(5).toLowerCase();
            this.setState({
                saveDateDB: saveDateDB,
                loader: true,
            })
            this.pricecalculate();
        }
    }

    pricecalculate(){
        api.post('Jobs/recheduleCalculatePrice', { postingTime: this.state.jobDetails.postingTime, price: this.state.jobDetails.price, postedDate: this.state.jobDetails.postedDate }).then(res => {
            this.setState({
                loader: false,
                reprice: res.response.message,
                rescheduleModal: true
            });
            if (res.response.type!="Success")
            {
             Alert.alert(res.response.message);
            }
            
        }).catch((err) => {
            this.setState({
                loader: false
            })
        })
    }

    selectedDateFn(day){
        let newTime = this.state.colectionData;
        let d1 = new Date();
        let d2 = new Date(day.dateString);
        let same = d1 < d2;
        for (let i = 0; i < newTime.length; i++) {
            newTime[i].selectedTime = false;
            newTime[i].isActive = false; 
        }

        if (!same){
            for (let i = 0; i < newTime.length; i++) {
                newTime[i].selectedTime = true;
                if (newTime[i].key == d1.getHours()+1) {
                    break;
                }
            }
        }

        this.setState({ 
            selectedDate: day.dateString,
            colectionData: newTime
         })      
    }
    


    componentDidMount(){   

        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language })
            }
        });    

        let newTime = [
            { key: '1', time: '00:00AM',  isActive: false, selectedTime: false },
            { key: '2', time: '01:00AM',  isActive: false, selectedTime: false },
            { key: '3', time: '02:00AM',  isActive: false, selectedTime: false },
            { key: '4', time: '03:00AM',  isActive: false, selectedTime: false },
            { key: '5', time: '04:00AM',  isActive: false, selectedTime: false },
            { key: '6', time: '05:00AM',  isActive: false, selectedTime: false },
            { key: '7', time: '06:00AM',  isActive: false, selectedTime: false },
            { key: '8', time: '07:00AM',  isActive: false, selectedTime: false },
            { key: '9', time: '08:00AM',  isActive: false, selectedTime: false },
            { key: '10', time: '09:00AM', isActive: false, selectedTime: false },
            { key: '11', time: '10:00AM', isActive: false, selectedTime: false },
            { key: '12', time: '11:00AM', isActive: false, selectedTime: false },
            { key: '13', time: '12:00AM', isActive: false, selectedTime: false },
            { key: '14', time: '01:00PM', isActive: false, selectedTime: false },
            { key: '15', time: '02:00PM', isActive: false, selectedTime: false },
            { key: '16', time: '03:00PM', isActive: false, selectedTime: false },
            { key: '17', time: '04:00PM', isActive: false, selectedTime: false },
            { key: '18', time: '05:00PM', isActive: false, selectedTime: false },
            { key: '19', time: '06:00PM', isActive: false, selectedTime: false },
            { key: '20', time: '07:00PM', isActive: false, selectedTime: false },
            { key: '21', time: '08:00PM', isActive: false, selectedTime: false },
            { key: '22', time: '09:00PM', isActive: false, selectedTime: false },
            { key: '23', time: '10:00PM', isActive: false, selectedTime: false },
            { key: '24', time: '11:00PM', isActive: false, selectedTime: false }
        ],

        d = new Date();
        let mnt = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);

        this.setState({ 
            colectionData: newTime,
        })

        
    }

    reschedulefn(){
        this.setState({
            loader: true,
        })
        api.post('Jobs/recheduleJob', { serviceId: this.state.jobDetails.service.id, id: this.state.jobDetails.id, priceToCharge: this.state.reprice, postedDate: this.state.saveDateDB }).then(res => {
            this.setState({
                loader: false,
                rescheduleModal: false
            });
            if (res.response.type=="Error")
            {
                Alert.alert(res.response.message);
            }
            else
            {

                this.props.navigation.navigate('JobList')
            }
        }).catch((err) => {
            this.setState({
                loader: false,
                rescheduleModal: false
            });
            Alert.alert(I18n.t('please_try_again_later'));

        }) 
       
    }


    render() {

        return (
            <Container >
                <FSpinner visible={this.state.loader} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />                
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.appHdr2} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 50 }}>
                        <EvilIcons name="close" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('reschedule')}</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent' }} />
                </Header>
                <Content>
                    <View style={styles.dateWarp}>
                        <View style={styles.headerWarp2}>
                            <FontAwesome name='calendar' style={styles.headerWarpTxt} />
                            <Text>{I18n.t('date')}</Text>
                        </View>
                        <Calendar
                            onDayPress={(day) => this.selectedDateFn(day)}
                            monthFormat={'MMM yyyy'}
                            hideArrows={false}
                            hideExtraDays={true}
                            disableMonthChange={false}
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
                            markedDates={{
                                [this.state.selectedDate]: { selected: true, selectedColor: 'red' }
                            }}
                            minDate={new Date()}
                        />
                        <View style={styles.colorWarp}>
                            <View>
                                <View style={styles.colorWarpItem}>
                                    <View style={styles.colorbox}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> { I18n.t('currentDate') }</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={[styles.colorbox, { backgroundColor: 'red' }]}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> {I18n.t('selectedDate')}</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={[styles.colorbox , { backgroundColor: '#ccc' }]}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text>  {I18n.t('blockDates')} </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#fff', marginTop: 10, paddingTop: 15, paddingLeft: 5, paddingRight: 5, marginBottom: 10 }}>
                        <View style={styles.headerWarp2}>
                            <FontAwesome name='clock-o' style={styles.headerWarpTxt} />
                            <Text style={{ marginBottom: 20 }}>{I18n.t('time')}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', borderRadius: 4 }}>
                            <ScrollView
                            horizontal={ true }
                            showsHorizontalScrollIndicator={false}
                             style={{ paddingTop: 10, paddingBottom: 10 }}>
                                {
                                    this.state.colectionData.map((data) => {
                                        return(
                                            <TouchableOpacity key={data.key} disabled={data.selectedTime} onPress={() => this.selectTime(data)}>
                                                <Text style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: (data.isActive ? '#81cdc7' : (data.selectedTime ? '#ccc' : '#ffffff')), color: (data.isActive || data.selectedTime ? '#ffffff' : '#81cdc7'), margin: 3 }} > {data.time} </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View style={[styles.colorWarp, { marginTop: 15 }]}>
                            <View>
                                <View style={styles.colorWarpItem}>
                                    <View style={styles.colorbox}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> {I18n.t('selectedTime')}</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={[styles.colorbox, { backgroundColor: '#ccc' }]}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text>  {I18n.t('blockTime')} </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#fff', marginTop: 10, paddingTop: 15, paddingLeft: 5, paddingRight: 5, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => this.rescheduleModalfn()} style={{ backgroundColor: '#81cdc7', flex: 1, alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 4}}>
                            <Text style={{ color: '#fff', fontSize: 14 }}>{I18n.t('confirm_time_date')} </Text>
                        </TouchableOpacity>
                    </View>
                </Content>
                    <Modal isVisible={this.state.rescheduleModal}>
                        <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', justifyContent: 'center', flex:1, padding: 10, flexDirection: 'row'  }} onPress={()=> this.setState({ rescheduleModal: false })}>
                        <View style={{ backgroundColor: '#fff', flex: 1, borderRadius: 10, overflow: 'hidden' }}>
                            <View style={{ padding: 15}}>
                                    <Text style={{ width: '100%', textAlign: 'center' }}>Are you sure </Text>
                                    <Text style={{ width: '100%', textAlign: 'center', marginBottom: 20 }}>you want to Reschedule?</Text>
                                <View style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', flexDirection: 'row', padding: 10 }} >
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 14 }}>{this.state.jobDetails.service.name}</Text>
                                            <Text style={{ fontSize: 12 }}>{this.state.jobDetails.postedDate}</Text>                                        
                                        </View>
                                        <View>
                                            <Image source={require('../../../img/atul.png')}  style={{height: 40, width: 40}}/>
                                        </View>
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <Text style={{ width: '100%', textAlign: 'center', fontSize: 18, marginTop: 20 }}>New Time:</Text>
                                        <Text style={{ fontSize: 12, width: '100%', textAlign: 'center', marginBottom: 20 }}>{this.state.saveDateDB}</Text> 
                                            <Text style={{ fontSize: 12, width: '100%', textAlign: 'center' }}><Text>* </Text>Reschedule will have an</Text>
                                        <Text style={{ fontSize: 12, width: '100%', textAlign: 'center' }}>additional charge of {this.state.currency} {this.state.reprice}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }} onPress={() => this.setState({ rescheduleModal: false })}>
                                        <Text style={{ color: '#fff', fontSize: 14 }}>{I18n.t('no')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#81cdc7' }} onPress={() => this.reschedulefn()}>
                                        <Text style={{ color: '#fff', fontSize: 14 }}>{I18n.t('yes')}, {I18n.t('reschedule')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
            </Container>
        );
    }
}

export default Reschedule;
