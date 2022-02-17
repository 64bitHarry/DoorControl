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
	    Modal, Pressable, NativeModules, NativeEventEmitter,
       } from 'react-native';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


//screen dimensions to dynimic scale of the screen
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



export default class App extends Component {

	constructor(){
		super();
		this.state = {
			isLoading: false,
			modalVisible: false,
		};

		BleManager.start({ showAlert: false }).then(() => {
          // Success code
          console.log("Module initialized");
        });
        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
	}

  handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    //peripherals.set(peripheral.id, peripheral);
    //setList(Array.from(peripherals.values()));
  }
	openSettings=()=>{
	    this.setState({modalVisible:true});
	}

	upButton=()=>{
        Alert.alert("up");
        BleManager.scan([], 5, true).then(() => {
                  // Success code
                  console.log("Scan started");
                });
	}

	down=()=>{
         Alert.alert("down");
    }

//TODO style the modal view and add the possable settings
    renderModal(){
        return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Verbindungs Einstellungen</Text>
                    <TextInput
                        ref='FirstInput'
                    	returnKeyType = {"next"}
                    	placeholder={"192.168.35.101"}
                    	autoCorrect={false}
                    	onEndEditing  = {(event) => this.setState({customerNumber: event.nativeEvent.text})}
                    />
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => this.setState({modalVisible: false})}
                    >
                      <Text style={styles.textStyle}>Anwenden!</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
        </View>
        );
    }

//add modal with progress wait untill error or succes
  render() {
    return (
        <View style={styles.mainView}>
            {this.renderModal()}
            <View style={styles.header}>
                <View style={styles.ciclegrren}></View>
                <Text style={{fontSize: HEIGHT*0.05, marginLeft:15, marginTop:15}}>Verbunden</Text>
            </View>
            <View style={styles.body}>
                <View>
                    <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPress={this.upButton}>
                        <View style={styles.buttonUp}>
                            <Image style={styles.arrow}
                                source={require('./imgs/211614_down_b_arrow_icon.png')} />
                        </View>
                    </TouchableHighlight>
                </View>

                <View>
                    <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPress={this.down}>
                        <View style={styles.buttondown}>
                            <Image style={styles.arrow2}
                                source={require('./imgs/211614_down_b_arrow_icon.png')} />
                        </View>
                    </TouchableHighlight>
                </View>

            </View>
            <View style={styles.bottom}>
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
    },
    header: {
        height: HEIGHT*0.15,
        width: WIDTH,
        borderBottomWidth:1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    body: {
        height: HEIGHT*0.65,
        width: WIDTH,
        alignItems:'center',
        justifyContent:'space-between'
    },
    bottom: {
        height: HEIGHT*0.2,
        width: WIDTH,
        alignItems:'flex-end',
        justifyContent:'center'
    },
    ciclegrren: {
        height: HEIGHT*0.05,
        width: HEIGHT*0.05,
        marginLeft:15,
        marginTop:15,
        borderRadius:100,
        backgroundColor:'green'
    },
    ciclered: {
        height: HEIGHT*0.05,
        width: HEIGHT*0.05,
        marginLeft:15,
        marginTop:15,
        borderRadius:100,
        backgroundColor:'red'
    },
    buttonUp: {
        height: HEIGHT*0.2,
        width: HEIGHT*0.2,
        marginTop:HEIGHT*0.1,
        backgroundColor:'darkgray',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20
    },
    buttondown: {
        height: HEIGHT*0.2,
        width: HEIGHT*0.2,
        marginBottom:HEIGHT*0.1,
        backgroundColor:'darkgray',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        height: HEIGHT*0.4,
        width: WIDTH*0.8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }
});