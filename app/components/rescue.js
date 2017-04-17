import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ListView,
	Image,
	TouchableOpacity,
	AsyncStorage,
	TouchableHighlight,
	BackAndroid,
	ToastAndroid
} from 'react-native';

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import Icon from 'react-native-vector-icons/MaterialIcons';
import renderImages from '../fake/fakeImage';
import { images, data } from '../fake/fakeChatList';
import Empty from './empty';

const styles = StyleSheet.create({
	label : {
		justifyContent : 'center',
		marginRight : 50,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#1abc9c',
		// backgroundColor: '#2ecc71',
		// backgroundColor: '#075e75',
		right: 50,
	},
	labelIcon : {
		textAlign : 'center',
		justifyContent : 'center',
		fontWeight : 'normal'
	},
	buttonFloat : {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#2ecc71',
		position: 'absolute',
		bottom : 25,
		right: 10,
	},
	buttonIcon : {
		marginTop : 19,
		textAlign : 'center',
		justifyContent : 'center',
		fontWeight : 'normal'
	},
});

class Rescue extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			dataSource: ds.cloneWithRows([]),
			empty : false,
			arr : [],
			jumlah : 0,
			user : ''
		};

		this.socket = this.props.socket;
		_navigator = this.props.navigator;
	}

	componentDidMount() {
		this._onFetch();
		var self = this;
		this.socket.on('listContact', function (hasil){
			if (!self._calledComponentWillUnmount) {
				if (hasil.data.length != 0 && hasil.author == self.state.user) {
					self.setState({
						jumlah : hasil.data.length,
						dataSource : ds.cloneWithRows(hasil.data),
						empty : false,
					});
				} else {
					self.setState({
						empty : true,
					});
				}
			}
		});
	}

	componentWillMount () {
		let self = this;
		var no = 0;
		this.socket.on('createBroadcast', function (rows){
			if (no == 0) {
				self.props.navigator.push({
					id : 'broadcast',
					_id : rows._id,
					cout : self.state.arr.length,
					receiver : self.state.arr,
					referal : 'rescue'
				});
			}
			no = no + 1;
		});
	}

	componentWillUnmount() {
		this.setState({
		  arr : [],
		  dataSource : ds.cloneWithRows([]),
		  jumlah : 0,
		  user : ''
		});
	}

	_onFetch () {
		var self = this;
		AsyncStorage.getItem('session', (err, result) => {
			if (result != null ) {
				var obj = JSON.parse(result);
				this.setState({
					user : obj._id
				});
				this.socket.emit('listContact',{_id : obj._id});
			}
		});
	}

	_onSelected (row) {
		let arr_person = this.state.arr;
		let cek = arr_person.indexOf(row._id);
		if (cek === -1) {
			arr_person.push(row._id);
		} else {
			arr_person.splice(cek,1);
		}
		this.setState({
			arr : arr_person
		});
	}

	_renderRow (x) {
		var elementCentang;
		let arr_person = this.state.arr;
		let cek = arr_person.indexOf(x._id);
		if (cek !== -1 ) {
			elementCentang = (
				<View style = {styles.label}>
					<Icon name = "check" color = '#fff' size = {23} style = {styles.labelIcon} />
				</View>
			);
		}
		return (
			<TouchableOpacity
				activeOpacity = {0.8}
				onPress ={() => this._onSelected(x)}>
				<View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
					{ renderImages(1)}
					<View>
						<View style={{ flexDirection:'row', justifyContent:'space-between', width:280 }}>
							<Text style={{ marginLeft:15, fontWeight:'600' }}>{x._id}</Text>
						</View>
						<View style={{ flexDirection:'row', alignItems:'center' }}>
							<Text style={{ fontWeight:'400', color:'#333', marginLeft:15 }}>{x.time}</Text>
						</View>
					</View>
					{elementCentang}
				</View>
			</TouchableOpacity>
		);
	}

	render () {
		if (!this.state.empty) {
			return (
				<View style = {{flex : 1}} >
					<View style={{ height:65, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#075e54', alignItems:'center', paddingTop:10 }}>
						<View style={{ flexDirection:'row', flex:1, alignItems:'center' }}>
							<TouchableOpacity 
								activeOpacity = {0.8}
								onPress={() => this.props.navigator.pop()}>
								<Icon name="navigate-before" color='#fff' size={23} style={{ }} />
							</TouchableOpacity>
								<Text style={{ color:'#fff', fontWeight:'600', margin:10, fontSize:20}}>New Rescue </Text>
								<Text style = {{color:'#fff', fontSize:15}} >{this.state.arr.length} of {this.state.jumlah} selected</Text>
						</View>
					</View>

					<ListView
						enableEmptySections={true}
						dataSource={this.state.dataSource}
						renderRow={(rowData) => this._renderRow(rowData)}/>

					<TouchableHighlight
						onPress = {() => {
							let receiver = this.state.arr;
							if (receiver.length != 0 ) {
								this.socket.emit('createBroadcast',{
									author : this.state.user,
									receiver : this.state.arr
								});
							} else {
								ToastAndroid.show('minimal 2 contact di pilih ', ToastAndroid.SHORT);
							}
						}}
						underlayColor = "#ddd"
						activeOpacity = {0.8}
						style = {[styles.buttonFloat]}>
						<Icon
							name = {'check'}
							color = {'white'}
							style = {styles.buttonIcon}
							size = {25}/>
					</TouchableHighlight>
				</View>
			);
		} else {
			return (
				<Empty
					pesan = "Contact Masih Kosong !!!"/>
			);
		}
	}
}

module.exports = Rescue;