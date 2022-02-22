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

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        BleManager.start({ showAlert: false }).then(() => {
            console.log("Module initialized");
            this.scan();
        });
    }

    /**
     * add all found peripheral in a list
     */
    handleDiscoverPeripheral = (peripheral) => {
        if(!peripheral.name)return;
        //console.log('Got ble peripheral', peripheral);
        //console.log(peripheral);
        this.deviceList[peripheral.name]=peripheral;
    }

    /**
     * do the ble scan all found items are in handleDiscoverPeripheral
     */
    scan=()=>{
        BleManager.scan([], 1, true).then(() => {
            console.log("Scan started");
        });
    }

    /**
     * connact to the selectet peripheral
     */
    connact=()=>{
        BleManager.connect(this.peripheral.id)
            .then(() => {
                console.log("Connected");
            }).catch((error) => {
                console.log(error);
            });
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
    console.log('+++++++');
    console.log(view.componentId);
        this.listener[view.componentId] = view;
    }

    //notify about the new messages
    notifyListener(event, message){
        Object.keys(this.listener).forEach(value=>{
            this.listener[value].notify(event,message);
        });
    }

}
