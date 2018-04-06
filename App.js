import React from "react";
import App from "./js/App";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from './js/api/';
export class App1 extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

  }
state = { isReady: false};


  componentDidMount(){
    // FCM.requestPermissions();
    // FCM.getFCMToken().then(token => {
    //   console.log("TOKEN (getFCMToken)", token);
    //   this.props.checkAuth((res) => {
    //     console.log(res);
  	// 		if (res) {
    //     api.put(`Customers/editCustomer/${res.userId}?access_token=${res.id}`, { deviceToken: token}).then((resEdit) => {
    //     }).catch((err) => {
    // 			});
  	// 		}
  	// 	},(err)=>{
    //     console.log(err);
    //   });
    // });
    
    // // This method get all notification from server side.
    // FCM.getInitialNotification().then(notif => {
    //   console.log("INITIAL NOTIFICATION", notif)
    // });
    
    // // This method give received notifications to mobile to display.

    // this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, notif => {
    //   console.log("a", notif);
    //   if (notif && notif.local_notification) {
    //     return;
    //   }
    //   this.sendRemote(notif);
    // });
    
    // // this method call when FCM token is update(FCM token update any time so will get updated token from this method)
    //  this.refreshUnsubscribe = FCM.on(FCMEvent.Notification, token => {
    //    console.log("TOKEN (refreshUnsubscribe)", token);
    //     FCM.getFCMToken().then(token => {
    //       console.log("TOKEN (getFCMToken)", token);
    //       this.props.checkAuth((res) => {
    //         console.log(res);
    //         if (res) {
    //         api.put(`Customers/editCustomer/${res.userId}?access_token=${res.id}`, { deviceToken: token}).then((resEdit) => {
    //         }).catch((err) => {
    //           });
    //         }
    //       },(err)=>{
    //         console.log(err);
    //       });
    //     });
    //  });

  }

    // FCM.presentLocalNotification({
    //   id: new Date().valueOf().toString(),                // (optional for instant notification)
    //   title: "Test Notification with action",             // as FCM payload
    //   body: "Force touch to reply",                       // as FCM payload (required)
    //   sound: "bell.mp3",                                  // "default" or filename
    //   priority: "low",                                   // as FCM payload
    //   click_action: "com.myapp.MyCategory",               // as FCM payload - this is used as category identifier on iOS.
    //   badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
    //   number: 10,                                         // Android only
    //   ticker: "My Notification Ticker",                   // Android only
    //   auto_cancel: true,                                  // Android only (default true)
    //   large_icon: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",                           // Android only
    //   icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
    //   big_text: "Show when notification is expanded",     // Android only
    //   sub_text: "This is a subText",                      // Android only
    //   color: "red",                                       // Android only
    //   vibrate: 300,                                       // Android only default: 300, no vibration if you pass 0
    //   wake_screen: true,                                  // Android only, wake up screen when notification arrives
    //   group: "group",                                     // Android only
    //   picture: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",                      // Android only bigPicture style
    //   ongoing: true,                                      // Android only
    //   my_custom_data:'my_custom_field_value',             // extra data you want to throw
    //   lights: true,                                       // Android only, LED blinking (default false)
    //   show_in_foreground: true                           // notification when app is in foreground (local & remote)
    // });

  // sendRemote(notif) {
  //   console.log('notify sent', notif);
  //   FCM.presentLocalNotification({
  //     id: new Date().valueOf().toString(),
  //     title: notif.fcm.body,
  //     body: notif.fcm.body,
  //     ticker: notif.fcm.body,
  //     priority: "high",
  //     click_action: notif.click_action,
  //     show_in_foreground: true,
  //     local: true,
  //     vibrate: 300,
  //     wake_screen: true,
  //     lights: true,
  //     auto_cancel: true,
  //     group: "group",
  //     icon: "ic_launcher", 
  //     large_icon: "ic_launcher",
  //     data: { screenType: 'cleaner' },
  //     //picture: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg", 
  //     // android_actions: JSON.stringify([{
  //     //   id: "view",
  //     //   title: 'view'
  //     // },{
  //     //   id: "dismiss",
  //     //   title: 'dismiss'
  //     // }])
  //   });
  // }

  render() {
    return <App />;
  }
}

// App1.propTypes = {
//   auth: PropTypes.object.isRequired,
// };
// const mapStateToProps = state => ({
//   auth: state.auth
// });

// const mapDispatchToProps = dispatch => ({
//  checkAuth: cb => dispatch(checkAuth(cb)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(App1);
export default App1;