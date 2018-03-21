import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Footer, FooterTab } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';
import api from '../../api';
import { setServiceDetails } from './elements/serviceActions';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class LocationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: [false, false],
            homeArray: [
                {
                    "text": "Home",
                    "id": 1,
                    "status": true,
                    "latitude": '',
                    "longitude": '',
                    "buildingName": '',
                    "villa": '',
                    "landmark": ''
                },
                {
                    "text": "Mother Home",
                    "id": 2,
                    "status": false,
                    "latitude": '',
                    "longitude": '',
                    "buildingName": '',
                    "villa": '',
                    "landmark": ''
                }
            ],
            homeValue: 'Home',
            serviceDetails: this.props.service.data,

        }
    }

    componentDidMount(){
        const customerId = this.props.auth.data.id;
        const getLocationUrl = `user-locations?filter={"where":{"customerId":${customerId}}}`
        api.get(getLocationUrl).then(res => {
            console.log('user-locations', res);
            let finalArray=[];
            res.map((item)=>{
                let data;
                if(this.props.service.data.serviceLocation)
                {
                    if(this.props.service.data.serviceLocation===item.name)
                    {
                        data={
                            "text": item.name,
                            "id": item.id,
                            "status": true,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "buildingName": item.buildingName,
                            "villa": item.villa,
                            "landmark": item.landmark
                        }
                    }
                    else
                    {
                        data={
                            "text": item.name,
                            "id": item.id,
                            "status": false,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "buildingName": item.buildingName,
                            "villa": item.villa,
                            "landmark": item.landmark
                        }
                    }
                }
                else{
                    data={
                        "text": item.name,
                        "id": item.id,
                        "status": false,
                        "latitude": item.latitude,
                        "longitude": item.longitude,
                        "buildingName": item.buildingName,
                        "villa": item.villa,
                        "landmark": item.landmark
                    }
                }
                 
                finalArray.push(data);
            })
            this.setState({ homeArray: finalArray });
        }).catch((err) => {
            console.log(err);
        });
    }
    selectActive(data) {
        let index;
        for (let i = 0; i < this.state.homeArray.length; i++) {
            if (this.state.homeArray[i].id == data.id) {
                index = i;
                break;
            }
        }
        if (index || index == 0) {
            var newArray = [];
            this.state.homeArray.map((home) => {
                newArray.push(home);
            });
            newArray.map((item) => {
                item.status = false;
            })
            newArray[index].status = !newArray[index].status;

            this.setState({
                homeValue: newArray[index].text,
            })
            this.setState({ homeArray: newArray });
        }

    }
    locationDone() {
        let loc;
        this.state.homeArray.map((loc1) => {
            if (loc1.status == true) {
                loc = loc1.text;
            }
        })
        if (loc) {
            let data = this.state.serviceDetails;
            // data.serviceLocation = this.state.homeArray;
            data.serviceLocation = loc;
            this.props.setServiceDetails(data);
            this.props.navigation.navigate('Confirmation');
        }

    }

    render() {

        let featureList = (
            this.state.homeArray.map((data, key) => (
                <TouchableOpacity key={data.id} style={[{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: "#ccc", alignItems: 'center', justifyContent: 'center', padding: 15 }, [
                    data.status == true ?
                        { backgroundColor: '#ccc' } : { backgroundColor: 'white' }
                ]]} onPress={() => this.selectActive(data)}>
                    <SimpleLineIcons name='location-pin' style={{ fontSize: 20, marginRight: 8, color: '#1e3768' }} />
                    <View style={{ flex: 1 }}>
                        <Text>{data.text}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('MyMap', {
                        screenType: 'edit',
                        id: data.id,
                        customerId: this.props.auth.data.id,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        name: data.text,
                        buildingName: data.buildingName,
                        villaNo: data.villa,
                        landmark: data.landmark
                        })} >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            ))
        )
        return (
            <Container >

                <StatusBar
                    backgroundColor="#cbf0ed"
                />

                <Header style={styles.appHdr2} androidStatusBarColor="#cbf0ed" noShadow>
                    <Button transparent onPress={() => this.props.navigation.navigate('MyMap', {screenType: 'add', customerId: this.props.auth.data.id})} >
                        <Text>Add</Text>
                    </Button>
                    <Body style={{ alignItems: 'center' }}>
                        <Title style={styles.appHdr2Txt}>My Location</Title>
                    </Body>
                    <Button transparent onPress={() => this.locationDone()}><Text>Done</Text></Button>
                </Header>

                <Content style={styles.bgWhite} >

                    {featureList}

                </Content>
            </Container>
        );
    }
}

// export default Expect;
LocationList.propTypes = {
    auth: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});
const mapDispatchToProps = dispatch => ({
    setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
