import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    BackAndroid,
    AsyncStorage
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : '',
            visible : false,
            pesan : '',
            empty : false,
        }
        this.socket = this.props.socket
    }

    componentDidMount() {
        BackAndroid.removeEventListener('hardwareBackPress', () => {
            return false;
        });
    }
    componentWillMount() {
        var self = this;
        this.socket.on('login', function (data) {
            if (data.status == 200 ) {
              AsyncStorage.setItem('session',JSON.stringify(data.data), () => {
                self.setState({
                  visible : false,
                  empty : false,
                  pesan : '',
                  password : '',
                  username : ''
                });
                // self.props._onCheckSession();
                self.props.navigator.push({
                  id : 'home',
                  title : ''
                })
              });
            } else {
              self.setState({
                visible : false,
                empty : true,
                pesan : data.msg,
              });
            }
        });
    }

    _login() {
      this.setState({
        visible : true,
        empty : false,
        pesan : '',
      });
      let data = {...this.state};
      if (data.username == '' || data.password == '') {
        this.setState({
          visible : false,
          empty : true,
          pesan : 'data masih ada yang kosong !!!',
        });
      } else {
        this.socket.emit('login', {
            username : this.state.username,
            password : this.state.password
        });
      }
    }
    render() {
        return (
            <View style={style.container}>
                <Spinner
                  color = {'#2980b9'}
                  visible = {this.state.visible} />
                <Text style={style.titleApp}>Sadulur</Text>
                <Text style={style.subTitle}>Sign In Application</Text>
                <View style = {{alignItems : 'center'}} >
                  <Text style = {{color : 'red', marginBottom : 10}} > {this.state.pesan} </Text>
                </View>
                <TextInput
                    style={[style.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
                    underlineColorAndroid="transparent"
                    placeholder="Username"
                    onChangeText={(text) => this.setState({username : text})}/>
                <TextInput
                    style={[style.inputcontrol, this.state.empty ? {borderWidth : 1, borderColor : 'red'} : { borderWidth : 0}]}
                    underlineColorAndroid="transparent"
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(text) => this.setState({password : text})}/>
                <TouchableHighlight
                    onPress={() => this._login()}
                    style={style.btncontrol}>
                    <Text style={{fontSize: 20, color:'#FFF'}}>Sign In</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress = {() => {
                      this.props.navigator.push({
                        id : 'register',
                        title : 'Register'
                      });
                    }}
                    style={{marginTop: 10}}>
                    <Text style={{fontSize : 15, color: '#FAFAFA'}}>Create New Account</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2980B9',
  },
  titleApp : {
      fontSize : 40,
      color : '#FFF',
  },
  subTitle : {
      fontSize : 15,
      color: '#FAFAFA',
      marginBottom: 10
  },
  inputcontrol : {
      height : 40,
      marginBottom : 10,
      backgroundColor: '#D5E5E6',
      width : 300
  },
  btncontrol : {
      padding: 10,
      paddingLeft : 20,
      paddingRight : 20,
      backgroundColor: '#19B5FE',
      flexDirection: 'column'
  }
})