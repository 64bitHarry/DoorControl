/**
  * @author Harold-Martin Michling
  * ble remote controll for a garage door
  * the peripheral is arduino iot 33
  */

import React, { Component, PropTypes } from 'react';
import {Text, TextInput, View, Button, Alert, Image,
	    Navigator, TouchableHighlight, StyleSheet,
	    Keyboard, Dimensions, ActivityIndicator,
	    AsyncStorage, Platform, KeyboardAvoidingView,
	    Modal, Pressable,
	    ScrollView,
       } from 'react-native';
import ListItem from './utils/ListItem';
import constants from './utils/Constants';

import BleService from './utils/BleService';
const bleService = BleService.instance;

//screen dimensions to dynimic scale of the screen
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



export default class App extends Component {

	constructor(){
		super();
		this.deviceList={};
		this.componentId="app";
		this.state = {
			modalVisible: false,
			peripheral:null,//the selected device
			renderList:[],
			connectionStatus:styles.ciclered,
		};
		console.log(this);
		bleService.registerListener(this);//inform the app if a device is selected or a list is updated.
	}//END constructor

    createDeviceList = (peripheral) => {

        //this.deviceList[(peripheral.name)]=(
        //    <View key={peripheral.name} style={{ flex:1, justifyContent:'space-between',width:WIDTH*0.9}}>
        //        <Text>{peripheral.name}</Text>
        //    </View>
        //);
        //var list = [];
        //    Object.keys(this.deviceList).forEach(value=>{
        //        list.push(this.deviceList[value]);
        //    });
        //this.setState({renderList:list});
    }//END handle


    /**
     * static method to render the scroll view elements
     * TODO update the list on change
     */
    renderDeviceList = () => {
    console.log('render list');
        var tmp = [];
        Object.keys(bleService.deviceList).forEach(value=>{
            tmp.push(
                <View key={bleService.deviceList[value].name} style={{ flex:1, justifyContent:'space-between',width:WIDTH*0.9}}>
                    <ListItem name={bleService.deviceList[value].name} macAdress={bleService.deviceList[value].id} />
                </View>
            );
        });
        this.setState({renderList:tmp});
    }


    openSettings=()=>{
        //console.log(bleService.deviceList)
        this.renderDeviceList()
        this.setState({modalVisible:true});
	}

	notify=(event)=>{
	    console.log(event);
	    if(event==constants.NOTIFY_EVENT){
            this.setState({modalVisible:false});
	    }else if(event==constants.CONNECTED){
	        this.setState({connectionStatus:styles.ciclegrren});
	    }else if(event==constants.CONNECTION_LOST){
	        this.setState({connectionStatus:styles.ciclered});
	    }
	}

    /**
     * write the up comand to the ble
     */
    upStart=()=>{
        bleService.sendData([0x01]);
    }

    upStop=(){
        bleService.sendData([0x00]);
    }

    /**
     * write the down comand to the ble
     */
	downStart=()=>{
	    bleService.sendData([0x02]);
	    //console.log('start down');
    }

    /**
     * send the 0x00 to stop the door
     */
    stop=()=>{
        bleService.sendData([0x00]);
        //console.log('stop down');
    }

    renderModal(){
        return (
            <View>
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
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={bleService.scan}
                            >
                                <Text style={styles.textStyle}>Bluetooth scan</Text>
                            </Pressable>
                        <ScrollView>
                            <View>
                                {this.state.renderList}
                            </View>
                        </ScrollView>
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
                <View style={this.state.connectionStatus}></View>
                <Text style={{fontSize: HEIGHT*0.05, marginLeft:15, marginTop:15}}>Verbunden</Text>
            </View>
            <View style={styles.body}>
                <View>
                    <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPressIn={this.upStart} onPressOut={this.stop} >
                        <View style={styles.buttonUp}>
                            <Image style={styles.arrow}
                                source={require('./imgs/211614_down_b_arrow_icon.png')} />
                        </View>
                    </TouchableHighlight>
                </View>

                <View>
                    <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.0)'} onPressIn={this.downStart} onPressOut={this.stop}>
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
        margin: 5,
        backgroundColor: "white",
        borderRadius: 20,
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
        elevation: 2,
        marginBottom:10,
        marginTop:10,
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
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }
});