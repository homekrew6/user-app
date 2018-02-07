import React, { Component } from "react";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {login} from './elements/authActions'
import { Image, View,ScrollView, StatusBar,Dimensions,Alert,TouchableOpacity } from "react-native";

import { Container, Header, Button, Content, Form, Item,Icon,Frame, Input, Label,Text } from "native-base";
import styles from "./styles";
import I18n from '../../i18n/i18n';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const launchscreenBg = require("../../../img/bg-login.png");
const launchscreenLogo = require("../../../img/logo.png");
const buttonImage = require("../../../img/bg-button.png");

class Signup extends Component {
	constructor(props) {
  			super(props);
  }

	render() {
		return (
			<Container >
				{/* <StatusBar
					backgroundColor={'transparent'}
					translucent
				/> */}
				<StatusBar
					backgroundColor="#81cdc7"
				/>
				<Image source={launchscreenBg} style={styles.imageContainer}>
					<Content>
						<View style={styles.logoContainer}>
							<Image source={launchscreenLogo} style={styles.logo} />
						</View>
						<View style={{padding:20}}>
							<Item regular style={{borderColor:'#29416f',borderWidth:1,borderRadius:2,height:45}}>
								<Input placeholder='NAME' style={{textAlign:'center',color:'#29416f',fontSize:14}}/>
							</Item>
							<Item regular style={{borderColor:'#29416f',marginTop:10,borderWidth:1,borderRadius:2,height:45}}>
								<Input placeholder='EMAIL' keyboardType={'email-address'} style={{textAlign:'center',color:'#29416f',fontSize:14}} />
							</Item>
							<Item regular style={{borderColor:'#29416f',marginTop:10,borderWidth:1,borderRadius:2,height:45}}>
								<Input placeholder='PASSWORD' secureTextEntry={true} style={{textAlign:'center',color:'#29416f',fontSize:14}} />
							</Item>
							<Item regular style={{borderColor:'#29416f',marginTop:10,borderWidth:1,borderRadius:2,height:45}}>
								<Input placeholder='PHONE NUMBER' keyboardType={'numeric'} style={{textAlign:'center',color:'#29416f',fontSize:14,placeholderTextColor:'#29416f'}} />
							</Item>
							{/* <Button block style={{marginTop:10},styles.buttonStyle}>
								<Text>Sign Up</Text>
							</Button> */}
							{/* <View>
								<Image
								source={buttonImage}
								style={{  resizeMode: 'contain' }}
								>
								<Text>Sign Up</Text>
								</Image>
							</View> */}

							<Button transparent style={{height:70,marginTop:2}} >
								<Image source={buttonImage} style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',width:deviceWidth/1.3,height:55}} >
									<Text style={{color:'#fff',fontSize:20,marginTop:-10,height:30}}>SIGN UP</Text>
								</Image>

							</Button>
							<View style={{flexDirection:'row',justifyContent:'center',marginTop:-13}}>
								<Text>- OR -</Text>
							</View>
							<View style={{flexDirection:'row',justifyContent:'center',marginTop:5}}>
								<Button block transparent style={{borderWidth:1,borderColor:'#29416f',width:deviceWidth/1.3}}>
									<Text style={{color:'#29416f'}}>VIA FACEBOOK</Text>
								</Button>
							</View>
							<View style={{flexDirection:'row',justifyContent:'center',marginTop:5}}>
								<Button block transparent style={{borderWidth:1,borderColor:'#29416f',width:deviceWidth/1.3}}>
									<Text style={{color:'#29416f'}}>VIA GMAIL</Text>
								</Button>
							</View>

							<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10}}>
								<Text style={{color:'#252525'}}>Not a register member? </Text>
								<TouchableOpacity onPress={()=>this.props.navigation.navigate("Login")}>
									<Text style={{color:'#29416f'}}>LOGIN</Text>
								</TouchableOpacity>
							</View>




							{/* <Button transparent >
								<Image source={buttonImage} style={{width:50,backgroundColor:"#fff"}} />
								<Text>12 Likes</Text>
							</Button> */}


						</View>
						</Content>
				</Image>
			</Container>
		);
	}
}

Signup.propTypes = {
	auth : PropTypes.object.isRequired
}
const mapStateToProps = (state)=>{
	return {
		auth:state.auth
	}
}

const mapDispatchToProps = (dispatch)=>{
	return {
		login:(email,password)=>dispatch(login(email,password))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Signup);
