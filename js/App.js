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
import ForgotPassword  from "./components/accounts/forgot_password";
import ResetPassword from "./components/accounts/reset_password";
import Menu  from "./components/accounts/menu";
import EditProfile from "./components/accounts/edit_profile";
import Category from "./components/service/category";
import Confirmation from "./components/service/confirmation";
import ServiceDetails from "./components/service/serviceDetails";
import Expect from "./components/service/expect";
// import Test from "./components/accounts/test";

const AppNavigator = StackNavigator(
    {
        Drawer: { screen: Drawer },
        Intro: {screen: Intro},
        Demo: {screen: Demo},
        Signup: {screen: Signup},
        Login: {screen: Login},
        ForgotPassword: {screen: ForgotPassword},
        ResetPassword: {screen: ResetPassword},
        Menu: { screen: Menu },
        EditProfile: { screen: EditProfile },
        Category: { screen: Category },
        Confirmation: { screen: Confirmation },
        ServiceDetails: { screen: ServiceDetails },
        Expect: { screen: Expect },
    },
    {
        initialRouteName: "Drawer",
        headerMode: "none",
    }
);

export default () =>
    <Root>
        <AppNavigator />
    </Root>;
