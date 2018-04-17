/* @flow */

import React from "react";

import { Platform, BackHandler, Alert, Easing, Animated } from "react-native";
import { Root } from "native-base";
import { StackNavigator, NavigationActions } from "react-navigation";


import Home from "./components/home/index"
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
import JobDetails from "./components/jobs/jobDetails";
import JobList from './components/jobs/jobList';
import ServiceProviderDetails from './components/jobs/serviceProviderDetails';
import Settings from './components/settings/settings';
import LanguageList from './components/settings/languageList';
import CurrencyList from './components/settings/currencyList'; 
import FollowUp from './components/jobs/followUp';
import JobTracker from './components/jobs/jobTracker';
import Reschedule from './components/jobs/reschedule';
import Chat from './components/jobs/chat';
import jobSummary from './components/jobs/jobSummary';
import QuoteList from './components/jobs/quoteList';


const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
            })

            return { transform: [{ translateX }] }
        },
    }
}

const AppNavigator = StackNavigator(
    {
        Home: { screen: Home },
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
        JobDetails: { screen: JobDetails },
        JobList: { screen: JobList},
        ServiceProviderDetails: { screen: ServiceProviderDetails},
        Settings: { screen: Settings },
        LanguageList: { screen: LanguageList },
        CurrencyList: { screen: CurrencyList },
        FollowUp: { screen: FollowUp },
        JobTracker: { screen: JobTracker },
        Reschedule: { screen: Reschedule },
        Chat: { screen: Chat },
        jobSummary: { screen: jobSummary },
        QuoteList:{screen:QuoteList}
    },
    {
        initialRouteName: "Home",
        headerMode: "none",
        transitionConfig
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
