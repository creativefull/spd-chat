import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Navigator,
  View
} from 'react-native';
import io from 'socket.io-client';
import SplashScreen from 'react-native-splash-screen'

import Home from './threeTabs'
import Chat from './eachchat'
import Login from './login'
import {API} from './api'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.socket = io(API, {jsonp : false})
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
          navigator={navigator}/>
      );
    }

    if (routeId === 'chat') {
      return (
        <Chat
          {...this.props}
          image={route.image}
          name={route.name}
          navigator={navigator} />
      );
    }

    if (routeId === 'login') {
      return (
        <Login
          {...this.props}
          socket={this.socket}
          navigator={navigator}
        />
      )
    }
  }

  render() {
    return (
      <View style={{ flex:1 }}>
        <Navigator
          style={{ flex:1 }}
          ref={'NAV'}
          initialRoute={{ id: 'login', name: 'login' }}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    )
  }
}
