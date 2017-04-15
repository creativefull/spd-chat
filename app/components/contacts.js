/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ListView,
  Image,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const image1 = require('../images/geasy.jpg')
const image2 = require('../images/eminem.jpg')
const image3 = require('../images/kyle.jpg')
const image4 = require('../images/devon.jpg')
const data = [{
  "id": 1,
  "first_name": "G Eazy",
  "message": "I just need to be alone",
  "image": image1
}, {
  "id": 2,
  "first_name": "Eminem",
  "message": "Fuck off",
  "image": image2
}, {
  "id": 2,
  "first_name": "Kyle",
  "message": "Lame NI**As hide your girls",
  "image": image3
}, {
  "id": 2,
  "first_name": "Devon Baldwin",
  "message": "Where the Avacados at tho?",
  "image": image4
}]
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Contacts extends Component {
    constructor(props){
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
    }

    this.socket = this.props.socket;
  }

  componentDidMount() {
    this._onFetch();
  }

  componentWillMount() {
    var self = this;
    this.socket.on('listContact', function (hasil){
      self.setState({
        dataSource : ds.cloneWithRows(hasil)
      });
    });
  }

  _onFetch () {
    AsyncStorage.getItem('session', (err, result) => {
      if (result != null ) {
        var obj = JSON.parse(result);
        this.socket.emit('listContact',{_id : obj._id});
      }
    });
  }

  // <Text style={{ fontWeight:'400', color:'#666', fontSize:12, marginLeft:15 }}>{x.message}</Text>
  eachMessage(x){
    return (
      <TouchableOpacity>
        <View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
          <Image source={require('../images/eminem.jpg')} style={{ borderRadius:30, width:60, height:60 }} resizeMode='contain' />
          <View>
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:280 }}>
              <Text style={{ marginLeft:15, fontWeight:'600', color:'#222', fontSize:15 }}>{x.first_name} {x.last_name}</Text>
              <Text style={{ fontWeight:'200', color:'#777', fontSize:13 }}>MOBILE</Text>
            </View>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ flex:1 }}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.eachMessage(rowData)}
        />
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
});
