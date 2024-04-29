import React, { Component } from 'react';
import {Alert,StyleSheet,Text,View,Image,TouchableOpacity} from 'react-native';
import Header from '../Common/Header'
import I18n from '../../languages/i18n2';
import Button from '../Common/Button'
import LangCard from '../Common/LangCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '../../Themes/color';
import { moderateScale } from 'react-native-size-matters';

var english = require( '../../Themes/Images/english.png')
var spanish = require( '../../Themes/Images/spanish.png')

export default class SelectLang extends Component {
    constructor(props){
        super(props)
        this.state={
            buttonText:'Go',
            heading:'Select Language',
            selected:'en'
        }
    }

    childCallback=(childData)=>{
          console.log("childData",childData)
        this.setState({selected:childData})
        if(childData=='en'){
            this.setState({heading:'Select Language',buttonText:'Go'})
        }
        else{
            this.setState({heading:'Seleccione Idioma',buttonText:'Ir'})
        }
    }

    buttonCallback=()=>{
         
        AsyncStorage.setItem('SelectedLang',this.state.selected)
        I18n.locale=this.state.selected
        this.props.navigation.navigate('ScanQRCodeScreen')
    }

    componentWillMount(){
        AsyncStorage.getItem('SelectedLang').then((value)=>{
            var selected=value
            if(selected=='es'){
                this.setState({english:false,spanish:true,header:'Seleccione Idioma',button:'Ir'})
            }
            else{
                this.setState({english:true,spanish:false,header:'Select Language',button:'Go'})
            }
            this.setState({selected:selected})
        })
    }


    render(){
        return(
            <View style={styles.container}>
                <Header navigation={this.props.navigation} />
                <View style={styles.subContainer}>
                    <Text allowFontScaling={false} style={styles.header}>{this.state.heading}</Text>
                    <View style={styles.border} />
                    <View style={styles.cardContainer}>
                        <LangCard parentCallback={this.childCallback} shortName={'en'} active={this.state.selected =='en'} lang={'English'} flag={english} />
                        <LangCard parentCallback={this.childCallback} shortName={'es'} active={this.state.selected=='es'} lang={'Español'} flag={spanish} />
                    </View>
                </View>
                <Button label={this.state.buttonText} parentCallback={this.buttonCallback} />
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.colorWhite,
    },
    subContainer:{
        flex:1,
        alignItems:'center',
        padding:moderateScale(20)
    },
    cardContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    header:{
        fontSize:moderateScale(24),
        color:colors.loginPrimary,
    },
    border:{
        width:moderateScale(25),
        height:moderateScale(2),
        backgroundColor:colors.colorBlack,
        marginBottom:moderateScale(20)
    }
})