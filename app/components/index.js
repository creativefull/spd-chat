import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Navigator,
  View,
  AsyncStorage
} from 'react-native';
import io from 'socket.io-client';

import Home from './threeTabs'
import Chat from './eachchat'
import Login from './login'
import {API} from './api'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.socket = io(API, {jsonp : false});
  }

  _onCheckSession() {
    let loginIn = false;
    let firstNav = {};
    AsyncStorage.getItem('session', (err, results) => {
      if (results == null ) {
        loginIn = false;
        firstNav = {
          id : 'login',
          title : '',
        }
      } else {
        loginIn = true;
        firstNav = {
          id : 'home',
          title : ''
        }
      }
      this.setState({
        loginIn : loginIn,
        loaded : true,
        obj : firstNav,
      });
    });
  }

  componentWillMount() {
    this._onCheckSession();
  }

  componentDidMount() {
  }

  renderScene(route, navigator) {
    const {state,actions} = this.props;
    const routeId = route.id;

    if (routeId === 'home') {
      return (
        <Home
          {...this.props}
          socket={this.socket}
          navigator={navigator}/>
      );
    }

    if (routeId === 'chat') {
      return (
        <Chat
          {...this.props}
          image={route.image}
          socket={this.socket}
          name={route.name}
          receiver = {route.receiver}
          navigator={navigator} />
      );
    }

    if (routeId === 'login') {
      return (
        <Login
          {...this.props}
          _onCheckSession = {this._onCheckSession}
          socket={this.socket}
          navigator={navigator}/>
      )
    }
  }

  render() {
    return (
      <View style={{ flex:1 }}>
        <Navigator
          style={{ flex:1 }}
          ref={'NAV'}
          initialRoute={{ id: 'home', name: 'login' }}
          renderScene={this.renderScene.bind(this)}/>
      </View>
    )
  }
}
