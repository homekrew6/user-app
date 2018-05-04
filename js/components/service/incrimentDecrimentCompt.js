import React, { Component } from "react";
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, AsyncStorage } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

import { setServiceDetails } from './elements/serviceActions';
class incrimentDecriment extends Component {
    state = { massage: "", totalData: "" }
    componentDidMount() {
        this.setState({ 
            massage: this.props.massage.IncrementId,
            totalData: this.props.massage,
            questionId: this.props.massage.answers[0].questionId
         });

    }

    increment() {
        console.log("from child")
        this.props.onIncrement(this.props.massage);
    }
    decrement() {
        this.props.onDecrement(this.props.massage);
    }

    handleIncrement = () => {
        const questionId = this.state.questionId;
        const massage = Number(this.state.massage) + 1;
        this.setState({ massage: massage });
        const incrementStatus = data;
        AsyncStorage.getItem("keyQuestionList").then((value) => {
        if(value !== ''){
            const jsonKeyQuestion = JSON.parse(value);
            jsonKeyQuestion.map((dataQ, key) => {
            if(dataQ.answers && dataQ.answers.length && dataQ.answers[0].questionId === questionId){
                jsonKeyQuestion[key].IncrementId = massage;
            }
            });
            const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
            AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
            console.log('====FirstPage====handleIncrement==='+res)
            });
        }
        }).catch(res => {
            //AsyncStorage.setItem('StoreData', dataRemoteString);
            console.log('switchChange err', res);
        });

        var price = this.props.service.data.price;
        price=Number(price);
        var timeInterval = this.props.service.data.time_interval;
        if (this.state.totalData.answers && this.state.totalData.answers.length > 0) {
            if (this.state.totalData.answers[0].option_time_impact == "Addition")
            {
                timeInterval = timeInterval + (Number(massage) + Number(this.state.totalData.answers[0].time_impact));
            }
            else
            {
                timeInterval = timeInterval + (Number(massage) * Number(this.state.totalData.answers[0].time_impact));
            }
            if (this.state.totalData.answers[0].option_price_impact == "Addition") {
                // price = price - (this.state.massage + Number(this.state.totalData.answers[0].price_impact));
                price = price + (Number(massage) + Number(this.state.totalData.answers[0].price_impact));
            }
            else {
                price = price + (Number(massage) * Number(this.state.totalData.answers[0].price_impact));
            }
            var data = this.props.service.data;
            price = this.addZeroes(price);
            data.price = price;
            data.time_interval=timeInterval;
            AsyncStorage.setItem("servicePrice", price).then((success)=>{
            
            })
            this.props.setServiceDetails(data);
        }

    }
    handleDecrement = () => {
        price=Number(price);
        var price = this.props.service.data.price;
        var timeInterval = this.props.service.data.time_interval;
        if ((Number(this.state.massage) == 0) || (Number(this.state.massage) == 1)) {

        }
        else {
            const questionId = this.state.questionId;
            const massage = Number(this.state.massage) - 1;
            this.setState({ massage: massage });
            const incrementStatus = data;
            AsyncStorage.getItem("keyQuestionList").then((value) => {
            if(value !== ''){
                const jsonKeyQuestion = JSON.parse(value);
                jsonKeyQuestion.map((dataQ, key) => {
                if(dataQ.answers && dataQ.answers.length && dataQ.answers[0].questionId === questionId){
                    jsonKeyQuestion[key].IncrementId = massage;
                }
                });
                const dataStringQuestion = JSON.stringify(jsonKeyQuestion);
                AsyncStorage.setItem('keyQuestionList', dataStringQuestion, (res) => {
                    console.log('====FirstPage====handleDecrement==='+res)
                });
            }
            }).catch(res => {
            });
            
            if (this.state.totalData.answers && this.state.totalData.answers.length > 0) {
                if (this.state.totalData.answers[0].option_time_impact == "Addition") {
                    timeInterval = timeInterval + (Number(massage) + Number(this.state.totalData.answers[0].time_impact));
                }
                else {
                    timeInterval = timeInterval + (Number(massage) * Number(this.state.totalData.answers[0].time_impact));
                }
                if (this.state.totalData.answers[0].option_price_impact == "Addition") {
                    price = price - (this.state.massage + Number(this.state.totalData.answers[0].price_impact));
                    // price = price + (Number(massage) + Number(this.state.totalData.answers[0].price_impact));
                }
                else {
                    price = price - (Number(this.state.massage) * Number(this.state.totalData.answers[0].price_impact));
                }
                this.setState({ massage: massage });
                var data = this.props.service.data;
                price = this.addZeroes(price);
                data.price = price;
                data.time_interval=timeInterval;
                AsyncStorage.setItem("servicePrice", price).then((success)=>{
            
                })
                this.props.setServiceDetails(data);
            }
        }

    }
    addZeroes(num) {
        // var value = Number(num);
        // var res = num.split(".");
        // if(res.length == 1 || (res[1].length < 3)) {
        //     value = value.toFixed(2);
        // }
        let value = num.toFixed(2);
        return value
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

// incrimentDecriment.propTypes = {
//     auth: PropTypes.object.isRequired,
// };
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service,
});
const mapDispatchToProps = dispatch => ({
    setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(incrimentDecriment);
