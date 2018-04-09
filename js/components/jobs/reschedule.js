import React, { Component } from 'react';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title, ActionSheet } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Calendar } from 'react-native-calendars';
import styles from './styles';
import I18n from '../../i18n/i18n';

class Reschedule extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.appHdr2} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }}>
                        <EvilIcons name="close" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('reschedule')}</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent' }} disabled={true} />
                </Header>
                <Content>
                    <View style={styles.dateWarp}>
                        <View style={styles.headerWarp}>
                            <FontAwesome name='calendar' style={styles.headerWarpTxt} />
                            <Text>{I18n.t('date')}</Text>
                        </View>
                        <Calendar
                            onDayPress={(day) => console.log(day)}
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
                                '2018-04-06': { selected: true, selectedColor: '#81cdc7' },
                                '2018-04-10': { selected: true, selectedColor: 'red' },
                            }}
                            minDate={new Date()}
                        />
                        <View style={styles.colorWarp}>
                            <View>
                                <View style={styles.colorWarpItem}>
                                    <View style={styles.colorbox}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> Block Dates</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={styles.colorbox}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> Selected Date</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={[styles.colorbox , { backgroundColor: '#ccc' }]}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> Current Date</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#fff', marginTop: 10, paddingTop: 15, paddingLeft: 5, paddingRight: 5, marginBottom: 10 }}>
                        <View style={styles.headerWarp}>
                            <FontAwesome name='clock-o' style={styles.headerWarpTxt} />
                            <Text style={{ marginBottom: 20 }}>{I18n.t('time')}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }}>
                            <View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity >
                                    <Text style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: (true ? '#81cdc7' : '#ffffff'), color: (true ? '#ffffff' : '#81cdc7'), margin: 3 }}> 10:00 am </Text>
                                </TouchableOpacity>
                                <TouchableOpacity >
                                    <Text style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: (false ? '#81cdc7' : '#ffffff'), color: (false ? '#ffffff' : '#81cdc7'), margin: 5 }}> 10:00 am </Text>
                                </TouchableOpacity>
                                <TouchableOpacity >
                                    <Text style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: (false ? '#81cdc7' : '#ffffff'), color: (false ? '#ffffff' : '#81cdc7'), margin: 3 }}> 10:00 am </Text>
                                </TouchableOpacity>
                                <TouchableOpacity >
                                    <Text style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 8, paddingLeft: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', backgroundColor: (false ? '#81cdc7' : '#ffffff'), color: (false ? '#ffffff' : '#81cdc7'), margin: 3 }}> 10:00 am </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.colorWarp, { marginTop: 15 }]}>
                            <View>
                                <View style={styles.colorWarpItem}>
                                    <View style={styles.colorbox}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> Block Dates</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={styles.colorbox}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> Selected Date</Text>
                                </View>
                                <View style={styles.colorWarpItem}>
                                    <View style={[styles.colorbox, { backgroundColor: '#ccc' }]}></View>
                                    <Text style={styles.colorTxt}><Text>*</Text> Current Date</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Reschedule;
