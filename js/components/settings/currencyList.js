import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {  View, StatusBar,Alert, TouchableOpacity,  AsyncStorage,Text } from "react-native";
import { Container, Header, Button, Content, Item,Label, Body, Title} from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import FSpinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from "react-navigation";
import { getAllCurrencyList } from '../accounts/elements/authActions';

class CurrencyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyList: [],
            visible: false,
            currencyId: '',
            currencyValue: ''
        }
    }

    componentDidMount() {
        this.setState({ visible: true });
        this.props.getAllCurrencyList().then((res) => {
            let newArray = [];
            res.map((item) => {
                if (item.is_active) {
                    let data = {
                        id: item.id,
                        name: item.name,
                        status: false
                    }
                    newArray.push(item);
                }
            });
            AsyncStorage.getItem("currency").then((languageVal) => {
                if (languageVal) {
                    const languageValue = JSON.parse(languageVal);
                    newArray.map((item) => {
                        if (item.id == languageValue.langId) {
                            item.status = true;
                        }
                    });
                    this.setState({ currencyList: newArray });
                    this.setState({ visible: false });
                }
                else {
                    this.setState({ currencyList: newArray });
                    this.setState({ visible: false });
                }
            }).catch((err) => {
                this.setState({ currencyList: newArray });
                this.setState({ visible: false });
            })

        }).catch((err) => {
            this.setState({ visible: false });
            Alert.alert("Please try again later.");
        })
    }
    selectActive(data) {
        this.setState({ languageId: data.id });
        let index;
        for (let i = 0; i < this.state.currencyList.length; i++) {
            if (this.state.currencyList[i].id == data.id) {
                index = i;
                break;
            }
        }
        if (index || index == 0) {
            var newArray = [];
            this.state.currencyList.map((home) => {
                newArray.push(home);
            });
            newArray.map((item) => {
                item.status = false;
            })
            newArray[index].status = !newArray[index].status;

            this.setState({
                languageValue: newArray[index].name,
            })
            this.setState({ currencyList: newArray });
        }

    }
    languageDone() {
        this.setState({ visible: true });
        let loc;
        this.state.currencyList.map((loc1) => {
            if (loc1.status == true) {
                loc = loc1;
            }
        })
        if (loc) {
            const data = { langId: loc.id, language: loc.name };
            AsyncStorage.setItem("currency", JSON.stringify(data)).then((res) => {
                this.setState({ visible: false });
                //this.props.navigation.navigate('Settings');
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 1,
                        actions: [
                        NavigationActions.navigate({ routeName: 'Menu' }),
                        NavigationActions.navigate({ routeName: 'Settings' }),
                        ],
                    })
                );
            }).catch((err) => {
                this.setState({ visible: false });
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 1,
                        actions: [
                        NavigationActions.navigate({ routeName: 'Menu' }),
                        NavigationActions.navigate({ routeName: 'Settings' }),
                        ],
                    })
                );
            })

        }
        else {
            this.setState({ visible: false });
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 1,
                    actions: [
                    NavigationActions.navigate({ routeName: 'Menu' }),
                    NavigationActions.navigate({ routeName: 'Settings' }),
                    ],
                })
            );;
        }

    }
    render() {

        let languageList = (
            this.state.currencyList.map((data, key) => (
                <TouchableOpacity key={data.id} style={[{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "#ccc", alignItems: 'center', justifyContent: 'center', padding: 15 }, [
                    data.status == true ?
                        { backgroundColor: '#ccc' } : { backgroundColor: 'white' }
                ]]} onPress={() => this.selectActive(data)}>
                    <View style={{ flex: 1 }}>
                        <Text>{data.name}</Text>
                    </View>
                </TouchableOpacity>
            ))
        )
        return (
            <Container >
                <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <StatusBar
                    backgroundColor="#cbf0ed"
                />

                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 80, backgroundColor: 'transparent' }}><Text>{I18n.t('cancel')}</Text></Button>                    
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>My Currency</Title>
                    </Body>
                    <Button transparent onPress={() => this.languageDone()} style={{width: 80}}><Text>{I18n.t('done')}</Text></Button>
                </Header>

                <Content style={styles.bgWhite} >

                    {languageList}

                </Content>
            </Container>
        );
    }
}

// export default Expect;
// CurrencyList.propTypes = {
//     auth: PropTypes.object.isRequired
// };
const mapStateToProps = state => ({
    auth: state.auth
});
const mapDispatchToProps = dispatch => ({
    getAllCurrencyList: () => dispatch(getAllCurrencyList())
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyList);
