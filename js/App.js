/* @flow */

import React from "react";

import { Platform } from "react-native";
import { Root } from "native-base";
import { StackNavigator } from "react-navigation";

import Drawer from "./Drawer";
import Intro  from "./components/intro";
import Demo  from "./components/intro/demo";
import Signup  from "./components/accounts/signup";
import Login  from "./components/accounts/login";

const AppNavigator = StackNavigator(
    {
        Drawer: { screen: Drawer },
        Intro: {screen: Intro},
        Demo: {screen: Demo},
        Signup: {screen: Signup},
        Login: {screen: Login}
    },
    {
        initialRouteName: "Login",
        headerMode: "none",
    }
);

export default () =>
    <Root>
        <AppNavigator />
    </Root>;
