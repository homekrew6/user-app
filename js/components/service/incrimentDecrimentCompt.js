import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

import { setServiceDetails } from './elements/serviceActions';
class incrimentDecriment extends Component {
    state = { massage: "", totalData: "" }
    componentDidMount() {
        console.log(this.props);
        this.setState({ massage: this.props.massage.IncrementId });
        this.setState({ totalData: this.props.massage });
    }

    increment() {
        console.log("from child")
        this.props.onIncrement(this.props.massage);
    }
    decrement() {
        this.props.onDecrement(this.props.massage);
    }

    handleIncrement = () => {
        debugger;
        var price = this.props.service.data.price;
        const massage = Number(this.state.massage) + 1;
        this.setState({ massage: massage });
        if (this.state.totalData.answers && this.state.totalData.answers.length > 0) {
            if (this.state.totalData.answers[0].option_price_impact == "Addition") {
                // price = price - (this.state.massage + Number(this.state.totalData.answers[0].price_impact));
                price = price + (Number(massage) + Number(this.state.totalData.answers[0].price_impact));
            }
            else {
                price = price + (Number(massage) * Number(this.state.totalData.answers[0].price_impact));
            }
            var data = this.props.service.data;
            data.price = price;
            this.props.setServiceDetails(data);
        }

    }
    handleDecrement = () => {
        var price = this.props.service.data.price;
        const massage = Number(this.state.massage) - 1;
        this.setState({ massage: massage });
        if (this.state.totalData.answers && this.state.totalData.answers.length > 0) {
            if (this.state.totalData.answers[0].option_price_impact == "Addition") {
                price = price - (this.state.massage + Number(this.state.totalData.answers[0].price_impact));
                // price = price + (Number(massage) + Number(this.state.totalData.answers[0].price_impact));
            }
            else {
                price = price + (Number(massage) * Number(this.state.totalData.answers[0].price_impact));
            }
            var data = this.props.service.data;
            data.price = price;
            this.props.setServiceDetails(data);
        }
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

// export default incrimentDecriment;

incrimentDecriment.propTypes = {
    auth: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});
const mapDispatchToProps = dispatch => ({
    setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(incrimentDecriment);
