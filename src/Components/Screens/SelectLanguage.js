import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../Themes/color';
import Header from '../Common/Header'
import Button from '../Common/Button'
import LangCard from '../Common/LangCard'
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage'
import I18n from '../../languages/i18n2'

var english = require( '../../Themes/Images/english.png')
var spanish = require( '../../Themes/Images/spanish.png')

export default class SelectLanguage extends Component{
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