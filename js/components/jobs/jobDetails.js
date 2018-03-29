import React, { Component } from "react";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground } from "react-native";
import { Container, Header, Button, Content, Form,Left,Right,Body,Title, Item,Icon,Frame, Input, Label,Text } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const win = Dimensions.get('window').width;

import styles from "./styles";
class JobDetails extends Component {
	constructor(props) {
        super(props);
				this.state = {
	      }
    }



	render() {
		return (
			<Container style={{backgroundColor:'#fff'}}>
				<StatusBar
					backgroundColor="#81cdc7"
				/>
                <Header style={styles.headerWarp} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                    <Title>Job Details</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent', }} disabled={true} />
                </Header>
                <Content style={{ backgroundColor: '#ccc' }}>
                    <ImageBackground source={require('../../../img/bg-6.png')} style={{ alignItems: 'center', justifyContent: 'flex-start', width: win, height: (win * 0.62), paddingTop: 25 }}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{ fontWeight: '700', fontSize: 18 }}>Home Cleaning</Text>
                            <Text>ARD 100</Text>
                        </View>
                    </ImageBackground>
                    <Image source={require('../../../img/icon17.png')} style={{ width: win, height: (win * 0.1), marginTop: -(win * 0.1) }}/>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <Ionicons name="ios-man-outline" style={styles.jobItemIconIonicons} />
                        </View>
                        <Text style={styles.jobItemName}>Job Tracker</Text>
                        <Text style={styles.jobItemValue}>Job Requested</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View>
                            <Image source={require('../../../img/atul_bk.png')} style={{ height: 50, width: 50, borderRadius: 45,  }}/>
                        </View>
                        <View style={{ paddingLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>Service Provider</Text>
                            <Text style={{ fontSize: 12 }}>James Harden</Text>
                        </View>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Image source={require('../../../img/icon/chat-support.png')} style={{ height: 25, width: 25 }}/>
                            <Text style={{fontSize: 12}}>Chat/Call</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <MaterialIcons name="date-range" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>Date & Time</Text>
                        <Text style={[styles.jobItemValue, styles.jobItemValueDateandTime]}>Monday, 08 May 2017, 2:00pm</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <MaterialIcons name="location-on" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>Location</Text>
                        <Text style={styles.jobItemValue}>Home</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <SimpleLineIcons name="docs" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>Job Summary</Text>
                        <Text style={styles.jobItemValue}>AED 360.00</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <Ionicons name="ios-flag-outline" style={styles.jobItemIconIonicons} />
                        </View>
                        <Text style={styles.jobItemName}>Quote/Follow</Text>
                        <Text style={styles.jobItemValue}>Yes</Text>
                    </View>
                    <View style={styles.jobItemWarp}>
                        <View style={{ width: 20 }}>
                            <MaterialIcons name="payment" style={styles.jobItemIcon} />
                        </View>
                        <Text style={styles.jobItemName}>Payment</Text>
                        <Text style={styles.jobItemValue}>1234</Text>
                    </View>
                </Content>
				
			</Container>
		);
	}
}

export default JobDetails;
