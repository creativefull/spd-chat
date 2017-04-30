import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconA from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
const _ = require('underscore')
class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user : {
                name : '',
                alamat : '',
                email : '',
                password : ''
            }
        }
    }
    componentDidMount() {
        this._onFetch()
    }
    _onFetch () {
        AsyncStorage.getItem('session', (err, result) => {
            if (result != null ) {
                var obj = JSON.parse(result);
                this.setState({
                    user : obj
                });
            }
        });
    }
    _editProfile() {
        this.props.navigator.push({
            id : "Editprofile"
        })
    }
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
                    <Text style={{fontSize: 20}}>{this.state.user.name}</Text>
                    <Text style={{fontSize: 20}}>{this.state.user.alamat}</Text>
                    <Text style={{fontSize: 15}}>{this.state.user.email}</Text>
                    <TouchableOpacity onPress={() => this._editProfile() }
                        style={[styles.btncontrol, {marginTop: 10}]}
                    >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

class EditProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id : '',
            name : '',
            alamat : '',
            email : '',
            password : ''
        }

        socket = this.props.socket;
    }
    componentDidMount() {
        this._onFetch()
    }
    saveProfile() {
        let self = this;
        let data = {
            _id : this.state._id,
            name : this.state.name,
            alamat : this.state.alamat,
            email : this.state.email,
            password : this.state.password
        }
        socket.emit('editProfile', data)
    }
    componentWillMount() {
        socket.on('editProfile', (data) => {
            AsyncStorage.setItem('session', JSON.stringify(data.data))
            this.props.navigator.push({
                id : 'profile'
            })
        })
    }
    _onFetch () {
        AsyncStorage.getItem('session', (err, result) => {
            if (result != null ) {
                var obj = JSON.parse(result);
                this.setState({
                    _id : obj._id,
                    name : obj.name,
                    alamat : obj.alamat,
                    email : obj.email,
                    password : obj.password
                });
                // alert(JSON.stringify(obj))
            }
        });
    }
    render() {
        // let user = _.extend({}, this.state.user);
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

                <View style={styles.listEdit}>
                    <Text style={{marginTop: 5}}>Nama Lengkap</Text>
                    <TextInput style={styles.formControl} value={this.state.name} onChangeText={(text) => {
                        this.setState({name : text})
                    }}/>
                    <Text style={{marginTop: 5}}>Alamat</Text>
                    <TextInput style={styles.formControl} value={this.state.alamat} onChangeText={(text) => {
                        this.setState({alamat : text})
                    }}/>
                    <Text style={{marginTop: 5}}>Email</Text>
                    <TextInput style={styles.formControl} value={this.state.email} onChangeText={(text) => {
                        this.setState({email : text})
                    }}/>
                    <Text style={{marginTop: 5}}>Password</Text>
                    <TextInput style={styles.formControl} value={this.state.password} onChangeText={(text) => {
                        this.setState({password : text})
                    }}/>

                    <TouchableOpacity style={[styles.btncontrol, {marginTop : 10, justifyContent : 'center'}]} onPress={() => this.saveProfile()}>
                        <Text style={{textAlign : 'center', color : '#FFF'}}>
                            Save
                        </Text>
                    </TouchableOpacity>
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
  listEdit: {
    flex : 1,
    padding : 20,
  },
  btncontrol : {
      padding: 10,
      paddingLeft : 20,
      paddingRight : 20,
      backgroundColor: '#19B5FE',
      flexDirection: 'column'
  },
  formControl : {
      backgroundColor : '#EEE',
      padding: 5
  }
});

module.exports = {
    Profile : Profile,
    EditProfile : EditProfile
}