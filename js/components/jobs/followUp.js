import React, { Component } from 'react';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import { Footer, FooterTab, Thumbnail, Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, CardItem, Right, Card, Left, Body, Title, ActionSheet } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'; 
import FSpinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import I18n from '../../i18n/i18n';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class FollowUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'USD'
        }
    }

    componentDidMount() {

        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language })
            }
        })
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
                            <Text style={styles.text1}>Materials</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                        </View>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{this.state.currency} 60.00</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}>
                            
                        </View>
                        <View>
                            <Text style={styles.text1}>Bulb</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text2}>2</Text>
                            <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>x {this.state.currency} 50</Text>
                        </View>
                        <View style={styles.price}>
                            <Text style={[styles.priceText, { color: '#ccc' }]}>{this.state.currency} 60.00</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}></View>
                        <View>
                            <Text style={styles.text1}>Nails</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text2}>2</Text>
                            <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>x {this.state.currency} 50</Text>
                        </View>
                        <View style={styles.price}>
                            <Text style={[styles.priceText, { color: '#ccc' }]}>{this.state.currency} 100.00</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}></View>
                        <View>
                            <Text style={styles.text1}>Nails</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text2}>2</Text>
                            <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>x {this.state.currency} 50</Text>
                        </View>
                        <View style={styles.price}>
                            <Text style={[styles.priceText, { color: '#ccc' }]}>{this.state.currency} 100.00</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}>
                            <Image source={require('../../../img/icon/timer.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>Hours</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text2}>2</Text>
                            <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>x {this.state.currency} 50</Text>
                        </View>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{this.state.currency} 60.00</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View style={styles.imagesWarp}>
                            <Image source={require('../../../img/icon/calendar.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>Date</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.text2,{ fontSize: 14 }]}>Saturday, 01 July 2017, 2:00pm</Text>
                        </View>
                    </View>
                    <View style={styles.totalBillitem}>
                        <View>
                            <Image source={require('../../../img/icon/coins.png')} style={styles.totalImage} />
                        </View>
                        <View>
                            <Text style={styles.text1}>Total</Text>
                        </View>
                        <View style={{ flex: 1 }}>

                        </View>
                        <View style={styles.price}>
                            <Text style={styles.priceText}>{this.state.currency} 60.00</Text>
                        </View>
                    </View>
                </Content>
                <Footer>
                    <FooterTab>

                        <TouchableOpacity style={styles.footerTab}>
                            <Text style={styles.footerTabText}>Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.footerTab, { backgroundColor: '#fff' }]}>
                            <Text style={[styles.footerTabText, { color: '#81cdc7' } ]}>Decline</Text>
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export default FollowUp;
