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
  AsyncStorage
} from 'react-native';

import renderImages from '../fake/fakeImage';

const { width, height } = Dimensions.get('window');
const convo = []
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const iconStyle = { width:30, height:30, borderRadius:15, margin:5 };
const userIcon = { height:40, width:40, margin:5, borderRadius:20, backgroundColor:'#f8f8f8' };

export default class Chaty extends Component {
  constructor(props){
    super(props)

    this.state = {
      receiver : this.props.receiver ? this.props.receiver : '',
      datasource: ds.cloneWithRows([]),
      note: "",
      user : '',
      arr : []
    }
    this.socket = this.props.socket;
  }

  componentDidMount() {
    this._onFetch();
  }

  componentWillMount() {
    var self = this;
    this.socket.on('getDirectMsg', function (hasil){
      // console.log(hasil);
      self.setState({
        datasource : ds.cloneWithRows(hasil),
        arr : hasil
      });
    });

    this.socket.on('directMsg', function (obj){
      let arr = self.state.arr;
      arr.push(obj.data);
      arr = arr.reverse();
      console.log(arr);
      self.setState({
        arr : arr,
        datasource : ds.cloneWithRows(arr)
      })
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
        this.socket.emit('getDirectMsg',data);
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
    let sender = this.state.user;
    let note = this.state.note;
    if (note != '') {
      let obj = {
        sender : sender,
        msg : note,
        receiver : this.state.receiver
      }
      this.socket.emit('directMsg',obj);
      this.setState({
        note: ''
      });
    }
  }

  similator(){
    convo.reverse();
    convo.push({person:2, note:"When are we gonna hangout Sam!!!!"})
    this.setState({
      datasource: ds.cloneWithRows(convo.reverse())
    })
  }

  render() {
    const { image } = this.props;
    const { note } = this.state;
    return (
      <Image source={require('../images/background.jpg')} style={styles.container}>
        <View style={{ height:65, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#075e54', alignItems:'center', paddingTop:10 }}>
          <View style={{ flexDirection:'row', flex:1, alignItems:'center' }}>
            <TouchableOpacity onPress={() => this.props.navigator.pop()}>
              <Icon name="navigate-before" color='#fff' size={23} style={{ }} />
            </TouchableOpacity>
            {
              renderImages(image, iconStyle)
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
        renderRow={(rowData) => this.eachMessage(rowData, image)}/>
        
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
