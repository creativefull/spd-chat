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

import Empty from './empty';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Contacts extends Component {
    constructor(props){
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
      user : null,
    }

    this.socket = this.props.socket;
  }

  componentDidMount() {
    this._onFetch();
    var self = this;
    this.socket.on('listContact', function (hasil){
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

  _onFetch () {
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

  // <Text style={{ fontWeight:'400', color:'#666', fontSize:12, marginLeft:15 }}>{x.message}</Text>
  eachMessage(x){
    var name = x.first_name+" "+ x.last_name;
    return (
      <TouchableOpacity
        onPress ={() => {this.props.navigator.push({id:'chat', image:1, name: name , receiver : x._id}) }}>
        <View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
          <Image source={require('../images/eminem.jpg')} style={{ borderRadius:30, width:60, height:60 }} resizeMode='contain' />
          <View>
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:280 }}>
              <Text style={{ marginLeft:15, fontWeight:'600', color:'#222', fontSize:15 }}>{x._id}</Text>
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
    if (!this.state.empty) {
      return (
        <View style={{ flex:1 }}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.eachMessage(rowData)}/>
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
