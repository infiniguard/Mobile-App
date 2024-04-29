import React, { Component } from 'react';
import {StyleSheet,Text,View,Image} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../../Themes/color';
import Button from '../Common/Button';
import Header from '../Common/Header'
import I18n from '../../languages/i18n2';
var validation=require('../../Themes/Images/validation.png')

export default class VerificationError extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isVisible: false
        }
    }

    childCallback=()=>{
        this.props.navigation.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation}/>
                <View style={styles.container1}>
                    <Image resizeMode={'contain'} style={styles.boxicon} source={validation}/>
                    <Text allowFontScaling={false} style={styles.pageheading}>
                    {I18n.t('invalid_code.error_message')}</Text>
                </View>
                <Button
                    label={I18n.t('invalid_code.scan_again')}
                    parentCallback={this.childCallback}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:  0,
  },
  container1:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  pageheading:{
    fontSize:moderateScale(18),
    fontWeight:'700',
    textAlign:'center',
    color: colors.loginPrimary,
    width:'100%',
    marginTop:moderateScale(10)
  },
  boxicon:{
    height:moderateScale(150),
    width:'50%',
  },
});
