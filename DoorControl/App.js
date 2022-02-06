/**
  * @author Harold-Martin Michling
  * login screen for the Tachofresh backend
  * posable to enter the user credentials:
  * company number
  * user name
  * and submit it to Tachofresh
  */

import React, { Component, PropTypes } from 'react';
import {Text, TextInput, View, Button, Alert, Image,
	    Navigator, TouchableHighlight, StyleSheet,
	    Keyboard, Dimensions, ActivityIndicator,
	    AsyncStorage, Platform, KeyboardAvoidingView,
       } from 'react-native';

//screen dimensions to dynimic scale of the screen
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class App extends Component {

	constructor(){
		super();
		this.state = {
			isLoading: false,
		};
	}

//add modal with progress wait untill error or succes
  render() {
    return (
        <View style={styles.mainView}>

	    </View>
    );
  }
}

const styles = StyleSheet.create({
	mainView:{
		flex: 1,
		alignItems:'center',
		backgroundColor: 'red',
			...Platform.select({
				android:{
					justifyContent: 'center',
			}
		}),
	}
});