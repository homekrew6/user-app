import React, { Component } from "react";
import {View, StatusBar, TouchableOpacity, Text, TextInput, Alert ,Dimensions } from "react-native";
import { Container, Header, Content, Body, Title, Footer, FooterTab, Button  } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FSpinner from 'react-native-loading-spinner-overlay';
import Communications from 'react-native-communications';
import Modal from "react-native-modal";
import I18n from '../../i18n/i18n';
import api from '../../api/index';
import styles from "./styles";
import HTML from 'react-native-render-html';


class Support extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supportList: [],
            isModalVisible: false,
            findText: '',
            PhoneNumber: '',
            loader: false,
            allSupportList:[]
        }
    }

    componentDidMount(){
        let newsupportList = [];
        this.setState({ loader: true });
        api.get('Faqs').then((res) => {
            let listResponce = res;
            // console.log(res);
            listResponce.map((item)=>{
                let i = item;
                i.is_active_item = false;
                if (item.is_active){
                    newsupportList.push(i);
                }

            })
            this.setState({
                supportList: newsupportList,
                loader: false,
                allSupportList:newsupportList
            });
        }).catch((error) => {
            console.log(error);
            this.setState({ loader: false });
        })

        

        api.get('Settings').then((res) => {
            let PhoneNumber;
            PhoneNumber = res[0].phone;
            console.log(res);
            this.setState({
                PhoneNumber: PhoneNumber,
                loader: false,
            });
        }).catch((error) => {
            console.log(error);
            this.setState({ loader: false });
        })
    }

    faqFunction(key){
        let newsupportList = this.state.supportList;
        if (newsupportList[key].is_active_item == true){
            newsupportList[key].is_active_item = false;            
        }
        else{
            newsupportList.map((item1) => {
                item1.is_active_item = false;
            })
            newsupportList[key].is_active_item = true;                        
        }
        this.setState({ supportList: newsupportList });                    
    }

    callModal() {
        if (this.state.PhoneNumber){
            this.setState({ isModalVisible: !this.state.isModalVisible });            
        }
        else{
            Alert.alert(I18n.t('phone_no_not_available'));
        }
    }


    supportSearch(text){
        if(text)
        {
            const regex = new RegExp(`${text.trim()}`, 'i');

            let items = this.state.allSupportList.filter(

                item => item.title.search(regex) >= 0 || item.question.search(regex) >= 0);
            this.setState({ supportList:items});
        }
        else
        {
            const allSupportList=this.state.allSupportList;
            this.setState({supportList:allSupportList});
        }
        
    }

    render() {
        return (
            <Container >

                
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <FSpinner visible={this.state.loader} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />                

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
                    onChangeText={text => this.supportSearch(text)} />
                </View>

                <Content>
                    <View style={[this.state.supportList.length ? styles.bgWhite: '',{ marginBottom: 20 }]}>
                            {
                                this.state.supportList.length ? this.state.supportList.map((item, key)=>{
                                    return(
                                        <View style={styles.chatListWarp} key={key}>
                                            <TouchableOpacity style={styles.chatListTouchWarp} onPress={()=> this.faqFunction(key)}>
                                                <View style={styles.chatListTextWarp}>
                                                    <Text style={styles.chatListTextName}>{item.title}</Text>
                                                    <Text style={styles.chatListTextQuestion}>{item.question}</Text>
                                                </View>
                                                <View>
                                                    {
                                                        item.is_active_item ? <Ionicons name='ios-arrow-down-outline' style={styles.chatListTextIcon} /> : <Ionicons name='ios-arrow-forward-outline' style={styles.chatListTextIcon} />
                                                    }
                                                    
                                                </View>
                                            </TouchableOpacity>
                                            {
                                                item.is_active_item ? <View style={{ paddingBottom: 15 }}>
                                                    {/* <Text style={styles.chatListTime}>{item.answer}</Text> */}
                                                    <HTML html={item.answer} style={styles.chatListTime} imagesMaxWidth={Dimensions.get('window').width} />
                                                </View>: null
                                            }
                                        </View>
                                    )
                            }) : <View style={styles.noDataFound}><Text> {I18n.t('nodatafound')} </Text></View>
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
                                <Text style={[styles.numberWarp, { paddingTop: 10, paddingBottom: 10 }]}>{this.state.PhoneNumber}</Text>
                            </View>
                            <View style={styles.buttonWarp}>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })} style={styles.buttonItem}>
                                    <Text style={styles.buttonItemText}>{I18n.t('cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Communications.phonecall(this.state.PhoneNumber, true)} style={[styles.buttonItem, styles.buttonItem2]}>
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
