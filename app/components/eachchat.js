/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Text,
  View,
  AsyncStorage,
  BackAndroid
} from 'react-native';

import renderImages from '../fake/fakeImage';

const { width, height } = Dimensions.get('window');
const convo = []
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const iconStyle = { width:30, height:30, borderRadius:15, margin:5 };
const userIcon = { height:40, width:40, margin:5, borderRadius:20, backgroundColor:'#f8f8f8' };

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  
  socket.emit('listChat', { _id : this.state.user});
  _navigator.pop();
  return true;
});

export default class Chaty extends Component {
  constructor(props){
    super(props)

    this.state = {
      receiver : this.props.receiver ? this.props.receiver : null,
      datasource: ds.cloneWithRows([]),
      note: null,
      user : null,
      arr : []
    }
    _navigator = this.props.navigator;
    socket = this.props.socket;

    this._onFetch = this._onFetch.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange (rows) {
    this.setState({
      datasource : ds.cloneWithRows(rows),
      arr : rows
    });
  }

  componentDidMount() {
    let self = this;
    this._onFetch();
    socket.on('getDirectMsg', function (hasil){
      let sender = self.state.user;
      if (sender == hasil.sender || sender == hasil.receiver) {
        if (!self._calledComponentWillUnmount) {
          self.onChange(hasil.data);
        }
      }
    });

    this.onRealTime();
  }

  componentWillUnmount() {
    this.setState({
      note : null,
      user : null,
      arr : [],
      datasource : ds.cloneWithRows([])
    });
  }

  onRealTime () {
    var self = this;
    socket.on('directMsg', function (obj){
      let arr = self.state.arr;
      if (obj.data.receiver == self.state.user) {
        arr.splice(0,0,obj.data);
        self.setState({
          arr : arr,
          datasource : ds.cloneWithRows(arr)
        });
      }
    });
  }

  _onFetch () {
    AsyncStorage.getItem('session', (err, result) => {
      if (result != null ) {
        var obj = JSON.parse(result);
        let data = {
          sender : obj._id,
          receiver : this.state.receiver
        }
        this.setState({
          user : obj._id
        });
        socket.emit('getDirectMsg',data);
      }
    });
  }

  eachMessage(x, image){
    let sender = this.state.user;
    if(x.sender != sender){
      return (
        <View style={{ flexDirection:'row', alignItems:'flex-end', margin:5 }}>
          {
            renderImages(image, userIcon)
          }
          <View style={{ width:220, borderRadius:10, backgroundColor:'#f4f4f4', padding:10 }}>
            <Text style={{ fontSize:15, color:'#555', fontWeight:'600' }}>{x.msg}</Text>
          </View>
        </View>
      )
    } else {
        return (
          <View style={{ flexDirection:'row', alignSelf:'flex-end', alignItems:'flex-end', margin:5 }}>
            <View style={{ width:220, borderRadius:10, backgroundColor:'#00b499', padding:10 }}>
              <Text style={{ fontSize:15, color:'#fff', fontWeight:'600' }}>{x.msg}</Text>
            </View>
            <Image
              source ={require('../images/profile.jpg')}
              resizeMode="contain"
              style={userIcon}/>
          </View>
        );
    }
  }

  submitThis(){
    var sender = this.state.user;
    var note = this.state.note;
    if (note != '') {
      var obj = {
        sender : sender,
        msg : note,
        receiver : this.state.receiver,
      }
      var arr = this.state.arr;
      arr.splice(0,0,obj);
      socket.emit('directMsg',obj);
      this.setState({
        note: '',
        arr : arr,
        datasource : ds.cloneWithRows(arr)
      });
    }
  }

  render() {
    const { note } = this.state;
    return (
      <Image source={require('../images/background.jpg')} style={styles.container}>
        <View style={{ height:65, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#075e54', alignItems:'center', paddingTop:10 }}>
          <View style={{ flexDirection:'row', flex:1, alignItems:'center' }}>
            <TouchableOpacity onPress={() => {
              socket.emit('listChat', { _id : this.state.user});
              this.props.navigator.pop();
            }}>
              <Icon name="navigate-before" color='#fff' size={23} style={{ }} />
            </TouchableOpacity>
            {
              renderImages(1, iconStyle)
            }
            <Text style={{ color:'#fff', fontWeight:'600', margin:10, fontSize:15 }}>{this.props.name}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="call" color='#fff' size={23} style={{ padding:5 }} />
            <Icon name="attach-file" color='#fff' size={23} style={{ padding:5 }} />
            <Icon name="more-vert" color='#fff' size={23} style={{ padding:5 }} />
          </View>
        </View>

      <ListView
        enableEmptySections={true}
        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
        noScroll={true}
        style={{ flex:1, }}
        contentContainerStyle={{ justifyContent:'flex-end' }}
        dataSource={this.state.datasource}
        renderRow={(rowData) => this.eachMessage(rowData, 1)}/>
        
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:null,
    height:null,
    justifyContent:'space-between',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }, row:{
    flexDirection:'row'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
