import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : ''
        }
        this.socket = this.props.socket
    }
    componentWillMount() {
        this.socket.on('login', function(data) {
            console.log(data);
        })
    }
    _login() {
        this.socket.emit('login', {
            username : this.state.username,
            password : this.state.password
        })
    }
    render() {
        return (
            <View style={style.container}>
                <Text style={style.titleApp}>Sadulur</Text>
                <Text style={style.subTitle}>Sign In Application</Text>
                <TextInput
                    style={style.inputcontrol}
                    underlineColorAndroid="transparent"
                    placeholder="Username"
                    onChangeText={(text) => this.setState({username : text})}
                />
                <TextInput
                    style={style.inputcontrol}
                    underlineColorAndroid="transparent"
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(text) => this.setState({password : text})}
                />
                <TouchableHighlight
                    onPress={() => this._login()}
                    style={style.btncontrol}>
                    <Text style={{fontSize: 20, color:'#FFF'}}>Sign In</Text>
                </TouchableHighlight>
                <TouchableHighlight
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