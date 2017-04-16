import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableHighlight,
	AsyncStorage,
	BackAndroid
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator.getCurrentRoutes().length === 1  ) {
		return false;
	}
	_navigator.pop();
	return true;
});

const styles = StyleSheet.create({
	container : {
		flex: 1,
		// justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2980B9',
	},
	inputcontrol : {
		height : 40,
		marginBottom : 10,
		backgroundColor: '#D5E5E6',
		width : 300
	},
	btncontrol : {
		padding: 10,
		paddingLeft : 20,
		paddingRight : 20,
		backgroundColor: '#19B5FE',
		flexDirection: 'column'
	},
	titleApp : {
		marginTop : 10,
		fontSize : 40,
		color : '#FFF',
	},
	subTitle : {
		fontSize : 15,
		color: '#FAFAFA',
		marginBottom: 10
	},
});

class Register extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			visible : false,
			pesan : '',
			empty : false,
			first_name : '',
			last_name : '',
			username : '',
			password : '',
			email : '',
		}
		_navigator = this.props.navigator;
		this.socket = this.props.socket
	}

	componentWillMount () {
		var self = this;
		this.socket.on('register', function (data){
			if (data.status == 200 ) {
				self.props.navigator.pop();
			} else {
				self.setState({
					visible : false,
					empty : true,
					pesan : data.msg,
				});
			}
		});
	}

	render () {
		return (
			<View style = {styles.container}>
				<Spinner
					color = {'#2980b9'}
					visible = {this.state.visible} />
				<Text style={styles.titleApp}>Sadulur</Text>
				<Text style={styles.subTitle}>Sign Up Application</Text>
				<View style = {{alignItems : 'center'}} >
					<Text style = {{color : 'red', marginBottom : 10}} > {this.state.pesan} </Text>
				</View>
				<TextInput
					style={[styles.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
					underlineColorAndroid="transparent"
					placeholder="First Name"
					value = {this.state.first_name}
					onChangeText={(text) => this.setState({first_name : text})}/>
				<TextInput
					style={[styles.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
					underlineColorAndroid="transparent"
					placeholder="Last Name"
					value = {this.state.last_name}
					onChangeText={(text) => this.setState({last_name : text})}/>
				<TextInput
					style={[styles.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
					underlineColorAndroid="transparent"
					placeholder="Username"
					value = {this.state.username}
					onChangeText={(text) => this.setState({username : text})}/>
				<TextInput
					style={[styles.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
					underlineColorAndroid="transparent"
					secureTextEntry={true}
					placeholder="Password"
					value = {this.state.password}
					onChangeText={(text) => this.setState({password : text})}/>
				<TextInput
					style={[styles.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
					underlineColorAndroid="transparent"
					placeholder="Email"
					value = {this.state.email}
					onChangeText={(text) => this.setState({email : text})}/>
				<TouchableHighlight
					onPress = {() => this._onRegister()}
					style={styles.btncontrol}>
					<Text style={{fontSize: 20, color:'#FFF'}}>Sign Up</Text>
				</TouchableHighlight>
			</View>
		);
	}

	_onRegister () {
		this.setState({
			visible : true,
			empty : false,
			pesan : '',
		});
		let data = {...this.state};
		if (data.username == '' || data.password == '' || data.first_name == '' || data.last_name == '' || data.email == '') {
			this.setState({
				visible : false,
				empty : true,
				pesan : 'data masih ada yang kosong !!!',
			});
		} else {
			this.socket.emit('register', {
				first_name : data.first_name,
				last_name : data.last_name,
				email : data.email,
				username : data.username,
				password : data.password
			});
		}
	}
}

module.exports = Register;