import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from "react-navigation";
import { Image, AsyncStorage, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, BackHandler, WebView, Text } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FSpinner from 'react-native-loading-spinner-overlay';
import { Container, Header, Button, Content, Card, CardItem, Item, Frame, Input, Label,  Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import api from '../../api/index';
const paymentUrl = 'https://secure.innovatepayments.com/gateway/mobile_complete.xml';
var parseString = require('react-native-xml2js').parseString;
var xml2js = require('react-native-xml2js');
let headers = {
    'Accept': 'application/xml',
    'Content-Type': 'application/xml',
}

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;



class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            close: '',
            transCode: '',
            amount: '',
            customerId: '',
            IsData: false,
            jobDetails:''
        };
    }
    componentDidMount() {
      
        if (this.props.navigation.state.params.url && this.props.navigation.state.params.close) {
            this.setState({
                url: this.props.navigation.state.params.url, close: this.props.navigation.state.params.close, transCode: this.props.navigation.state.params.code,
                customerId: this.props.navigation.state.params.customerId, amount: this.props.navigation.state.params.amount,
                jobDetails: this.props.navigation.state.params.jobDetails
            });
        }


    }
    _onNavigationStateChange(webViewState) {
        if (webViewState.url == this.state.close) {
            if (this.state.IsData == false) {
                this.setState({ IsData: true });
                // Alert.alert('Payment Successfull');
                // this.props.navigation.navigate('Confirmation');
                var obj = {
                    store: '20217', key: 'JtLPL^pgBVG@q7PZ', complete: this.state.transCode
                };

                var builder = new xml2js.Builder({ rootName: 'mobile' });
                var xml = builder.buildObject(obj);
                const selfComponent = this;
                var IsData = false;
                fetch(paymentUrl, {
                    method: 'POST',
                    headers: headers,
                    body: xml
                }).then((res) => {
                    //console.log(res)
                    console.warn("responseFromComplete", res);
                    parseString(res._bodyInit, function (err, result) {
                        if (err) {
                            Alert.alert('Please try again later.');
                        }
                        else {

                            const toInsertData = {
                                "paymentDate": new Date(), "status": result.mobile.auth[0].status[0],
                                "message": result.mobile.auth[0].message[0],
                                "amount": selfComponent.state.amount,
                                "customerId": selfComponent.state.customerId,
                                "jobId": 0,
                                "transactionCode": result.mobile.auth[0].code[0]
                            };
                            api.post('payments', toInsertData).then((successfull) => {
                                Alert.alert('Payment successfull.');
                                selfComponent.props.navigation.dispatch( 
                                    NavigationActions.reset({
                                        index: 2,
                                        actions: [
                                          NavigationActions.navigate({ routeName: 'Menu' }),
                                          NavigationActions.navigate({ routeName: 'JobList' }),
                                          NavigationActions.navigate({ routeName: 'JobDetails', 
                                            params:  {jobDetails:selfComponent.state.jobDetails, IsPaymentDone:true} 
                                            }),
                                        ],
                                    })
                                  );
                                // selfComponent.props.navigation.navigate('JobDetails', 
                                // );
                            }).catch((paymentError) => {
                                Alert.alert('Please try again later.');
                                selfComponent.props.navigation.dispatch( 
                                    NavigationActions.reset({
                                        index: 2,
                                        actions: [
                                          NavigationActions.navigate({ routeName: 'Menu' }),
                                          NavigationActions.navigate({ routeName: 'JobList' }),
                                          NavigationActions.navigate({ routeName: 'JobDetails', 
                                            params:  {jobDetails:selfComponent.state.jobDetails, IsPaymentDone:false} 
                                            }),
                                        ],
                                    })
                                  );
                                
                            });
                        }
                    });


                }).catch((err) => {
                    console.log(err);
                    console.warn("error in completing Payment", err);
                    Alert.alert('Please try again later.');
                });
            }

        }
    }

    render() {
        return (
            <Container >
                {
                    this.state.url ? (
                        <Content>
                            <View>
                                <WebView
                                    ref="webview"
                                    source={{ uri: this.state.url }}
                                    scrollEnabled={true} automaticallyAdjustContentInsets={true}
                                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                    style={{ marginTop: 20, width: deviceWidth, height: deviceHeight }} />
                            </View>
                        </Content>

                    ) : (
                            <Content>
                                <View><Text>shdh</Text></View>
                            </Content>

                        )
                }

            </Container>
        );
    }

}


export default Payment;