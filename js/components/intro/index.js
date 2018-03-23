import React, { Component } from "react";
import { Image, View, StatusBar, Dimensions, StyleSheet, ImageBackground, AsyncStorage } from "react-native";
import { Container, Button, H3, Text, Header, Title, Body, Left, Right, Grid } from "native-base";
// import ImageSlider from 'react-native-image-slider';
import Swiper from 'react-native-swiper';
import styles from './styles';
import api from '../../api';
import I18n from '../../i18n/i18n';




const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const img1 = require('../../../img/splash-bg2.png');
const launchscreenBg = require("../../../img/splash.png");
const logo = require("../../../img/logo22.png");
const imageht = (deviceHeight - 88);

class Intro extends Component {
	constructor(props) {
		super(props);
		this.props
		this.state = {
			position: 1,
			interval: null,
			slidFlag: false,
			sliderArray: [],
		};
	}

	componentWillMount() {
		AsyncStorage.setItem("IsSliderShown", "true").then((res)=>{
			
		})
		this.setState({
			interval: setInterval(() => {
				this.setState({ position: this.state.position === 2 ? 0 : this.state.position + 1 });
			}, 2000)
		});
		api.post('IntroSliders/getSliders', { type: 'User' }).then(res => {
			this.setState({
				sliderArray: res.response,
				slidFlag: true
			});
			console.log('hi', res.response);


		}).catch((err) => {
			this.setState({ loader: false })
			Alert.alert('Wrong OTP.')
		})
	}

	componentWillUnmount() {
		clearInterval(this.state.interval);
	}


	renderSlides() {

		const { slides } = this.state

		return (
			<Swiper showsButtons={false} loop={true} autoplay={true}
				autoplayTimeout={2.5} index={0}>
				{this.state.sliderArray.map((slide, index) => {
					return (
						<View key={slide.id}>
							<Image source={logo} style={styles.imageLogo} />
							<Text style={styles.title}>data</Text>
							<Text style={styles.text}>data</Text>
						</View>
					)
				})}
			</Swiper>
		)
	}
	// render() {
	// 	let slideItemall;
	// 	let slideItem = (
	// 		this.state.sliderArray.map((data, key) => (
	// 			<Image style={styles.slide} source={img1} key={data.id}>
	// 				<Image source={logo} style={styles.imageLogo} />
	// 				<Text style={styles.title}>{data.name}</Text>
	// 				<Text style={styles.text}>{data.description}</Text>
	// 			</Image>
	// 		)
	// 		)
	// 	)
	// 	return (
	// 		<Container>
	// 			{/* <Swiper
	// 				style={styles.wrapper}
	// 				autoplay={true}
	// 				autoplayTimeout={2.5}
	// 				dotColor={'#81cdc7'}
	// 				showsButtons={false}
	// 				activeDotColor={'#1e3768'}
	// 			>
	// 				{slideItem}

	// 			</Swiper> */}
	// 				{/* <Image style={styles.slide} source={img1}>
	// 					<Image source={logo} style={styles.imageLogo} />
	// 					<Text style={styles.title}>data</Text>
	// 					<Text style={styles.text}>data.description</Text>
	// 				</Image>
	// 				<Image style={styles.slide} source={img1}>
	// 					<Image source={logo} style={styles.imageLogo} />
	// 					<Text style={styles.title}>data</Text>
	// 					<Text style={styles.text}>data</Text>
	// 				</Image>
	// 				<Image style={styles.slide} source={img1}>
	// 					<Image source={logo} style={styles.imageLogo} />
	// 					<Text style={styles.title}>data</Text>
	// 					<Text style={styles.text}>data</Text>
	// 				</Image> */}

	// 			{/* <Swiper  autoplay={true}
	// 				autoplayTimeout={5}>
	// 				{this.state.sliderArray.map((item, key) => {
	// 					return (
	// 						<View key={key} style={styles.slide}>
	// 							<Text style={styles.title}>{item.name}</Text>
	// 						</View>
	// 					)
	// 				})}
	// 			</Swiper> */}
	// 			{/* <View style={{
	// 				paddingLeft: 10, paddingRight: 10, paddingTop: 10,
	// 				paddingBottom: 10
	// 			}}>
	// 				<Button full style={{ backgroundColor: '#81cdc7', marginTop: 0 }} onPress={() => this.props.navigation.navigate('Category')} ><Text>Book Now</Text></Button>
	// 			</View> */}
	// 			<View style={{ flex: 1 }}>
	// 				{this.renderSlides()}
	// 			</View>
	// 		</Container>

	// 	);
	// }

	render() {
		if (this.state.sliderArray.length == 0) {

			return (
				<Container>
					<Container>
						<Image source={launchscreenBg} style={styles.slide}>
						</Image>
					</Container>
				</Container>
			)
		}
		else {
			return (
				<Container >
					<Swiper
					style={styles.wrapper}
					loop={true}
					autoplay={true}
					autoplayTimeout={10}
					dotColor={'#81cdc7'}
					activeDotColor={'#1e3768'}

					>

						{/* <Image style={styles.slide} source={img1}>
							<Image source={logo} style={styles.imageLogo} />
							<Text style={styles.title}>data</Text>
							<Text style={styles.text}>data.description</Text>
						</Image>
						<Image style={styles.slide} source={img1}>
							<Image source={logo} style={styles.imageLogo} />
							<Text style={styles.title}>data</Text>
							<Text style={styles.text}>data</Text>
						</Image>
						<Image style={styles.slide} source={img1}>
							<Image source={logo} style={styles.imageLogo} />
							<Text style={styles.title}>data</Text>
							<Text style={styles.text}>data</Text>
						</Image> */}
						{
							this.state.sliderArray.map((item, key) => {
								return (
									<ImageBackground key={key} source={{ uri: item.image_url }} style={styles.slide}>
										<Image source={logo} style={styles.imageLogo} />
										<Text style={styles.title}>{item.name}</Text>
										<Text style={styles.text}>{item.description}</Text>
									</ImageBackground>
								)
							})
						}

					</Swiper>
					<View style={{
					paddingLeft: 10, paddingRight: 10, paddingTop: 10,
					paddingBottom: 10
				}}>
						<Button full style={{ backgroundColor: '#81cdc7', marginTop: 0 }} onPress={() => this.props.navigation.navigate('Category')} ><Text>{I18n.t('book_now')}</Text></Button>
				</View>

				</Container>
			);
		}

	}
}

export default Intro;
