
import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity} from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from '../reducers';
import Components from '../components/';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
import BackgroundJob from 'react-native-background-job';
import io from 'socket.io-client';
import {API} from '../components/api';
const PushNotification = require('react-native-push-notification');
PushNotification.configure({
  onNotification: (notification) => {
  },
  requestPermissions: true,
  popInitialNotification: true
})

const backgroundJob = {
    jobKey: "notifRescue",
    job: () => {
      let socket = io(API, {jsonp : false});
      socket.on('new rescue', (data) => {
        if (data.receiver.indexOf(this.state.user) != -1) {
          PushNotification.localNotification({
            id : 0,
            ticker : "Bahaya : " + data.type,
            title : "Ada Bahaya",
            message : data.author + " butuh bantuan dari bahaya " + data.type,
            playSound : true,
            soundName: 'default',
            vibrate : true,
            vibration : 10000
          })
        }
      })      
    }
};
BackgroundJob.cancelAll();
BackgroundJob.register(backgroundJob);

export default class Index extends Component {
  componentDidMount() {
    var backgroundSchedule = {
      jobKey: "notifRescue",
      timeout: 10000,
      alwaysRunning : true,
      notificationTitle : "Sadulur",
      notificationText : "Terhubung",
      warn : false,
      period: 1000
    }

    BackgroundJob.schedule(backgroundSchedule);
  }
  render() {
    return (
      <View
       style={{ flex:1 }}>
       <StatusBar barStyle="light-content" />
       <Provider store={store}>
        <Components/>
       </Provider>
      </View>
    );
  }
}
