import React, { Component } from "react";
import { Image, View, StatusBar, TouchableOpacity, Text, TextInput  } from "react-native";
import { Container, Header, Content, Body, Title, Footer, FooterTab, Button  } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import I18n from '../../i18n/i18n';
import styles from "./styles";
import Modal from "react-native-modal";


class Support extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supportList: [],
            isModalVisible: false,
            findText: ''
        }
    }

    componentDidMount(){
        let newsupportList = [
            { name: 'Live Chat', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
            { name: 'Service Requester', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
            { name: 'About KREW', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
            { name: 'Account', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
            { name: 'Cancellation', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
            { name: 'Contact KREW', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
            { name: 'Service Provider', is_active: false, quotation: 'How do I make a booking?', description: "You can make a booking through the HomeKREW app, or on the web. we will collect a few personal details(like your name and phone number), and your payment information(because anything else is so old school After that, we will send a confirmation email, and if you have not already, you can download the app to access location tracking, tipping, and more! " },
        ]
        this.setState({ supportList: newsupportList });
    }

    faqFunction(key){
        let newsupportList = this.state.supportList;
        if (newsupportList[key].is_active == true){
            newsupportList[key].is_active = false;            
        }
        else{
            newsupportList.map((item1) => {
                item1.is_active = false;
            })
            newsupportList[key].is_active = true;                        
        }
        this.setState({ supportList: newsupportList });                    
    }

    callModal() {
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }

    render() {
        return (
            <Container >
                
                <StatusBar
                    backgroundColor="#81cdc7"
                />

                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" noShadow >
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={styles.buttonIconWarp}>
                        <Ionicons style={styles.headerIconClose} name='ios-arrow-back' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>{I18n.t('support')}</Title>
                    </Body>
                    <Button transparent style={styles.buttonIconWarp} disabled />
                </Header>

                <View style={styles.afterHeaderSearch}>
                    <TextInput
                        underlineColorAndroid={'white'}
                        style={styles.afterHeaderSearchInput}
                        placeholder='Search'
                        value={this.state.query}
                        onChangeText={text => this.setState({ findText: text })} />
                </View>

                <Content>
                        <View style={[styles.bgWhite,{ marginBottom: 20 }]}>
                            {
                                this.state.supportList.length ? this.state.supportList.map((item, key)=>{
                                    return(
                                        <View style={styles.chatListWarp} key={key}>
                                            <TouchableOpacity style={styles.chatListTouchWarp} onPress={()=> this.faqFunction(key)}>
                                                <View style={styles.chatListTextWarp}>
                                                    <Text style={styles.chatListTextName}>{item.name}</Text>
                                                    <Text style={styles.chatListTextQuestion}>{item.quotation}</Text>
                                                </View>
                                                <View>
                                                    {
                                                        item.is_active ? <Ionicons name='ios-arrow-down-outline' style={styles.chatListTextIcon} /> : <Ionicons name='ios-arrow-forward-outline' style={styles.chatListTextIcon} />
                                                    }
                                                    
                                                </View>
                                            </TouchableOpacity>
                                            {
                                                item.is_active ? <View style={{ paddingBottom: 15 }}>
                                                    <Text style={styles.chatListTime}>{item.description}</Text>
                                                </View>: null
                                            }
                                        </View>
                                    )
                                }): null
                            }
                        </View>
                </Content>

                <Footer style={styles.footerWarp}>
                    <FooterTab>
                        <TouchableOpacity style={[styles.footerTabStyle, { backgroundColor: '#81cdc7' }]} onPress={() => this.props.navigation.navigate('SupportLiveChatList')}>
                            <MaterialIcons name='chat-bubble-outline' style={styles.footerTabIcon} />
                            <Text style={styles.footerTabText}>{I18n.t('liveChat').toUpperCase()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.footerTabStyle, { backgroundColor: '#1e3768' }]} onPress={() => this.callModal()}>
                            <MaterialIcons name='call' style={styles.footerTabIcon} />
                            <Text style={styles.footerTabText}>{I18n.t('callUs').toUpperCase()}</Text>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>

                <Modal 
                    isVisible={this.state.isModalVisible}
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    animationOutTiming={400}
                >
                    <TouchableOpacity
                        transparent style={styles.modalWarp}
                        onPress={() => this.setState({ isModalVisible: false })}
                        activeOpacity={1}
                    >

                        <View style={styles.modalWhiteWarp}>
                            <View style={styles.textWarp}>
                                <Text style={styles.numberWarp}>0551234567</Text>
                            </View>
                            <View style={styles.buttonWarp}>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })} style={styles.buttonItem}>
                                    <Text style={styles.buttonItemText}>{I18n.t('cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.addMaterial()} style={[styles.buttonItem, styles.buttonItem2]}>
                                    <Text style={styles.buttonItemText}>{I18n.t('call')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </TouchableOpacity>
                </Modal>

            </Container>
        );
    }
}

export default Support;
