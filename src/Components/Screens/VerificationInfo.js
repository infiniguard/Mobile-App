import React, { Component } from 'react';
import {StyleSheet,Text,View,Image} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Header from '../Common/Header'
import Button from "../Common/Button";
import I18n from '../../languages/i18n2';
import { moderateScale } from 'react-native-size-matters';

var validation=require('../../Themes/Images/frame.png')
export default class VerificationInfo extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isVisible: false,
        }
    }


    scanqrcode=()=>{
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name:'ScanQRCodeScreen'}],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation}/>
                <View style={styles.container1}>
                    <Image style={styles.boxicon} source={validation}/>
                    <Text allowFontScaling={false} style={styles.pageheading}>
                        {I18n.t('VerificationInfo.Text')}
                    </Text>
                </View>

                <Button
                    style={{width:'100%'}}
                    label={I18n.t('VerificationInfo.Button').toLowerCase()}
                    parentCallback={this.scanqrcode}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        height:'70%',
        paddingLeft:'6%',
        paddingRight:'6%',
        paddingBottom:'5%',
    },
    container1:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    border:{
        width:30,
        borderBottomWidth:2,
        color: '#13b0dd',
        margin:moderateScale(1),
        textAlign:'center'
    },
    pageheading:{
        fontSize:moderateScale(17),
        fontWeight:'700',
        textAlign:'center',
        color: '#32c8ed',
        width:'100%'
    },
    boxicon:{
        height:'33%',
        width:'50%',
        alignItems: 'center',
        justifyContent:'center',
        resizeMode:'contain',
    },
});
