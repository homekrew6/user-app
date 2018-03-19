import React, { Component } from "react";
import {NavigationActions} from "react-navigation";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity } from "react-native";
import { Container, Header, Button, Content, Form, Item, Input, Text, Body, Title  } from "native-base";

import I18n from '../../i18n/i18n';
import styles from "./styles";
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';


class MyPromoCode extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            isModalVisible: false,
        }

    }

    addPromoCode(){
        this.setState({
            isModalVisible: !this.state.isModalVisible,
        })
    }


    render() {
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
                  <Title style={styles.headerTitle}>My Promo Code</Title>
                </Body>
                    <Button transparent onPress={() => this.addPromoCode()} >
                    <Text>Add</Text>
                </Button>
              </Header>
              <Content>
                    <View style={styles.itemWarp}>
                        <View style={styles.flex1}>
                            <Text style={styles.headPromoCode}>AED50 OFF</Text>
                            <Text style={styles.headPromoCodeButtom}>AED50 is your first cleaning services</Text>
                        </View>
                        <View>
                            <Text style={styles.promoDate}>Nov 20, 2017</Text>
                        </View>
                    </View>
                    <View style={styles.itemWarp}>
                        <View style={styles.flex1}>
                            <Text style={styles.headPromoCode}>AED50 OFF</Text>
                            <Text style={styles.headPromoCodeButtom}>AED50 is your first cleaning services</Text>
                        </View>
                        <View>
                            <Text style={styles.promoDate}>Nov 20, 2017</Text>
                        </View>
                    </View>



                    <View>
                        <Modal 
                            isVisible={this.state.isModalVisible}
                            animationIn='slideInUp'
                            animationOut= 'slideOutDown'
                            animationOutTiming = {400}
                            style={styles.mainModal}
                        >
                            <View style={styles.modalWarp}>
                               <View>
                                    <Text style={styles.promoCodeHeader}>Add Promo Code</Text>
                                    <Form style={styles.promoCodeInput}>
                                        <Item style={styles.promoCodeInputItem}>
                                            <Input placeholder="Enter Promo Code " style={styles.promoCodeInputTag} />
                                            </Item>
                                        </Form>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={styles.promoCodeCancel} onPress={() => this.addPromoCode()}><Text style={{ fontSize: 14 }}>CANCEL</Text></TouchableOpacity>
                                        <TouchableOpacity style={styles.promoCodeAdd}><Text style={styles.promoCodeCancelText}>ADD</Text></TouchableOpacity>
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

MyPromoCode.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPromoCode);
