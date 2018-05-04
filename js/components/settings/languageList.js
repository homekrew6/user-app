import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {View, StatusBar, Alert, TouchableOpacity,AsyncStorage,Text } from "react-native";
import { Container, Header, Button, Content, Item, Body, Title} from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import FSpinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from "react-navigation";
import { getAllLanguagesList } from '../accounts/elements/authActions';
import Entypo from 'react-native-vector-icons/Entypo';
class LanguageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LanguageList: [],
            visible: false,
            languageId: '',
            languageValue: ''
        }
    }

    componentDidMount() {
        this.setState({ visible: true });
        this.props.getAllLanguagesList().then((res) => {
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
            AsyncStorage.getItem("language").then((languageVal) => {
                if (languageVal) {
                    const languageValue = JSON.parse(languageVal);
                    newArray.map((item) => {
                        if (item.id == languageValue.langId) {
                            item.status = true;
                        }
                    });
                    this.setState({ LanguageList: newArray });
                    this.setState({ visible: false });
                }
                else {
                    this.setState({ LanguageList: newArray });
                    this.setState({ visible: false });
                }
            }).catch((err) => {
                this.setState({ LanguageList: newArray });
                this.setState({ visible: false });
            })

        }).catch((err) => {
            this.setState({ visible: false });
            Alert.alert(I18n.t('please_try_again_later'));
        })
    }
    selectActive(data) {
        this.setState({ languageId: data.id });
        let index;
        for (let i = 0; i < this.state.LanguageList.length; i++) {
            if (this.state.LanguageList[i].id == data.id) {
                index = i;
                break;
            }
        }
        if (index || index == 0) {
            var newArray = [];
            this.state.LanguageList.map((home) => {
                newArray.push(home);
            });
            newArray.map((item) => {
                item.status = false;
            })
            newArray[index].status = !newArray[index].status;

            this.setState({
                languageValue: newArray[index].name,
            })
            this.setState({ languageList: newArray });
        }

    }
    languageDone() {
        this.setState({ visible: true });
        let loc;
        this.state.LanguageList.map((loc1) => {
            if (loc1.status == true) {
                loc = loc1;
            }
        })
        if (loc) {
            const data = { langId: loc.id, language: loc.name, Code:loc.Code };
            AsyncStorage.setItem("language", JSON.stringify(data)).then((res) => {
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
            );
            //Alert.alert('Please select a location first.');
        }

    }
    render() {

        let languageList = (
            this.state.LanguageList.map((data, key) => (
                <TouchableOpacity key={data.id} style={[{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "#ccc", alignItems: 'center', justifyContent: 'center', padding: 15 }, [
                    data.status == true ?
                        { backgroundColor: '#ccc' } : { backgroundColor: 'white' }
                ]]} onPress={() => this.selectActive(data)}>
                    <Entypo name='language' style={{ fontSize: 20, marginRight: 8, color: '#1e3768' }} />
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
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 80 }}>
                        <Text>{I18n.t('cancel')}</Text>
                    </Button>                                        
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>{I18n.t('my_language')}</Title>
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
// LanguageList.propTypes = {
//     auth: PropTypes.object.isRequired
// };
const mapStateToProps = state => ({
    auth: state.auth
});
const mapDispatchToProps = dispatch => ({
    getAllLanguagesList: () => dispatch(getAllLanguagesList())
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageList);
