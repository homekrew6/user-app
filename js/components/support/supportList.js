import React, { Component } from "react";
import { View, StatusBar, TouchableOpacity, Text, TextInput, Alert, Dimensions, AsyncStorage } from "react-native";
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
            allSupportList:[],
            IsListDisabled:false
        }
    }

    componentDidMount(){
        let newsupportList = [];
        this.setState({ loader: true });
        api.get('Faqs').then((res) => {
            let listResponce = res;
            // console.log(res);
            AsyncStorage.getItem("language").then((languageVal) => {

            let answer = 'answer', question = 'question', title = 'title';
            const languageValue = JSON.parse(languageVal);
            const languageCode = languageValue.Code;
            if (languageCode == 'fr') {
                listResponce.map((item) => {
                    let i = item;
                    item.titleSelected = item.fr_title;
                    item.answerSelected = item.fr_answer;
                    item.questionselected = item.fr_question;
                    i.is_active_item = false;
                    if (item.is_active) {
                        newsupportList.push(i);
                    }

                })
            } else if (languageCode == 'ar'){
                listResponce.map((item) => {
                    let i = item;
                    item.titleSelected = item.ar_title;
                    item.answerSelected = item.ar_answer;
                    item.questionselected = item.ar_question;
                    i.is_active_item = false;
                    if (item.is_active) {
                        newsupportList.push(i);
                    }

                })
            }
            else{
                listResponce.map((item) => {
                    let i = item;
                    item.titleSelected = item.title;
                    item.answerSelected = item.answer;
                    item.questionselected = item.question;
                    i.is_active_item = false;
                    if (item.is_active) {
                        newsupportList.push(i);
                    }

                })
            }
            this.setState({
                supportList: newsupportList,
                loader: false,
                allSupportList:newsupportList
            });
        }).catch((err) => {
        })
        }).catch((error) => {
            this.setState({ loader: false });
        })

        

        api.get('Settings').then((res) => {
            let PhoneNumber;
            PhoneNumber = res[0].phone;
            this.setState({
                PhoneNumber: PhoneNumber,
                loader: false,
            });
        }).catch((error) => {
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
GoToList()
{
    this.setState({ IsListDisabled: true });

    setTimeout(() => {
        this.setState({ IsListDisabled: false });
    }, 3000);
    this.props.navigation.navigate('SupportLiveChatList');
}
    render() {
        return (
            <Container >

                
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <FSpinner visible={this.state.loader} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />                

                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" noShadow >
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={[styles.buttonIconWarp, { width: 40 }]}>
                        <Ionicons style={styles.headerIconClose} name='ios-arrow-back' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}><Text>{I18n.t('support')}</Text></Title>
                    </Body>
                    <Button transparent style={[styles.buttonIconWarp, { width: 40 }]} disabled />
                </Header>

                <View style={styles.afterHeaderSearch}>
                    <TextInput
                        underlineColorAndroid={'white'}
                        style={styles.afterHeaderSearchInput}
                    placeholder='Search'
                        value={this.state.query}
                    onChangeText={text => this.supportSearch(text)} />
                </View>
                {
                    this.state.supportList.length ?
                <Content>
                    <View style={[this.state.supportList.length ? styles.bgWhite: '',{ marginBottom: 20 }]}>
                    {
                             this.state.supportList.map((item, key)=>{
                                        let ttl = this.state.title;
                                    return(
                                        <View style={styles.chatListWarp} key={key}>
                                            <TouchableOpacity style={styles.chatListTouchWarp} onPress={()=> this.faqFunction(key)}>
                                                <View style={styles.chatListTextWarp}>
                                                    <Text style={styles.chatListTextName}>{item.titleSelected}</Text>
                                                    <Text style={styles.chatListTextQuestion}>{item.questionselected}</Text>
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
                                                    <HTML html={item.answerSelected} style={styles.chatListTime} imagesMaxWidth={Dimensions.get('window').width} />
                                                </View>: null
                                            }
                                        </View>
                                    )
                            }) 
                            }
                        </View>
                </Content>
                : <View style={[styles.noDataFound, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}><Text> {I18n.t('nodatafound')} </Text></View>
                }
                <Footer style={styles.footerWarp}>
                    <FooterTab>
                        <TouchableOpacity style={[styles.footerTabStyle, { backgroundColor: '#81cdc7' }]} disabled={this.state.IsListDisabled} onPress={() => this.GoToList()}>
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
