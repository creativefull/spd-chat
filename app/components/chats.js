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

import renderImages from '../fake/fakeImage';
import { images, data } from '../fake/fakeChatList';
import Empty from './empty';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Chats extends Component {
  constructor(props){
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
      empty : false,
    }
    this.socket = this.props.socket;
  }

  componentDidMount() {
    this._onFetch();
  }

  componentWillMount() {
    var self = this;
    // this._onFetch();
    this.socket.on('listChat', function (hasil){
      if (hasil.length != 0) {
        self.setState({
          dataSource : ds.cloneWithRows(hasil),
          empty : false,
        });
      } else {
        self.setState({
          empty : true
        });
      }
    });
  }

  _onFetch () {
    AsyncStorage.getItem('session', (err, result) => {
      if (result != null ) {
        var obj = JSON.parse(result);
        var self = this;
        this.socket.emit('listChat',obj);
      }
    });
  }

  eachMessage(x){
    var name = x.first_name+" "+ x.last_name;
    return (
      <TouchableOpacity onPress ={() => {this.props.navigator.push({id:'chat', image:1, name: name , receiver : x._id}) }}>
        <View style={{ alignItems:'center', padding:10, flexDirection:'row', borderBottomWidth:1, borderColor:'#f7f7f7' }}>
          {
            renderImages(1)
          }
          <View>
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:280 }}>
              <Text style={{ marginLeft:15, fontWeight:'600' }}>{x.first_name} {x.last_name}</Text>
            </View>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <Text style={{ fontWeight:'400', color:'#333', marginLeft:15 }}>{x.messages}</Text>
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
