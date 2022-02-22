/**
 * Class to manage a tachable item in the scroll view
 */

import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    Alert,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';

import BleService from './BleService';
const bleService = BleService.instance;

//screen dimensions to dynimic scale of the screen
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class ListItem extends Component {

    constructor(props) {
        super(props);
    }


    /**
     * set the perephial an tosch select
     *
     **/
    itemSelected = () => {
        if(this.props.touch !== undefined)return;
        console.log(this.props.name);
        //TODO bleService.set(this.props.periphial)
    }

     render() {
       return (
         <View style={{alignItems:'center', justifyContent:'space-between'}}>
            <TouchableHighlight underlayColor = {'rgba(0, 0, 0, 0.1)'} onPress={() => {this.itemSelected()}}>
                <View style={styles.elements/*if this.prosp.status === notavalable ? styles.grayElement:styles.element*/}>
                    <View style={{width:WIDTH}}>
                        <Text style={styles.fontStyle}>{this.props.name}</Text>
                    </View>
                    <View style={{width:WIDTH*0.80,}}>
                        <Text style={{styles.fontStylesmall}}>{this.props.macAdress}</Text>
                    </View>
                </View>
            </TouchableHighlight>
         </View>
       );
     }
   }


   const styles = StyleSheet.create({
     elements: {
     width:WIDTH*0.88,
       marginBottom: HEIGHT*0.01,
       padding:HEIGHT*0.01,
       flexDirection:'column',
       alignItems:'center',
       justifyContent:'center',
       borderRadius : WIDTH*0.0234,
       borderBottomColor: 'black',
       borderBottomWidth : 1,
       backgroundColor:'#d1e0e0'
   },
   cicleGreen:{
     width: WIDTH*0.09,
     height: WIDTH*0.09,
     backgroundColor: 'green',
     borderRadius : 100,
   },
   cicleRed:{
     width: WIDTH*0.09,
     height: WIDTH*0.09,
     backgroundColor: 'red',
     borderRadius : 100,
   },
   cicleGrey:{
     width: WIDTH*0.09,
     height: WIDTH*0.09,
     backgroundColor: 'grey',
     borderRadius : 100,
   },
   fontStyle:{
     fontSize: 18,
     color: 'black',
     textAlign: 'center',
   },
   fontStylesmall:{
        fontSize: 9,
        color: 'black',
        textAlign: 'center',
      },
   fontStyleAlignLeft:{
     fontSize: 18,
     color: 'black',
     textAlign: 'left',
   }
 });
