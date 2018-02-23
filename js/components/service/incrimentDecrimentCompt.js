import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, List, ListItem, } from "react-native";
import Ico from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Container, Header, Button, Content, Form, Item, Frame, Input, Label, Text, Body, Title, Picker } from "native-base";
import I18n from '../../i18n/i18n';
import styles from './styles';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class incrimentDecriment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>

                <View style={styles.confirmationServicePlusWarp}>
                    <MaterialCommunityIcons name='minus' style={styles.confirmationServicePlusIcon} />
                </View>

                <View style={{ marginLeft: 5, marginRight: 5, borderWidth: 1, borderRadius: 10, width: 50, borderColor: '#e0e0e0', alignItems: 'center' }}>
                    <Text>12</Text>
                </View>

                <View style={styles.confirmationServicePlusWarp}>
                    <Entypo name='plus' style={styles.confirmationServicePlusIcon} />
                </View>
            </View>
        );
    }
}

export default incrimentDecriment;
