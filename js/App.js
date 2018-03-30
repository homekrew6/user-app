/* @flow */

import React from "react";

import { Platform, BackHandler, Alert } from "react-native";
import { Root } from "native-base";
import { StackNavigator, NavigationActions } from "react-navigation";

import Drawer from "./Drawer";
import Intro from "./components/intro";
import Demo from "./components/intro/demo";
import Signup from "./components/accounts/signup";
import Login from "./components/accounts/login";
import ForgotPassword from "./components/accounts/forgot_password";
import ResetPassword from "./components/accounts/reset_password";
import Menu from "./components/accounts/menu";
import EditProfile from "./components/accounts/edit_profile";
import Category from "./components/service/category";
import Confirmation from "./components/service/confirmation";
import ServiceDetails from "./components/service/serviceDetails";
import Expect from "./components/service/expect";
import DateAndTime from "./components/service/dateAndTime";
import LocationList from "./components/service/locationList";
import MyMap from "./components/location/MyMap";
import MyLocation from "./components/location/MyLocation";
import ServiceProviderListing from './components/service/serviceProviderListing';
import MyPromoCode from "./components/promoCode/myPromoCode";
import ThankYou from "./components/promoCode/thankYou";
//import JobDetails from "./components/jobs/jobDetails";
import JobList from './components/jobs/jobList';

const AppNavigator = StackNavigator(
    {
        Drawer: { screen: Drawer },
        Intro: { screen: Intro },
        Demo: { screen: Demo },
        Signup: { screen: Signup },
        Login: { screen: Login },
        ForgotPassword: { screen: ForgotPassword },
        ResetPassword: { screen: ResetPassword },
        Menu: { screen: Menu },
        EditProfile: { screen: EditProfile },
        Category: { screen: Category },
        Confirmation: { screen: Confirmation },
        ServiceDetails: { screen: ServiceDetails },
        Expect: { screen: Expect },
        DateAndTime: { screen: DateAndTime },
        LocationList: { screen: LocationList },
        MyLocation: { screen: MyLocation },
        MyMap: { screen: MyMap },
        ServiceProviderListing: { screen: ServiceProviderListing },
        MyPromoCode: { screen: MyPromoCode },
        ThankYou: { screen: ThankYou },
        //JobDetails: { screen: JobDetails },
        JobList: { screen: JobList}
    },
    {
        initialRouteName: "Drawer",
        headerMode: "none",
    }
);
// const defaultStackGetStateForAction =
//     AppNavigator.router.getStateForAction;
// AppNavigator.router.getStateForAction = (action, state) => {
//     if (state && action) {
//         if (state.index === 0 && action.type === NavigationActions.BACK) {
//             Alert.alert(
//                 'Confirm',
//                 'Are you sure to exit the app?',
//                 [
//                     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
//                     { text: 'OK', onPress: () => BackHandler.exitApp() },
//                 ],
//                 { cancelable: false }
//             )


//             // BackHandler.exitApp();
//             //return null;
//         }

//         else {
//             if (state.routes && state.routes.length && state.routes.length > 1) {
//                 let index = state.routes.length - 1;
//                 if (state.routes[index].routeName == 'Confirmation') {
//                     debugger;
//                     console.log(AppNavigator);
//                 }
//             }
//         }
//     }


//     return defaultStackGetStateForAction(action, state);
// };



export default () =>
    <Root>
        <AppNavigator />
    </Root>;
