var React = require('react');
import {
	View,
	Text,
	StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
	rowCenter : {
		position : 'absolute',
		justifyContent : 'center',
		alignItems : 'center',
		top : 0,
		bottom : 0,
		left : 0,
		right : 0,
	},
	textEmpty : {
		fontSize : 18,
		fontWeight : '600',
		color : '#95a5a6',
	}
});

class Empty extends React.Component {

	render() {
		return (
			<View style = {styles.rowCenter}>
				<Text style = {styles.textEmpty}>{this.props.pesan}</Text>
			</View>
		);
	}
}

module.exports = Empty;