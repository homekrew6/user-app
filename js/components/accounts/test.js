import React, { Component } from "react";
import { Image, View, StatusBar, Dimensions, Alert, TouchableOpacity } from "react-native";
import { Container, Header, Button, Content, Form, Left, Right, Body, Title, Item, Icon, Frame, Input, Label, Text } from "native-base";
// import AppIntro from 'react-native-app-intro';
import styles from "./styles";
class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }



    render() {
        return (
            <Container style={{ backgroundColor: '#fff' }}>
                <StatusBar
                    backgroundColor="#81cdc7"
                />
                <Content>

                    <Text>hi</Text>

                </Content>
            </Container>
        );
    }
}




export default connect()(Test);
