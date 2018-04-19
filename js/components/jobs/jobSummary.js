import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, AsyncStorage, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, BackHandler } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FSpinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from 'react-navigation';
import { Container, Header, Button, Content, Card, CardItem, Item, Frame, Input, Label, Text, Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import api from '../../api/index';
import { navigateAndSaveCurrentScreen } from '../accounts/elements/authActions';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo_hdr = require("../../../img/logo2.png");
const carve = require("../../../img/icon17.png"); 
const totalImg = require("../../../img/icon/coins.png");
const timer = require("../../../img/icon/timer.png");


class jobSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsonAnswer: [],
            currency: 'AED',
            totalPrice: 0,
            materialTotalPrice: 0,
            hoursPrice: '0.00',
            grndtotal: 0,
        };
    }
    componentDidMount() {
        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language })
            }
        });

        // console.log(this.props);
        let jodId = this.props.navigation.state.params.jobDetails.id;
        api.post('jobSelectedQuestions/getJobSelectedAnswerList', { "id": jodId }).then((resAns) => {
           
            if (resAns.response.message.length && resAns.response.message.length > 0 && resAns.response.message[0].questionList) {
                let jsonAnswer = JSON.parse(resAns.response.message[0].questionList);
                let finalList = [];
                let totalPrice = 0;
                debugger;
                for (let i = 0; i < jsonAnswer.length; i++) {
                    if (jsonAnswer[i].type != 5) {
                        let price = this.CalculatePrice(jsonAnswer[i].type,
                            jsonAnswer[i].answers[0].option_price_impact,
                            jsonAnswer[i].answers[0].price_impact,
                            jsonAnswer[i].answers[0].time_impact,
                            jsonAnswer[i].IncrementId,
                            jsonAnswer[i].Status,
                            jsonAnswer[i].answers, 
                            jsonAnswer[i].start_range,
                            jsonAnswer[i].rangeValue
                        );
                            if(price)
                            {
                                totalPrice = totalPrice + price;
                                price = parseFloat(price).toFixed(2);
                                jsonAnswer[i].price = price;
                            }
                       
                        jsonAnswer[i].option_price_impact = jsonAnswer[i].answers[0].option_price_impact;

                        if (jsonAnswer[i].type != 3) {
                            jsonAnswer[i].priceImp = jsonAnswer[i].answers[0].price_impact;
                            jsonAnswer[i].priceImp = jsonAnswer[i].priceImp;
                        }
                        else {
                            jsonAnswer[i].answers.map((ans1) => {
                                if (ans1.selected == true) {
                                    jsonAnswer[i].priceImp = ans1.price_impact;
                                    jsonAnswer[i].priceImp = jsonAnswer[i].priceImp;
                                }
                            })
                        }
                        finalList.push(jsonAnswer[i]);
                    }

                }
                totalPrice = totalPrice.toFixed(2);
                this.setState({ jsonAnswer: jsonAnswer, totalPrice: totalPrice });
                
            }
               
            api.post('jobMaterials/getJobMaterialByJobId', { "jobId": jodId }).then((materialAns) => {
                let materialList = materialAns.response.message;
                materialTotalPrice = 0;
                debugger;
                materialList.map((materialItem) => {
                    if (materialItem.materials) {
                        materialTotalPrice = materialTotalPrice + Number(materialItem.price);
                    }
                })
                
                
                materialTotalPrice = parseFloat(materialTotalPrice).toFixed(2);
                this.setState({
                    materialTotalPrice: materialTotalPrice,
                })
                let hoursPrice='0.00';
                let grndtotal;
                if(materialList.length >0)
                {
                 hoursPrice='50.00';
                 grndtotal = Number(hoursPrice) + (
                     parseFloat(this.state.grndtotal) + 
                     parseFloat(this.state.totalPrice) + 
                     parseFloat(this.state.materialTotalPrice)
                );
                grndtotal = grndtotal.toFixed(2);
                }
                else
                {
                    grndtotal = (parseFloat(this.state.grndtotal) + parseFloat(this.state.totalPrice) + parseFloat(this.state.materialTotalPrice)).toFixed(2);
                }
                
                this.setState({
                    grndtotal: grndtotal,
                    hoursPrice:hoursPrice
                })
                console.log(materialList);
            }).catch(err => {
                console.log('err', err);
            });

        })


    }
    CalculatePrice(type, impact_type, price_impact, time_impact, impact_no, BoolStatus, AnsArray,start_range, rangeValue) {
        let retPrice;
        let totalPrice = 0;
        switch (type) {
            case 1:
            
                if (impact_type === 'Addition') {
                    //retPrice = Number(price_impact) + Number(impact_no);
                    impact_no = Number(impact_no);
                    for (let i = 1; i <= impact_no; i++) {
                        totalPrice = totalPrice + i + Number(price_impact);
                    }
                } else {
                    impact_no = Number(impact_no);
                    for (let i = 1; i <= impact_no; i++) {
                        totalPrice = totalPrice + (i * Number(price_impact));
                    }
                    //retPrice = Number(price_impact) * Number(impact_no);
                }

                //this.setState({ totalPrice: this.state.totalPrice + retPrice });

                return totalPrice;
                break;
            case 4:
                if(rangeValue)
                {
                    if (impact_type === 'Addition') {
                        impact_no = Number(impact_no);
                        totalPrice = totalPrice + start_range + Number(price_impact);
                    } else {
                        impact_no = Number(impact_no);
                        totalPrice = totalPrice + (start_range * Number(price_impact));
                    }
                    return totalPrice;
                }
            break;
            case 2:
                if (BoolStatus) {
                    retPrice = Number(price_impact);
                    return retPrice;

                } else {
                    return null;
                }
                break;
            case 3:
                AnsArray.map((ansData) => {
                    // console.log('ansData', ansData);
                    if (ansData.selected) {
                        retPrice = Number(ansData.price_impact);
                    }
                })

                //this.setState({ totalPrice: this.state.totalPrice + retPrice });

                return retPrice;
                break;

        }
    }
    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.appHdr2} androidStatusBarColor="#81cdc7" noShadow>
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>{I18n.t('jobSummary')}</Title>
                    </Body>

                </Header>

                <Content style={styles.bgWhite} >
                    <View style={{ flex: 1 }} >
                        {
                            this.state.jsonAnswer.length > 0 ?
                                this.state.jsonAnswer.map((AnsList, key) => {
                                    // console.log('AnsList', AnsList)
                                    return (
                                        AnsList.type === 5 ? null :
                                            <View key={key} style={styles.totalBillitem}>
                                                <View style={styles.imagesWarp} >
                                                    {
                                                        AnsList.image ? (
                                                            <Image source={{ uri: AnsList.image }} style={styles.totalImage} />
                                                        ) : (
                                                                <Image source={logo_hdr} style={styles.totalImage} />
                                                            )
                                                    }
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.text1, { fontSize: 12 }]}>{AnsList.name}</Text>
                                                </View>
                                                <View style={{ width: 80 }}>
                                                    {
                                                        AnsList.type === 1 ? (
                                                            <Text style={[styles.text2, { fontSize: 12 }]}>{AnsList.IncrementId}</Text>
                                                        ) : (console.log())
                                                    }
                                                    {
                                                        AnsList.priceImp ? (
                                                            AnsList.price?(
                                                            <Text style={[styles.text2, { color: '#ccc', fontSize: 12 }]}>
                                                                {AnsList.option_price_impact == 'Addition' ? '+ ' : 'x '}{this.state.currency} {(AnsList.priceImp)}
                                                            </Text>
                                                            ):
                                                           (
                                                            <Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]}>N/A</Text>
                                                           ) 
                                                        ) : (console.log())
                                                    }

                                                </View>
                                                <View style={[styles.price]}>
                                                {
                                                    AnsList.price?(
                                                        <Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]} >
                                                        {this.state.currency} {AnsList.price}
                                                        </Text> 
                                                    ):<Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]}>N/A</Text>
                                                }
                                                    
                                                </View>
                                            </View>
                                    )
                                }) : console.log()
                        }

                        <View style={styles.totalBillitem}>
                            <View style={styles.imagesWarp} >
                                <Image source={logo_hdr} style={styles.totalImage} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.text1, { fontSize: 12 }]}>Materials</Text>
                            </View>
                            <View style={[styles.price]}>
                                <Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]} >
                                    {this.state.currency} {(this.state.materialTotalPrice) }
                                </Text>
                            </View>
                        </View>

                        <View style={styles.totalBillitem}>
                            <View style={styles.imagesWarp} >
                                <Image source={timer} style={styles.totalImage} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.text1, { fontSize: 12 }]}>{I18n.t('hours')}</Text>
                            </View>
                            <View style={[styles.price]}>
                                <Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]} > {this.state.currency} {this.state.hoursPrice}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.totalBillitem}>
                            <View style={styles.imagesWarp} >
                                <Image source={totalImg} style={styles.totalImage} />
                            </View>
                            <View>
                                <Text style={styles.text1}>Total</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text></Text>
                            </View>
                            <View style={styles.price}>
                                <Text style={styles.priceText}>{this.state.currency} {this.state.grndtotal}</Text>
                            </View>
                        </View>
                    </View>

                </Content>
            </Container >
        );
    }

}


export default jobSummary;