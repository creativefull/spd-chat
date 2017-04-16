import React from 'react';

import {
	Text,
	View,
	StyleSheet,
	ListView,
	TouchableOpacity,
	TextInput,
	Image,
	AsyncStorage,
	Dimensions,
	BackAndroid
} from 'react-native';

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

const iconStyle = { width:30, height:30, borderRadius:15, margin:5 };
const userIcon = { height:40, width:40, margin:5, borderRadius:20, backgroundColor:'#f8f8f8' };
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const { width, height } = Dimensions.get('window');

import renderImages from '../fake/fakeImage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width:null,
		height:null,
		justifyContent:'space-between',
		backgroundColor: '#fff',
	}
});

class Broadcast extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			arr : [],
			dataSource: ds.cloneWithRows([]),
			note : '',
			user : null,
		};
		this.socket = this.props.socket;
		_navigator = this.props.navigator;
	}

	componentDidMount() {
		this._onFetch();
	}

	componentWillMount () {
		let self = this;
	}

	_onFetch () {
		AsyncStorage.getItem('session', (err, result) => {
			if (result != null ) {
				var obj = JSON.parse(result);
				this.setState({
					user : obj._id
				});
			}
		});
	}

	submitThis(){
		let sender = this.state.user;
		let note = this.state.note;
		if (note != '') {
			let arr = this.state.arr;
			let obj = {
				sender : sender,
				msg : note,
				receiver : this.props.arr_receiver,
				_id : this.props._id
			}
			this.socket.emit('broadMsg',obj);
			arr.push(obj);
			arr = arr.reverse();
			this.setState({
				note: '',
				arr : arr,
				dataSource : ds.cloneWithRows(arr)
			});
		}
	}

	_renderRow (rows) {
		let sender = this.state.user;
		if(rows.sender != sender){
			return (
				<View style={{ flexDirection:'row', alignItems:'flex-end', margin:5 }}>
					{ renderImages(1, userIcon) }
					<View style={{ width:220, borderRadius:10, backgroundColor:'#f4f4f4', padding:10 }}>
						<Text style={{ fontSize:15, color:'#555', fontWeight:'600' }}>{rows.msg}</Text>
					</View>
				</View>
			);
		} else {
			return (
				<View style={{ flexDirection:'row', alignSelf:'flex-end', alignItems:'flex-end', margin:5 }}>
					<View style={{ width:220, borderRadius:10, backgroundColor:'#00b499', padding:10 }}>
						<Text style={{ fontSize:15, color:'#fff', fontWeight:'600' }}>{rows.msg}</Text>
					</View>
					<Image
						source ={require('../images/profile.jpg')}
						resizeMode="contain"
						style={userIcon}/>
				</View>
			);
		}
	}

	render () {
		const { note } = this.state;
		return (
			<Image source={require('../images/background.jpg')} style={styles.container}>
				<View style={{ height:65, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#075e54', alignItems:'center', paddingTop:10 }}>
					<View style={{ flexDirection:'row', flex:1, alignItems:'center' }}>
						<TouchableOpacity onPress={() => this.props.navigator.pop()}>
							<Icon name="navigate-before" color='#fff' size={23} style={{ }} />
						</TouchableOpacity>
						<Text style={{ color:'#fff', fontWeight:'600', margin:10, fontSize:15 }}>{this.props.cout} recipients</Text>
					</View>
				</View>

				<ListView
					enableEmptySections={true}
					renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
					noScroll={true}
					style={{ flex:1, }}
					contentContainerStyle={{ justifyContent:'flex-end' }}
					dataSource={this.state.dataSource}
					renderRow={(rowData) => this._renderRow(rowData)}/>

				<View style={{ alignSelf:'flex-end', padding:10, height:60, width:width, borderTopWidth:1, borderColor:'#f3f3f3', backgroundColor:'#fff' }}>
					<TextInput
						ref = "input"
						style={{ flex:1, }}
						value={note}
						onChangeText={(note) => this.setState({ note })}
						onSubmitEditing={() => this.submitThis()}
						placeholder="Enter Your message here"/>
				</View>
			</Image>
		);
	}
}

module.exports = Broadcast;