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

export default class ThreePanels extends Component {

  constructor(props) {
    super(props);
  
    this.state = {};
  }

  _onLogout () {
    
  }

  render() {
    return (
      <View style={{ flex:1 }}>
        <MenuContext style={{flex : 1}}>
          <View style ={styles.topBit}>
            <Text style={styles.logo}>Sadulur</Text>
            <View style={styles.row}>
              <Menu onSelect={(value) => console.log(value)} style={{marginRight : 20}}>
                <MenuTrigger>
                  <Icon name="list" size={30} color="#FFF"/>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption value={1}>
                    <Text>Profile</Text>
                  </MenuOption>
                  <MenuOption value={1}>
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
