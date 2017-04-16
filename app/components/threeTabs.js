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
  View
} from 'react-native';
import Calls from './calls'
import Chats from './chats'
import Contacts from './contacts'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

export default class ThreePanels extends Component {

  _onLogout () {
    console.log('tes');
  }

  render() {
    return (
      <View style={{ flex:1 }}>
        <View style ={styles.topBit}>
          <Text style={styles.logo}>Sedulur</Text>
          <View style={styles.row}>
            <Icon name = "search" color = '#fff' size = {23} style = {{ padding:5 }} />
            <Icon name = "chat" color = '#fff' size = {23} style = {{ padding:5 }} />
            <MenuContext style = {[{ flex: 1 }]} ref="MenuContext">
              <Menu
                onSelect = {(value) => this._onLogout()}>
                <MenuTrigger>
                  <Icon name = "more-vert" color = '#fff' size = {23} style = {{ padding:5 }} />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption value = {1}>
                    <Text>Logout</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </MenuContext>
          </View>
        </View>
        <ScrollableTabView
          tabBarUnderlineColor="#fff"
          tabBarBackgroundColor ='#075e54'
          tabBarActiveTextColor="#fff"
          tabBarInactiveTextColor="#88b0ac">
          <Calls tabLabel="RESCUE" {...this.props}/>
          <Chats tabLabel="CHAT" {...this.props} />
          <Contacts tabLabel="CONTACTS" {...this.props}/>
        </ScrollableTabView>
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
    backgroundColor:'#075e54',
    justifyContent:'space-between'
  }
});
