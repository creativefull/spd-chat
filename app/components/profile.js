import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconA from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

class Profile extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{ height:65, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#2980B9', alignItems:'center', paddingTop:10 }}>
                    <View style={{ flexDirection:'row', flex:1, alignItems:'center' }}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigator.pop();
                        }}>
                        <Icon name="navigate-before" color='#fff' size={23} style={{ }} />
                        </TouchableOpacity>
                        <Text style={{ color:'#fff', fontWeight:'600', margin:10, fontSize:15 }}>Profile</Text>
                    </View>
                </View>

                <View style={styles.list}>
                    <IconA size={120} name="user" color="#2980B9"/>
                    <Text style={{fontSize: 20}}>Shodiqul Muzaki</Text>
                    <Text style={{fontSize: 20}}>Jalan Kene Kono Adoh e poll</Text>
                    <Text style={{fontSize: 15}}>mshodiqul@gmail.com</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  heading : {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    flexDirection : 'row'
  },
  list: {
    flex : 1,
    padding : 20,
    alignItems: 'center',
    justifyContent : 'center'
  },
  btncontrol : {
      padding: 10,
      paddingLeft : 20,
      paddingRight : 20,
      backgroundColor: '#19B5FE',
      flexDirection: 'column'
  }
});

module.exports = Profile;