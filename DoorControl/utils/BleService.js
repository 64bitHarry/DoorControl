/**
 * manages the ble action as singelton service
 */
import {
    AsyncStorage,
    Platform,
    NativeModules,
    NativeEventEmitter,
} from 'react-native';
//import Toast from 'react-native-simple-toast';//may be erase because status is on main screen

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import constants from './Constants';

let instance = null;

export default class BleService{

    /** Singelton constructor */
    static get instance(){
        if(!instance){
            instance = new BleService();
        }
        return instance;
    }

    constructor(){
        this.appState = 'active';
        this.deviceList={};
        this.peripheral=null;
        this.peripheralInfo=null;
        this.listener = {};
        this.loadedVal = null;
        this.connected = false;

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        BleManager.start({ showAlert: false }).then(() => {
            console.log("Module initialized");
            this.scan();
        });
        this.loadPeripheral();
    }

    /**
     * add all found peripheral in a list
     * if the last connection is found it will connect to this
     */
    handleDiscoverPeripheral = (peripheral) => {
        if(!peripheral.name)return;
        if(this.loadedVal.name != null && peripheral.name == this.loadedVal.name){
            console.log('previous connection found');
            this.peripheral=peripheral;
            this.connact();
        }
        this.deviceList[peripheral.name]=peripheral;
    }

    /**
     * action if the scan is finished
     */
    handleStopScan = () =>{
        this.notifyListener(constants.DEVICEUPDATE);
    }

    /**
     * action if the peripheral is disconected
     */
    handleDisconnectedPeripheral = (data) =>{
        console.log(data);
        this.notifyListener(constants.CONNECTION_LOST);
    }

    /**
     * do the ble scan all found items are in handleDiscoverPeripheral
     */
    scan=()=>{
        this.deviceList = {};
        BleManager.scan([], 1, true).then(() => {
            console.log("Scan started");
        });
    }

    /**
     * connact to the selectet peripheral
     */
    connact=()=>{
        this.saveConnection();
        BleManager.connect(this.peripheral.id)
            .then(() => {
                console.log("Connected");
                this.notifyListener(constants.CONNECTED);
                this.retrieveServiceAndStartNotification();
            }).catch((error) => {
                console.log(error);
            });
            this.connected = true;
    }

    /**
     * save the Pheripherial on connection.
     */
    saveConnection= async ()=>{
        try {
        console.log('save');
            await AsyncStorage.setItem(
              constants.PERIPHERALKEY,
                JSON.stringify(this.peripheral)
            );
          } catch (error) {
            // Error saving data
          }
    }

    /**
     * load a saved peripheral
     */
    loadPeripheral= async ()=>{
    try {
        const value = await AsyncStorage.getItem(constants.PERIPHERALKEY);
        if (value !== null) {
          // We have data!!
          console.log('got value');
          console.log(value);
          var temp = JSON.parse(value);
          this.loadedVal = temp;
        }
      } catch (error) {
        // Error retrieving data
      }
    }

    /**
     * need to get the services and is need as a step to send and read data
     */
    retriveService=()=>{
        BleManager.retrieveServices(this.peripheral.id).then(
            (peripheralInfo) => {
                console.log("Peripheral info:", peripheralInfo);
                this.peripheralInfo = peripheralInfo;
        });
    }



    /**
     * retrive service and start the Nofication to write and read data
     */
    retrieveServiceAndStartNotification=()=>{
        BleManager.retrieveServices(this.peripheral.id).then((peripheralInfo) => {
            console.log(peripheralInfo);
            var service = this.peripheral.advertising.serviceUUIDs[0];
            var characteristic = '2A57';

            console.log('try to send Data');
            setTimeout(() => {
                BleManager.startNotification(this.peripheral.id, service, characteristic).then(() => {
                    console.log('Started notification on ' + peripheral.id);
                    setTimeout(() => {
                        BleManager.writeWithoutResponse(this.peripheral.id, service, characteristic, [0x00]).then(() => {
                            console.log('write without Response');
                        });
                    }, 500);
                }).catch((error) => {
                    console.log('Notification error', error);
                });
            }, 200);
        });
	}

	/**
	 * send data to the device data is a byte array e.g. [0x00,0x01]
	 */
    sendData=(data)=>{
    //TODO check that the device provides a service
        console.log(this.peripheral.id);
        console.log(this.peripheral.advertising.serviceUUIDs[0]);
        console.log('2A57');
    	console.log(data);
        BleManager.write(this.peripheral.id,this.peripheral.advertising.serviceUUIDs[0],'2A57',data)
            .then(() => {
                console.log("Writed: " + data);
            }).catch((error) => {
                console.log(error);
            });
    	}


    /**
     * method to set the peripheral from outside
     */
    setPeripheral=(newDevice)=>{
        this.peripheral=this.deviceList[newDevice];
        this.connact();
    }


    //Listener to notify the app and other parts if I extend the app
    removeListener(view){
        delete this.listener[(view.props.componentId)];
    }

    registerListener(view){
        this.listener[view.componentId] = view;
    }

    //notify about the new messages
    notifyListener(event){
        Object.keys(this.listener).forEach(value=>{
            this.listener[value].notify(event);
        });
    }

}
