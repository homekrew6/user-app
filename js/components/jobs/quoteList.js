import React, { Component } from 'react';
import { Image, View, StatusBar,Alert, AsyncStorage,Text} from 'react-native';
import { Container, Header, Button, Content, Item, CardItem, Card,  Body, Title} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FSpinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import I18n from '../../i18n/i18n';
import api from '../../api';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const buttonImage = require('../../../img/bg-button.png');
class QuoteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            quoteFollowUpList: [],
            currency: 'AED'
        };
    }
    componentDidMount() {
        this.setState({ loader: true });
        AsyncStorage.getItem("currency").then((value) => {
            if (value) {
                const value1 = JSON.parse(value);
                this.setState({ currency: value1.language });
            }
        });
        const customerId = this.props.auth.data.id ? this.props.auth.data.id : '';
        api.get('jobFollowUps').then((res) => {
            let finalList = [];
            res.map((item) => {
                if (item.customerId == customerId) {
                    finalList.push(item);
                }
            });
            this.setState({ loader: false, quoteFollowUpList: finalList });
        }).catch((err) => {
            this.setState({ loader: false });
            Alert.alert('Please try again later.');
        });
    }

    render() {
        let quoteList = this.state.quoteFollowUpList.map((item, key) => {
            return (
                <Card key={key}>
                    <CardItem>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{flex:2}}>
                                <Image source={buttonImage} style={{ width: 50, height:50 }} />
                            </View>
                            <View style={{ flex: 4 }}>
                                <Text>{item.followUpDate}</Text>
                                <Text style={{fontWeight:'bold'}}>{this.state.currency}{item.price}</Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                {
                                    item.status=='Pending'?(
                                        <Text style={{color:'green'}}>{item.status}</Text>
                                    ):item.status=='Rejected'?(
                                            <Text style={{ color: 'red' }}>{item.status}</Text>
                                    ):(
                                                <Text>{item.status}</Text>
                                    )
                                }
                                
                            </View>
                        </View>
                    </CardItem>
                </Card>
            )
          
        })
        return (
            <Container >

                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.appHdr2} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>{I18n.t('quote_follow_up')}</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent' }} />
                </Header>
                <Content>
                    <FSpinner visible={this.state.loader} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                    {
                        quoteList
                    }
                </Content>

            </Container>
        )
    }
}
// QuoteList.propTypes = {
//     auth: PropTypes.object.isRequired
// }
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuoteList);
//export default QuoteList;