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

	openSettings=()=>{
	    Alert.alert("Settings");
	}

	upButton=()=>{
        Alert.alert("up");
	}

	down=()=>{
         Alert.alert("down");
    }

//add modal with progress wait untill error or succes
  render() {
    return (
        <View style={styles.mainView}>
            <View style={{height: HEIGHT*0.15,width: WIDTH, borderBottomWidth:1, flexDirection: 'row', alignItems:'center',justifyContent:'flex-start'}}>
                <View style={{height: HEIGHT*0.05,width: HEIGHT*0.05, marginLeft:15, marginTop:15, borderRadius:100, backgroundColor:'green'}}></View>
                <Text style={{fontSize: HEIGHT*0.05, marginLeft:15, marginTop:15}}>Verbunden</Text>
            </View>
            <View style={{height: HEIGHT*0.65,width: WIDTH, alignItems:'center',justifyContent:'space-between'}}>
                <View>
                    <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPress={this.upButton}>
                        <View style={{height: HEIGHT*0.2,width: HEIGHT*0.2, marginTop:HEIGHT*0.1, backgroundColor:'darkgray', alignItems:'center',justifyContent:'center', borderRadius:20}}>
                            <Image style={styles.arrow}
                                source={require('./imgs/211614_down_b_arrow_icon.png')} />
                        </View>
                    </TouchableHighlight>
                </View>

                <View>
                    <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPress={this.down}>
                        <View style={{height: HEIGHT*0.2,width: HEIGHT*0.2, marginBottom:HEIGHT*0.1, backgroundColor:'darkgray', alignItems:'center',justifyContent:'center', borderRadius:20}}>
                            <Image style={styles.arrow2}
                                source={require('./imgs/211614_down_b_arrow_icon.png')} />
                        </View>
                    </TouchableHighlight>
                </View>

            </View>
            <View style={{height: HEIGHT*0.2,width: WIDTH, alignItems:'flex-end',justifyContent:'center'}}>
                <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPress={this.openSettings}>
                    <Image style={styles.image}
                	    source={require('./imgs/115801_settings_icon.png')} />
                </TouchableHighlight>
            </View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	mainView:{
		flex: 1,
	},
	image: {
        flex: 1,
        width: HEIGHT*0.1,
        height: HEIGHT*0.1,
        marginRight:15,
        resizeMode: 'contain'
    },
    arrow: {
        flex: 1,
        width: HEIGHT*0.2,
        height: HEIGHT*0.2,
        resizeMode: 'contain',
        transform: [{rotate: '180deg'}]
    },
    arrow2: {
        flex: 1,
        width: HEIGHT*0.2,
        height: HEIGHT*0.2,
        resizeMode: 'contain'
    }
});