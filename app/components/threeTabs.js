/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import Calls from './calls'
import Chats from './chats'
import Contacts from './contacts'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import io from 'socket.io-client';
import {API} from './api';
const PushNotification = require('react-native-push-notification');
PushNotification.configure({
  onNotification: (notification) => {
  },
  requestPermissions: true,
  popInitialNotification: true
})
export default class ThreePanels extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      user : null
    };
    this.socket = io(API, {jsonp : false});
  }

  componentDidMount() {
    this._onFetch();
  }
  _onLogout () {
    var self = this;
    AsyncStorage.removeItem('session', (err) => {
      this.setState({
        user : null
      })
      self.props.navigator.push({
        id : 'login'
      })
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
			}
		});
	}

  componentWillMount() {
    this.socket.on('new rescue', (data) => {
      if (data.receiver.indexOf(this.state.user) != -1) {
        PushNotification.localNotification({
          id : 0,
          ticker : "Bahaya : " + data.type,
          title : "Ada Bahaya",
          message : data.author + " butuh bantuan dari bahaya " + data.type,
          playSound : true,
          soundName: 'default',
          vibrate : true,
          vibration : 600
        })
      }
    })
  }
  selectMenu(value) {
    if (value == 1) {
      this.props.navigator.push({
        id : 'profile'
      })
    } else if (value == 2) {
      // alert('logout')
      this._onLogout();
    }
  }
  render() {
    return (
      <View style={{ flex:1 }}>
        <MenuContext style={{flex : 1}}>
          <View style ={styles.topBit}>
            <Text style={styles.logo}>Sadulur</Text>
            <View style={styles.row}>
              <Menu onSelect={(value) => { this.selectMenu(value) }} style={{marginRight : 20}}>
                <MenuTrigger>
                  <Icon name="list" size={30} color="#FFF"/>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption value={1}>
                    <Text>Profile</Text>
                  </MenuOption>
                  <MenuOption value={2}>
                    <Text>Logout</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </View>

          <ScrollableTabView
            tabBarUnderlineColor="#fff"
            tabBarBackgroundColor ='#2980B9'
            tabBarActiveTextColor="#fff"
            tabBarInactiveTextColor="#88b0ac">
            <Calls tabLabel="TOLONG" {...this.props}/>
            <Chats tabLabel="FORUM" {...this.props} />
            <Contacts tabLabel="KONTAK" {...this.props}/>
          </ScrollableTabView>
        </MenuContext>
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

  logo:{
    color:'#fff',
    fontSize:23,
    margin:10,
    marginLeft:20,
    fontWeight:'500',
  },

  row:{
    flexDirection:'row'
  },

  topBit:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:15,
    backgroundColor:'#2980B9',
    justifyContent:'space-between'
  }
});
