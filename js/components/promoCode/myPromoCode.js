import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity, Text } from "react-native";
import { Container, Header, Button, Content, Form, Item, Input, Body, Title } from "native-base";
import FSpinner from 'react-native-loading-spinner-overlay';
import I18n from '../../i18n/i18n';
import styles from "./styles";
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../api';
import { setServiceDetails } from '../service/elements/serviceActions';


class MyPromoCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            IsLoaderVisible: false,
            promoCode: '',
            promoCodeList: [],
            price: this.props.service.data.price ? this.props.service.data.price : '',
        }

    }

    addPromoCode() {
        // debugger;
        // console.log(this.state.promoCode);
        // console.log(this.props.navigation.state.params.id);
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }

    getMonthValue(month)
    {
        let value;
        switch (month) {
            case 0:
                value="Jan";
                break;
            case 1:
                value = "Feb";
                break;
            case 2:
                value = "Mar";
                break;
            case 3:
                value = "Apr";
                break;
            case 4:
                value = "May";
                break;
            case 5:
                value = "Jun";
                break;
            case 6:
                value = "July";
                break;
            case 7:
                value = "Aug";
                break;
            case 8:
                value = "Sep";
                break;
            case 8:
                value = "Oct";
                break;
            case 9:
                value = "Nov";
                break;
            case 10:
                value = "Dec";
                break;
        
            default:
                break;
        }
        return value;
    }

    componentDidMount() {
        this.GetPromoCodeList();

    }

    GetPromoCodeList() {
        if (this.props.navigation.state.params.id) {
            this.setState({ IsLoaderVisible: true });
            const filter = '{"where":{"customerId":' + this.props.navigation.state.params.id + '}, "include":["promotions"]}';
            api.get('userPromoCodes?filter=' + filter).then((res) => {
                res.map((item) => {
                    if (item.addedDate) {
                        const newDate = new Date(item.addedDate);
                        const day = newDate.getDate();
                        const fullYear = newDate.getFullYear();
                        const month = this.getMonthValue(newDate.getMonth());
                        item.addedDate = month + " " + day + " " + fullYear;
                        item.seleted= false;
                    }
                });
                this.setState({ IsLoaderVisible: false, promoCodeList: res });
            }).catch((err) => {
                this.setState({ IsLoaderVisible: false });
                Alert.alert('Please try again later.');
            });
        }
        else {
            Alert.alert('Please login.');
        }
    }
    promoCodeSelect(item){
        let promoCodeList = this.state.promoCodeList;
            promoCodeList.map((data)=> {
                data.seleted = false;
                if ( item.id == data.id ){
                    data.seleted = true;
                }
                this.setState({
                    promoCodeList: promoCodeList,
                })
            })

        let calculatePromoPriceOpject = {
            serviceId: this.props.service.data.id,
            price: this.state.price, 
            customerId: item.customerId,
            IsFirstOrderOnly: item.promotions.IsFirstOrderOnly, 
            id: item.id, 
            max_discount_amount: item.promotions.max_discount_amount, 
            NoOfUsed: item.promotions.NoOfUsed, 
            min_order_amount: item.promotions.min_order_amount,                                                 
            promotionsId: item.promotions.id,
            amount:item.promotions.amount,
            start_date: item.promotions.start_date,
            end_date: item.promotions.end_date,                                         
            noOfUses: item.promotions.noOfUses,                                        
            jobEstimatedHours: item.promotions.jobEstimatedHours,
            time_interval: this.props.service.data.time_interval,
            min_charge: this.props.service.data.min_charge,                                      
        }
        this.setState({ IsLoaderVisible: true });

        api.post('Jobs/calculatePromoPrice', calculatePromoPriceOpject ).then((res) => {
            // debugger;
            let response = res.response;  
            console.log(response);
            if (response.message){
                Alert.alert(response.message);                
            }else{
                Alert.alert('Please try other');
            }
            if (response.IsPromoApplied){
                let serviceData = this.props.service.data;
                serviceData.price =parseFloat(response.price).toFixed(2);
                serviceData.promo = item.promotions.promo_code; 
                serviceData.promotionsId = item.promotions.id;
                if (response.promoPrice)
                {
                    serviceData.promoPrice = response.promoPrice;
                }               
                this.props.setServiceDetails(serviceData);
                this.props.navigation.navigate('Confirmation');
            }
            this.setState({ IsLoaderVisible: false });            
        }).catch((err) => {
            console.log(err);
            this.setState({ IsLoaderVisible: false });            
        });

    }
    

    addUserPromo() {
        if (this.props.navigation.state.params.id) {
            if (this.state.promoCode) {
                this.setState({ IsLoaderVisible: true });
                const data = { promoCode: this.state.promoCode, customerId: this.props.navigation.state.params.id, addedDate:new Date() };
                api.post('userPromoCodes/addUserPromo', data).then((res) => {
                    if (res.response.type == "Error") {
                        this.setState({ IsLoaderVisible: false, isModalVisible: false });
                        Alert.alert(res.response.message);
                    }
                    else {
                        this.setState({ IsLoaderVisible: false, isModalVisible: false });
                        this.GetPromoCodeList();
                    }
                });

            }
            else {
                Alert.alert("Please add the promo code.");
            }
        }
        else {
            Alert.alert('Please login.');
        }

    }


    render() {
        let promoCodeList = this.state.promoCodeList.map((item, key) => {
            return (
                <TouchableOpacity style={[styles.itemWarp, item.seleted ? { backgroundColor : '#ccc' }: { backgroundColor: '#fff' } ]} onPress={() => this.promoCodeSelect(item)} key={ key }>
                    <View style={styles.flex1}>
                        <Text style={styles.headPromoCode}>{item.promotions.promo_code}</Text>
                        <Text style={styles.headPromoCodeButtom}>AED50 is your first cleaning services</Text>
                    </View>
                    <View>
                        <Text style={styles.promoDate}>{item.addedDate}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
       
        return (
            <Container >
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Header style={styles.headerMain} androidStatusBarColor="#81cdc7" >
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Ionicons style={styles.headerIconBack} name='ios-arrow-back' />
                    </Button>
                    <Body style={styles.headerBody}>
                        <Title style={styles.headerTitle}>{I18n.t('myPromoCode')}</Title>
                    </Body>
                    <Button transparent onPress={() => this.addPromoCode()} >
                        <Text>{I18n.t('add')}</Text>
                    </Button>
                </Header>
                <Content>
                    <FSpinner visible={this.state.IsLoaderVisible} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />

                    {promoCodeList}

                    <View>
                        <Modal
                            isVisible={this.state.isModalVisible}
                            animationIn='slideInUp'
                            animationOut='slideOutDown'
                            animationOutTiming={400}
                            style={styles.mainModal}
                        >
                            <View style={styles.modalWarp}>
                                <View>
                                    <Text style={styles.promoCodeHeader}>{I18n.t('add_promo_code')}</Text>
                                    <Form style={styles.promoCodeInput}>
                                        <Item style={styles.promoCodeInputItem}>
                                            <Input placeholder="Enter Promo Code " style={styles.promoCodeInputTag} onChangeText={text => this.setState({ promoCode: text })} />
                                        </Item>
                                    </Form>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={styles.promoCodeCancel} onPress={() => this.setState({ isModalVisible: false })}><Text style={{ fontSize: 14 }}>{I18n.t('cancel')}</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.promoCodeAdd} onPress={() => this.addUserPromo()}><Text style={styles.promoCodeCancelText}>{I18n.t('add')}</Text></TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </Content>
            </Container>
        );
    }
}

// export default Categories;
MyPromoCode.propTypes = {
    auth: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    auth: state.auth,
    service: state.service
});

const mapDispatchToProps = dispatch => ({
    setServiceDetails: (data) => dispatch(setServiceDetails(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPromoCode);
