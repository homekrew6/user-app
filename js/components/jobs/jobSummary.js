import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, AsyncStorage, View, StatusBar, Alert,Text} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Header, Button, Content, Item, Body, Title } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import api from '../../api/index';

const logo_hdr = require("../../../img/logo2.png");
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
            min_charge:'',
            currencyList:[]
        };
    }
    componentDidMount() {
        api.get('Currencies').then((res)=>{
            let finalList=[];
            res.map((item)=>{
                if (item.is_active)
                {
                    finalList.push(item);
                }
            });
            this.setState({ currencyList:finalList});
            AsyncStorage.getItem("currency").then((value) => {
                if (value) {
                    const value1 = JSON.parse(value);
                    if (this.props.navigation.state.params.jobDetails && this.props.navigation.state.params.jobDetails.currencyId)
                    {
                        this.state.currencyList.map((item)=>{
                            if (item.id == this.props.navigation.state.params.jobDetails.currencyId)
                            {
                                this.setState({ currency:item.name})
                            }
                        })
                    }
                    //this.setState({ currency: value1.language })
                }
                else
                {
                    if (this.props.navigation.state.params.jobDetails && this.props.navigation.state.params.jobDetails.currencyId) {
                        this.state.currencyList.map((item) => {
                            if (item.id == this.props.navigation.state.params.jobDetails.currencyId) {
                                this.setState({ currency: item.name })
                            }
                        })
                    }
                }
            });
           
        }).catch((Err)=>{
            console.log(Err);
           
        })
       

        let jodId = this.props.navigation.state.params.jobDetails.id;
        api.post('jobSelectedQuestions/getJobSelectedAnswerList', { "id": jodId }).then((resAns) => {
           
            if (resAns.response.message.length && resAns.response.message.length > 0 && resAns.response.message[0].questionList) {
                let jsonAnswer = JSON.parse(resAns.response.message[0].questionList);
                let finalList = [];
                let totalPrice = 0;
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
                            jsonAnswer[i].rangeValue,
                            jsonAnswer[i].isSlided
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
                
                if(this.props.navigation.state.params.jobDetails.promoPrice)
                {
                    totalPrice = totalPrice - Number(this.props.navigation.state.params.jobDetails.promoPrice);
                }
                else
                {
                    totalPrice = totalPrice.toFixed(2);
                }
                let minCharge="0.0";
                if (this.props.navigation.state.params.jobDetails.service && this.props.navigation.state.params.jobDetails.service.min_charge)
                {
                    minCharge = parseFloat(this.props.navigation.state.params.jobDetails.service.min_charge).toFixed(2);
                }
                this.setState({ jsonAnswer: jsonAnswer, totalPrice: totalPrice, min_charge: minCharge });
            }
               
            api.post('jobMaterials/getJobMaterialByJobId', { "jobId": jodId }).then((materialAns) => {
                let materialList = materialAns.response.message;
                materialTotalPrice = 0;
                materialList.map((materialItem) => {
                    if (materialItem.materials) {
                        materialTotalPrice = materialTotalPrice + Number(materialItem.price);
                    }
                })
                
                
                materialTotalPrice = parseFloat(materialTotalPrice).toFixed(2);
                this.setState({
                    materialTotalPrice: materialTotalPrice,
                });
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
            }).catch(err => {
                console.log('err', err);
            });

        })


    }
    CalculatePrice(type, impact_type, price_impact, time_impact, impact_no, BoolStatus, AnsArray,start_range, rangeValue, isSlided) {
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
                if (isSlided && isSlided != 'false')
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
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 40 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}><Text>{I18n.t('jobSummary')}</Text></Title>
                    </Body>
                    <Button transparent style={{ backgroundColor: 'transparent', width: 40 }} disabled />                    
                </Header>

                <Content style={styles.bgWhite} >
                    <View style={{ flex: 1 }} >
                        {
                            this.state.jsonAnswer.length > 0 ?
                                this.state.jsonAnswer.map((AnsList, key) => {
                                    return (
                                        AnsList.type === 5 ? null : AnsList.type === 4 && AnsList.start_range == 0 ? null:
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
                                <Text style={[styles.text1, { fontSize: 12 }]}>{I18n.t('materials')}</Text>
                            </View>
                            <View style={[styles.price]}>
                                <Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]} >
                                    {this.state.currency} {(this.state.materialTotalPrice) }
                                </Text>
                            </View>
                        </View>
                       {
                           this.props.navigation.state.params.jobDetails.promoPrice?(
                                <View style={styles.totalBillitem}>
                                    <View style={styles.imagesWarp} >
                                        <Image source={logo_hdr} style={styles.totalImage} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.text1, { fontSize: 12 }]}>{I18n.t('promoPrice')}</Text>
                                    </View>
                                    <View style={[styles.price]}>
                                        <Text style={[styles.priceText, { color: '#ccc', fontSize: 12 }]} >
                                            {this.state.currency} {parseFloat(this.props.navigation.state.params.jobDetails.promoPrice).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                           ):console.log()
                       }
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
                                <Text style={styles.text1}>{I18n.t('total')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text></Text>
                            </View>
                            <View style={styles.price}>
                                <Text style={styles.priceText}>{this.state.currency} {this.state.grndtotal}</Text>
                            </View>
                        </View>

                        <View style={styles.totalBillitem}>
                            <View style={styles.imagesWarp} >
                                <Image source={totalImg} style={styles.totalImage} />
                            </View>
                            <View>
                                <Text style={styles.text1}>{I18n.t('minimum_price')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text></Text>
                            </View>
                            <View style={styles.price}>
                                <Text style={styles.priceText}>{this.state.currency} {this.state.min_charge}</Text>
                            </View>
                        </View>
                    </View>

                </Content>
            </Container >
        );
    }

}


export default jobSummary;
