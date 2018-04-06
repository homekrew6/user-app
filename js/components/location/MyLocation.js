import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Button, Content, Body, Item, Frame, Input, Label } from 'native-base';
import LocationList from './LocationList';
import { navigateAndSaveCurrentScreen } from '../accounts/elements/authActions';
import api from '../../api';
import I18n from '../../i18n/i18n';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

class MyLocation extends Component {
    state = { locationData: '' };
    componentDidMount() {
        const customerId = this.props.auth.data.id;
        const getLocationUrl = `user-locations?filter={"where":{"customerId":${customerId}}}`
        api.get(getLocationUrl).then(res => {
            this.setState({ locationData: res });
        }).catch((err) => {
            console.log(err);
        });
        // const data = this.props.auth.data;
        // data.activeScreen = "MyLocation";
        // data.previousScreen = "Menu";
        // this.props.navigateAndSaveCurrentScreen(data);
    }
    goToMyMap() {
        const data = this.props.auth.data;
        data.activeScreen = "MyMap";
        data.previousScreen = "MyLocation";
        this.props.navigateAndSaveCurrentScreen(data);
        this.props.navigation.navigate('MyMap', { screenType: 'add', customerId: this.props.auth.data.id });
    }
    goBack() {
        const data = this.props.auth.data;
        data.activeScreen = "Menu";
        data.previousScreen = "";
        this.props.navigateAndSaveCurrentScreen(data);
        this.props.navigation.navigate('Menu');
    }

    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#cbf0ed"
                />
                <Content>
                    <Header style={styleSelf.appHdr2} androidStatusBarColor="#cbf0ed">
                        <Button transparent >
                            <TouchableOpacity onPress={() => this.goToMyMap()}>
                                <Text style={styleSelf.backBt} >{I18n.t('add')}</Text>
                            </TouchableOpacity>
                        </Button>
                        <Body style={styleSelf.tac}>
                            <Text style={styleSelf.hdClr}>{I18n.t('my_location')}</Text>
                        </Body>
                        <Button transparent onPress={() => this.goBack()} >
                            <Text style={styleSelf.backBt} >{I18n.t('done')}</Text>
                        </Button>
                    </Header>
                    <ScrollView>
                        <View>
                            {this.state.locationData.length && this.state.locationData.length>0 ?
                                this.state.locationData.map((lData, key) => {
                                    let Self = this.props;
                                    return (
                                        <LocationList
                                            listName={lData.name}
                                            key={key}
                                            buildingName={lData.buildingName}
                                            landmark={lData.landmark}
                                            latitude={lData.latitude}
                                            longitude={lData.longitude}
                                            villa={lData.villa}
                                            listId={lData.id}
                                            customerId={this.props.auth.data.id}
                                            Self={Self}
                                            uid={lData.id}
                                        />
                                    )
                                }) : <View style={{ alignItems: 'center', padding: 10 }}><Text>No records found.</Text></View>
                            }
                        </View>
                    </ScrollView>

                </Content>
            </Container>
        );
    }
}


styleSelf = {
    TimingText: {
        fontSize: 20,
    },
    TimingContainer: {
        width: 50,
        height: 60,
        justifyContent: 'center',
    },
    TimingContainerFirst: {
        width: 50,
        height: 60,
        justifyContent: 'center'
    },
    hdClr: {
        color: '#1e3768',
        fontSize: 22
    },
    appHdr2: {
        backgroundColor: '#cbf0ed',
    },
    backBt: {
        fontSize: 16,
        color: "#71beb8"
    },
    tac: {
        alignItems: 'center'
    },
    menuCardIcon: {
        height: 30,
        width: 30
    },
}

const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});

const mapDispatchToProps = dispatch => ({
    navigateAndSaveCurrentScreen: (data) => dispatch(navigateAndSaveCurrentScreen(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyLocation);
