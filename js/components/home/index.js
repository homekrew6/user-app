import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { Image, View, StatusBar, ImageBackground, Alert, AsyncStorage } from "react-native";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { checkAuth, getUserDetail } from '../accounts/elements/authActions'
import { Container, Button, H3, Text, Header, Title, Body, Left, Right } from "native-base";
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from "react-native-fcm";
import styles from "./styles";
import I18n from '../../i18n/i18n';
import api from '../../api';
//import GlobalFont from 'react-native-global-font';
//const launchscreenBg = require("../../../img/launchscreen-bg.png");
const launchscreenBg = require("../../../img/splash.png");
const resetAction = NavigationActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({ routeName: 'Menu' })],
});
const resetActionIntro = NavigationActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({ routeName: 'Intro' })],
});
const resetActionCategory = NavigationActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({ routeName: 'Category' })],
});
class Home extends Component {
	// eslint-disable-line
	constructor(params) {
		super(params)
		this.state = {
			isPush: false,
			jobId: ''
		}
	}
	// componentDidMount()
	// {
	// 	const fontName = 'Lato';
	// 	GlobalFont.applyGlobal(fontName);
	// }
	componentWillMount() {
		FCM.requestPermissions();
		FCM.getFCMToken().then(token => {
			console.log('token  ', token);
			AsyncStorage.getItem("userToken").then((userToken) => {
				if (userToken) {
					const userToken1 = JSON.parse(userToken);
					api.put(`Customers/editCustomer/${userToken1.userId}?access_token=${userToken1.id}`, { deviceToken: token }).then((resEdit) => {
					}).catch((err) => {
					});
				}
			})
		});

		// This method get all notification from server side.
		FCM.getInitialNotification().then(notif => {
			setTimeout(() => {
				AsyncStorage.getItem("userToken").then((userToken) => {
					if (userToken) {
						const userToken1 = JSON.parse(userToken);
						this.props.getUserDetail(userToken1.userId, userToken1.id).then(userRes => {
							if(notif.screenType){
								if(notif.screenType == 'JobDetails'){
								api.post('Jobs/getJobDetailsById', {
									"id": Number(notif.jobId)
								}).then((resJob)=>{
									this.props.navigation.dispatch(
										NavigationActions.reset({
											index: 1,
											actions: [
											NavigationActions.navigate({ routeName: 'Menu' }),
											NavigationActions.navigate({ routeName: 'JobDetails', params: {
												jobId: notif.jobId, 
												jobDetails: resJob.response.message[0]
											} }),
											],
										})
									);
								}).catch((err) => {
									connect.log('err', err);
								});
								}else{
									this.props.navigation.dispatch(resetAction);
								}
							}else{
								this.props.navigation.dispatch(resetAction);
							}

						}).catch(err => {
							Alert.alert('Please login');
							this.props.navigation.navigate("Login")
						})
					} else {
						AsyncStorage.getItem('IsSliderShown').then((res) => {
							if (res) {
								this.props.navigation.dispatch(resetActionCategory);
							}else {
								this.props.navigation.dispatch(resetActionIntro);
							}
						}).catch((err) => {
							this.props.navigation.dispatch(resetActionIntro);
						})
					}
				})
			}, 4000);
			if (notif.screenType && notif.screenType == 'JobDetails') {
				// this.props.navigation.navigate('JobDetails', { jobDetails: notif.jobId });
				this.setState({ isPush: true, jobId: notif.jobId });
			}

		});


		// This method give received notifications to mobile to display.
		this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, notif => {
			console.log("a", notif);
			if (notif && notif.local_notification) {
				if(notif.screenType){
					if(notif.screenType == 'JobDetails'){
						api.post('Jobs/getJobDetailsById', {
							"id": Number(notif.jobId)
						}).then((resJob)=>{
							this.props.navigation.dispatch(
								NavigationActions.reset({
									index: 1,
									actions: [
									NavigationActions.navigate({ routeName: 'Menu' }),
									NavigationActions.navigate({ routeName: 'JobDetails', params: {
										jobId: notif.jobId, 
										jobDetails: resJob.response.message[0]
									} }),
									],
								})
							);
						}).catch((err) => {
							connect.log('err', err);
						});
					}else{
						this.props.navigation.dispatch(resetAction);
					}
				}else{
					this.props.navigation.dispatch(resetAction);
				}
				//return;
			}

			this.sendRemote(notif);
		});



		// this method call when FCM token is update(FCM token update any time so will get updated token from this method)
		this.refreshUnsubscribe = FCM.on(FCMEvent.Notification, token => {
			console.log("TOKEN (refreshUnsubscribe)", token);
			FCM.getFCMToken().then(token => {
				console.log("TOKEN (getFCMToken)", token);
				AsyncStorage.getItem("userToken").then((userToken) => {
					if (userToken) {
						const userToken1 = JSON.parse(userToken);
						api.put(`Customers/editCustomer/${userToken1.userId}?access_token=${userToken1.id}`, { deviceToken: token }).then((resEdit) => {
						}).catch((err) => {
						});
					}
				})

			});
		});
		

	}

	sendRemote(notif) {
		console.log('notify sent', notif);
		FCM.presentLocalNotification({
			id: new Date().valueOf().toString(),
			title: notif.fcm.body,
			body: notif.fcm.body,
			ticker: notif.fcm.body,
			priority: "high",
			click_action: notif.click_action,
			show_in_foreground: true,
			local: true,
			vibrate: 300,
			wake_screen: true,
			lights: true,
			auto_cancel: true,
			group: "group",
			icon: "ic_launcher",
			large_icon: "ic_launcher",
			screenType: notif.screenType,
			jobId: notif.jobId
			//picture: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg", 
			// android_actions: JSON.stringify([{
			//   id: "view",
			//   title: 'view'
			// },{
			//   id: "dismiss",
			//   title: 'dismiss'
			// }])
		});


	}
	render() {
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<ImageBackground source={launchscreenBg} style={styles.imageContainer}>
					<View style={styles.logoContainer}>
						{/* <Image source={launchscreenLogo} style={styles.logo} /> */}
					</View>
					<View
						style={{
							alignItems: "center",
							marginBottom: 50,
							backgroundColor: "transparent",
						}}
					>
						{/* <H3 style={styles.text}>App to showcase</H3> */}
						<View style={{ marginTop: 8 }} />
						{/* <H3 style={styles.text}>NativeBase components</H3> */}
						<View style={{ marginTop: 8 }} />
					</View>
					<View style={styles.btmView}>
						<Text style={styles.btmText}>{I18n.t('copyright')} © 2018 homekrew. {I18n.t('all_rights_reserved')}.</Text>
					</View>

				</ImageBackground>
			</Container>
		);
	}
}

Home.propTypes = {
	auth: PropTypes.object.isRequired,
	checkAuth: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		checkAuth: (cb) => dispatch(checkAuth(cb)),
		getUserDetail: (id, auth) => dispatch(getUserDetail(id, auth))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
