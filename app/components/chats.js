import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  ListView,
  Image,
  TouchableOpacity,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import {renderIcon} from '../fake/fakeImage';
import { images, data } from '../fake/fakeChatList';
import Empty from './empty';
import {API} from './api';
import io from 'socket.io-client';

const socket = io(API, {jsonp : false});
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Chats extends Component {
  constructor(props){
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
      empty : false,
      user : null,
    }
    this.socket = this.props.socket;
  }

  componentDidMount() {
    this._onFetch();
    var self = this;
    console.log("Component Did mount")
    self.socket.emit("listChat", {_id : this.state.user})
    self.socket.on('listChat', function (hasil){
      console.log("From didmount", hasil);
      if (hasil.author == self.state.user) {
        if (hasil.data.length != 0) {
          self.setState({
            dataSource : ds.cloneWithRows(hasil.data),
            empty : false,
          });
        } else {
          self.setState({
            empty : true
          });
        }
      }
    });
  }

  componentWillUnmount() {
    console.log("Component Will Unmount");
    socket.removeListener('listChat', (hasil) => {
      console.log(hasil);
    })
    // this.setState({
    //   dataSource : ds.cloneWithRows([]),
    //   empty : false,
    //   user : null
    // });
  }

  componentWillMount() {
    socket.off("listChat", (hasil) => {
      console.log("Will unmount", hasil)
    })
  }
  _onFetch () {
    var self = this;
    AsyncStorage.getItem('session', (err, result) => {
      if (result != null ) {
        var obj = JSON.parse(result);
        this.setState({
          user : obj._id,
        });
        self.socket.emit('listChat',{_id :  obj._id});
        setInterval(() => {
          self.socket.emit('listChat',{_id :  obj._id});
        }, 10000);
      }
    });
  }

  eachMessage(x){
    var name = x.name;
    return (
      <TouchableOpacity onPress ={() => {this.props.navigator.push({id:'chat', image:1, name: name , receiver : x.name }) }}>
        <View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
          {
            renderIcon(10)
          }
          <View>
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:280 }}>
              <Text style={{ marginLeft:15, fontWeight:'600' }}>{x.name}</Text>
            </View>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <Text style={{ fontWeight:'400', color:'#333', marginLeft:15 }}>{x.sender == this.state.user ? "Anda : " : ""}
                <Text style={{color : '#089', fontWeight : 'bold'}}>
                   {x.message}
                </Text>
              </Text>
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
          pesan = "Chat Masih Kosong !!!"/>
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
