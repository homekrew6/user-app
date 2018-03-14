import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';


class incrimentDecriment extends Component {
    state = { massage: "" }
    componentDidMount(){
        this.setState({ massage: this.props.massage });
    }

    increment() {
        console.log("from child")
        this.props.onIncrement(this.props.massage);
    }
    decrement() {
        this.props.onDecrement(this.props.massage);
    }

    handleIncrement = () => {
        console.log("incrementValue", this.state.massage);
        const massage = Number(this.state.massage) + 1;
        this.setState({ massage: massage });
    }
    handleDecrement = () => {
        console.log("decrementValue", this.state.massage);
        const massage = Number(this.state.massage) - 1;
        this.setState({ massage: massage });
    }



    render() {
        return (
            <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity style={styles.confirmationServicePlusWarp} onPress={this.handleDecrement.bind(this)}>
                    <MaterialCommunityIcons name='minus' style={styles.confirmationServicePlusIcon} />
                </TouchableOpacity>

                <View style={{ marginLeft: 5, marginRight: 5, borderWidth: 1, borderRadius: 10, width: 50, borderColor: '#e0e0e0', alignItems: 'center' }}>
                    <Text>{this.state.massage}</Text>
                </View>

                <TouchableOpacity style={styles.confirmationServicePlusWarp} onPress={this.handleIncrement.bind(this)}>
                    <Entypo name='plus' style={styles.confirmationServicePlusIcon} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default incrimentDecriment;
