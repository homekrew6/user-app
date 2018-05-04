import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, FlatList, Text } from "react-native";
import { Container, Header, Button, Content, CardItem, Card, Body, Title } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Stars from 'react-native-stars-rating';
import I18n from '../../i18n/i18n';
import styles from "./styles";
import api from '../../api';
const reseteAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Menu' })],
});
const img19 = require('../../../img/serv.jpg');


class ThankYou extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 2.5,
            sliderData: [
                {
                    'src': img19,
                    'key': 1
                },
                {
                    'src': img19,
                    'key': 2
                },
                {
                    'src': img19,
                    'key': 3
                },
                {
                    'src': img19,
                    'key': 4
                },
                {
                    'src': img19,
                    'key': 5
                },
                {
                    'src': img19,
                    'key': 6
                },
                {
                    'src': img19,
                    'key': 7
                }
            ],
            serviceList:''
        };
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }


    componentDidMount()
    {
        api.get('Zones/getParentZone').then((res) => {
            //console.log(res);
            if (res.zone.length > 0) {
                api.post('serviceZones/getZoneRelatedService', { zone: res.zone[0].id }).then((resService) => {
                    if (resService.response.length > 0) {
                        api.get('WorkerSkills').then((workerSkillsList) => {
                            let checkServiceIdsList = [];
                            workerSkillsList.map((item) => {
                                checkServiceIdsList.push(item.serviceId);
                            });
                            let zoneServiceIdCheck = [];
                            resService.response.map((data, key) => {
                                if (data.service && (data.service.is_active === true || data.service.is_active === null)) {
                                    if (checkServiceIdsList.includes(data.service.id)) {
                                        zoneServiceIdCheck.push(data)
                                    }

                                }
                            });
                            this.setState({ serviceList: zoneServiceIdCheck });
                        }).catch((err1) => {
                            let zoneServiceIdCheck = [];
                            resService.response.map((data, key) => {
                                if (data.service && (data.service.is_active === true || data.service.is_active === null)) {
                                    zoneServiceIdCheck.push(data)
                                }
                            })
                            this.setState({ serviceList: zoneServiceIdCheck });
                        })
                    }
                }).catch((err) => {
                    //console.log(err);
                    this.setState({ visible: false });
                });

            }
        }).catch((err) => {
            this.setState({ visible: false });
        });
    }

    
    goToMenu()
    {
        this.props.navigation.dispatch(reseteAction);
    }

    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" >
                    <Button transparent onPress={() => this.goToMenu()}>
                        <Ionicons style={styles.headerIconClose} name='ios-close' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>{I18n.t('thank_you')}</Title>
                    </Body>
                    <Button transparent />
                </Header>
                <Content>
                    <Card style={styles.tCard}>
                        <CardItem style={{alignItems: 'center'}}>
                                <View style={styles.thanksInformation}>
                                <Text style={styles.thanksText1}>{I18n.t('you_are_all_set')}</Text>
                                <Text style={styles.thanksText2}>{I18n.t('thanks_for_awesome')}</Text>
                                <Text style={styles.thanksText2}>{I18n.t('see_on_next')}</Text>
                                <View style={styles.thanksText3}><Text style={{ backgroundColor: '#81cdc7', borderRadius: 10, fontSize: 12, paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2 }}>ORDER #: 123456</Text></View>
                                <Text style={[styles.thanksText2, {marginBottom: 15}]}>Cheack your mail for more details.</Text>

                                <View style={styles.thanksBottomWarp}>
                                    <TouchableOpacity style={styles.thanksBottom}>
                                        <Ionicons style={styles.font26} name='ios-mail'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.thanksBottom, {borderRightColor: '#fff'}]}>
                                        <Ionicons style={styles.font20} name='md-share' />
                                    </TouchableOpacity>
                                </View>
                                </View>
                            </CardItem> 

                        <CardItem style={{ flexDirection: 'column'}}>
                            <Text style={styles.rateHeader}>Give our app  Rating</Text>
                            <Stars
                                isActive={true}
                                rateMax={5}
                                isHalfStarEnabled={false}
                                onStarPress={(rating1) => console.log(rating1)}
                                isHalfStarEnabled = {true}
                                color={'#81cdc7'}
                                rate={3}
                                size={30}
                            />
                        </CardItem>

                        <CardItem style={{ flexDirection: 'column' }}>
                            <Text style={styles.rateHeader}>{I18n.t('our_service')}</Text>
                            <FlatList
                                data={this.state.serviceList}
                                renderItem={({ item }) =>
                                    <View>
                                        <Image key={item.key} source={{ uri: item.service.banner_image}} style={styles.slideImage}></Image>
                                    </View>
                                }
                                horizontal={true}
                            />

                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

ThankYou.propTypes = {
    //auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
    return {
        //auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThankYou);
