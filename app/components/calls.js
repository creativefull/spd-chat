/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import R from 'ramda';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  View,
  AsyncStorage,
  BackAndroid
} from 'react-native';

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

import Empty from './empty';
import Icon from 'react-native-vector-icons/FontAwesome';
import {renderIcon} from '../fake/fakeImage';

const images = R.range(1, 11).map(i => i);

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Calls extends Component {
  constructor(props){
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
      empty : false,
      user : null,
    }
    this.socket = this.props.socket;
    _navigator = this.props.navigator;
  }

  componentDidMount() {
    this._onFetch();
    var self = this;
    this.socket.on('listBroad', function (hasil){
      if (hasil.author == self.state.user) {
        if (hasil.data.length != 0) {
          self.setState({
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
  componentDidUpdate() {
    // this._onFetch();
    var self = this;
    this.socket.on('listBroad', (hasil) => {
      if (hasil.author == self.state.user) {
        if (hasil.data.length != 0) {
          self.setState({
            dataSource : ds.cloneWithRows(hasil.data),
            empty : false,
          });
        } else {
          self.setState({
            empty : true,
          });
        }
      }
    })
  }

  _onFetch () {
    var self = this;
    AsyncStorage.getItem('session', (err, result) => {
      if (result != null ) {
        var obj = JSON.parse(result);
        this.setState({
          user : obj._id
        });
        this.socket.emit('listBroad',{_id : obj._id});
      }
    });
  }

  eachMessage(x){
    let iconBahaya = 0;
    // alert(x.type);
    if (x.type == "kebarakaran") {
      iconBahaya = 1;
    } else if (x.type == "kemalingan") {
      iconBahaya = 2;
    } else if (x.type == "bencana alam") {
      iconBahaya = 3;
    } else if (x.type == "perampokan") {
      iconBahaya = 4;
    } else {
      iconBahaya = 5;
    }
    return (
      <View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
        {
          renderIcon(iconBahaya)
        }
        <View>
          <View style={{ flexDirection:'row', justifyContent:'space-between', width:260 }}>
          <Text style={{ marginLeft:15, fontWeight:'600', color:'#222' }}>{x.receiver.toString()}</Text>
        </View>
        <View style={{ flexDirection:'row', alignItems:'center', marginLeft:15, marginRight:5 }}>
          <Text style={{ fontWeight:'400', color:'#666', fontSize:12 }}>{x.messages}</Text></View>
        </View>
      </View>
    )
  }


  render() {
    var element;
    if (!this.state.empty) {
      element = (
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.eachMessage(rowData)}/>
      );
    } else {
      element = (
        <Empty
          pesan = "Rescue Masih Kosong !!!"/>
      );
    }
    return (
      <View style={{ flex:1 }}>
        {element}

        <TouchableHighlight
          onPress = {() => {
            this.props.navigator.push({
              id : 'rescue',
              type : 'kebarakaran'
            });
          }}
          underlayColor = "#ddd"
          activeOpacity = {0.8}
          style = {[styles.buttonFloat]}>
          {
            renderIcon(1)
          }
        </TouchableHighlight>
        <TouchableHighlight
          onPress = {() => {
            this.props.navigator.push({
              id : 'rescue',
              type : 'kemalingan'
            });
          }}
          underlayColor = "#ddd"
          activeOpacity = {0.8}
          style = {[styles.buttonFloat, {bottom : 90}]}>
          {
            renderIcon(2)
          }
        </TouchableHighlight>
        <TouchableHighlight
          onPress = {() => {
            this.props.navigator.push({
              id : 'rescue',
              type : 'perampokan'
            });
          }}
          underlayColor = "#ddd"
          activeOpacity = {0.8}
          style = {[styles.buttonFloat, {bottom : (80*2)}]}>
            {
              renderIcon(3)
            }
        </TouchableHighlight>
        <TouchableHighlight
          onPress = {() => {
            this.props.navigator.push({
              id : 'rescue',
              type : 'other'
            });
          }}
          underlayColor = "#ddd"
          activeOpacity = {0.8}
          style = {[styles.buttonFloat, {bottom : (75*3)}]}>
          {
            renderIcon(5)
          }
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonFloat : {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    // backgroundColor: '#0099CC',
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
