import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, ImageBackground } from "react-native";
import { Container, Header, Button, Content, Form, Left, Right, Body, Title, Item, Icon, Frame, Input, Label, Text, List, ListItem } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import api from '../../api';
import FSpinner from 'react-native-loading-spinner-overlay';
const win = Dimensions.get('window').width;

import styles from "./styles";
class JobList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            status: 'ALL',
            customerId: this.props.auth.data.id ? this.props.auth.data.id :'' ,
            jobList: []
        }
    }

    componentDidMount() {
        this.setState({ visible: true });
        api.post('Jobs/getJobListingForUser', { customerId: this.state.customerId, status:this.state.status }).then((res) => {
            this.setState({ jobList: res.response.message, visible: false });
             console.log(this.state.jobList);
        }).catch((err) => {
            this.setState({ visible: false });
            Alert.alert('Please try again later.');
        })
    }



    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <FSpinner visible={this.state.visible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
                <Header style={styles.headerWarp} noShadow androidStatusBarColor="#81cdc7">
                    <Button transparent onPress={() => this.props.navigation.goBack()} style={{ width: 30 }} >
                        <Ionicons name="ios-arrow-back" style={styles.headIcon} />
                    </Button>
                    <Body style={styles.headBody}>
                        <Title>Job Details</Title>
                    </Body>
                    <Button transparent style={{ width: 30, backgroundColor: 'transparent', }} disabled={true} />
                </Header>
                {/* <Content style={{ backgroundColor: '#ccc' }}>
                    <List
                        dataArray={this.state.jobList}
                        style={styles.jobList}
                        renderRow={(item) =>
                            <ListItem style={styles.jobListItem}>
                                <View style={styles.listWarp}>
                                    <View style={styles.listWarpImageWarp}>
                                        <Image source={imageIcon1} style={styles.listWarpImage} />
                                    </View>
                                    <View style={styles.listWarpTextWarp}>
                                        <View style={styles.flexDirectionRow}>
                                            <Text>{item.service.name}</Text>
                                        </View>
                                        <View style={styles.flexDirectionRow}>
                                            <Text style={[styles.fontWeight700, { fontSize: 14 }]}>Tuesday </Text>
                                            <Text style={{ fontSize: 14 }}> 10:00 AM</Text>
                                        </View>
                                        <View style={styles.flexDirectionRow}>
                                            <Text>Deira, Dubai</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.listWarpPriceUp}>AED 100</Text>
                                        <Text style={styles.listWarpPriceDown}>4 hours</Text>
                                    </View>
                                </View>
                            </ListItem>
                        }
                    />
                </Content> */}

            </Container>
        );
    }
}

//export default JobList;
const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(JobList);
