import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, AsyncStorage, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, BackHandler, WebView } from "react-native";
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
import api from '../../api/index';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;



class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
           url:'',
           close:''
        };
    }
    componentDidMount() {
        debugger;
       if(this.props.navigation.state.params.url && this.props.navigation.state.params.close)
       {
           this.setState({ url: this.props.navigation.state.params.url, close: this.props.navigation.state.params.close});
       }


    }
    _onNavigationStateChange(webViewState) {
        if(webViewState.url==this.state.close)
        {
            Alert.alert('Payment Successfull');
            this.props.navigation.navigate('Confirmation');
        }
    }
    
    render() {
        return (
            <Container >
             {
                 this.state.url?(
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
                       
                 ):(
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