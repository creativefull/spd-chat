import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Navigator,
  View,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import io from 'socket.io-client';

import Home from './threeTabs';
import Chat from './eachchat';
import Login from './login';
import Register from './register';
import Rescue from './rescue';
import Broadcast from './broadcast';
import {API} from './api';

const styles = StyleSheet.create({
  container : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4885ed',
  },
  rowSpinLarge : {
    position : 'absolute',
    justifyContent : 'center',
    top : 0,
    bottom : 0,
    left : 0,
    right : 0,
  },
});

export default class Index extends Component {
  constructor(props){
    super(props)
    this.socket = io(API, {jsonp : false});
    this.state = {
      loaded : true,
      obj : {
        id : ''
      }
    }
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
        loaded : false,
        obj : firstNav,
      });
    });
  }

  componentWillMount() {
    this._onCheckSession();
  }

  componentDidMount() {
  }

  renderLoadingView () {
    return (
      <View style = {styles.container}>
        <View style = {styles.rowSpinLarge} >
          <ActivityIndicator
            style = {{ flex : 1}}
            animating = {true}
            color = {'#fafafa'}
            size = "large"/>
        </View>
      </View>
    )
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

    if (routeId === "rescue") {
      return (
        <Rescue
          {...this.props}
          socket = {this.socket}
          navigator = {navigator}/>
      );
    }

    if (routeId === "broadcast") {
      return (
        <Broadcast
          {...this.props}
          socket = {this.socket}
          cout = {route.cout}
          arr_receiver = {route.receiver}
          _id = {route._id}
          navigator = {navigator}/>
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

    if (routeId === "register") {
      return (
        <Register
          {...this.props}
          socket={this.socket}
          navigator={navigator}/>
      );
    }
  }

  render() {
    if (this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={{ flex:1 }}>
        <Navigator
          style={{ flex:1 }}
          ref={'NAV'}
          initialRoute={this.state.obj}
          renderScene={this.renderScene.bind(this)}/>
      </View>
    )
  }
}
