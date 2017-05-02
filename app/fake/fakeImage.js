import React, { Component } from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const initStyle = { borderRadius: 30, width: 60, height: 60 };
const renderImages = (num, style = initStyle) => {
  switch (num) {
    case 1:
      return <Image source={require('../images/image1.jpeg')} style={style} resizeMode='contain' />;
    case 2:
      return <Image source={require('../images/image2.jpeg')} style={style} resizeMode='contain' />;
    case 3:
      return <Image source={require('../images/image3.jpeg')} style={style} resizeMode='contain' />;
    case 4:
      return <Image source={require('../images/image4.jpeg')} style={style} resizeMode='contain' />;
    case 5:
      return <Image source={require('../images/image5.jpeg')} style={style} resizeMode='contain' />;
    case 6:
      return <Image source={require('../images/image6.jpeg')} style={style} resizeMode='contain' />;
    case 7:
      return <Image source={require('../images/image7.jpeg')} style={style} resizeMode='contain' />;
    case 8:
      return <Image source={require('../images/image8.jpeg')} style={style} resizeMode='contain' />;
    case 9:
      return <Image source={require('../images/image9.jpeg')} style={style} resizeMode='contain' />;
    case 10:
      return <Image source={require('../images/image10.jpeg')} style={style} resizeMode='contain' />;

    default: return <Image source={require('../images/image1.jpeg')} style={style} resizeMode='contain' />;
  }
};

const renderIcon = (num, style = initStyle) => {
  switch (num) {
    case 1:
      return <Image source={require('../images/fire.png')} style={{width : 60, height : 60}} resizeMode='contain' />;
    case 2:
      return <Image source={require('../images/thief.png')} style={{width : 60, height : 60}} resizeMode='contain' />;
    case 3:
      return <Image source={require('../images/pistol.png')} style={{width : 60, height : 60}} resizeMode='contain' />;
    case 4:
      return <Icon name="flash" size={60} color="#D00"/>;
    case 5:
      return <Icon name="plus" size={60} color="#D00"/>;
    case 10:
      return <Icon name="user" size={60} color="#2980B9"/>;
    default:
      return <Icon name="question" size={60} color="#D00"/>;
  }
}

module.exports = {
  renderImages : renderImages,
  renderIcon : renderIcon
}
// module.exports = renderIcon;
