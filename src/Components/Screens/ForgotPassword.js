import React, {Component} from 'react'
import {StyleSheet, View, TextInput,Text,TouchableOpacity,Image,Alert} from 'react-native'
import {moderateScale} from 'react-native-size-matters'
import I18n from '../../languages/i18n2'
import Button from '../Common/RoundButton'
import {Constant,WebServices} from '../../api/ApiRules'
import * as commonFunctions from '../../utils/CommonFunctions'
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from '@react-native-async-storage/async-storage'


const logo = require('../../Themes/Images/app_icon.png')

export default class ForgotPassword extends Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            lng:'',
        }
    }

    childCallback=()=>{
      const { email } = this.state
      var error=0;
      if ((email.indexOf(' ') >= 0 || email.length <= 0)) {
        this.setState({emailerr:'Please enter Email address'})
        error=1;
      }else if (!commonFunctions.validateEmail(email)) {
        this.setState({emailerr:'Please enter valid Email address'})
        error=1;
      }
      else{
          this.setState({emailerr:''})
      }
      if(error==0){
        const data = new FormData();
        data.append('email', email);
        data.append('language',this.state.lng)
        this.setState({isVisible: true});
        this.postToApiCalling('POST', 'login', Constant.URL_forgot, data);
      }
    }

    postToApiCalling(method, apiKey, apiUrl, data) {
      new Promise(function(resolve) {
       if (method == 'POST') {
           resolve(WebServices.callWebService(apiUrl, data));
       } else {
           resolve(WebServices.callWebService_GET(apiUrl, data));
       }
     }).then((jsonRes) => {
        console.log("jsonRes",jsonRes)
       this.setState({ isVisible: false })
       if ((!jsonRes) || (jsonRes.code == 0)) {
         setTimeout(()=>{
          if(jsonRes.message == "Please verify your email address. This email is not registered as an INFINIGUARD®️ Certified Applicator.")
          Alert.alert(I18n.t('Certified_Applicator_Login.Verify_email_eixts'),I18n.t('Certified_Applicator_Login.verify_email_extis_text'));
          else if (jsonRes.message == "Please contact info@infiniguard.com for additional assistance.")
          Alert.alert(I18n.t('Certified_Applicator_Login.accout_disable_title'),I18n.t('Certified_Applicator_Login.accout_disable'));
         },200);
       } else {
         if (jsonRes.code == 1) {
             this.apiSuccessfullResponse(apiKey, jsonRes)
         }
       }
      }).catch((error) => {
        console.log("ERROR" + error);
        this.setState({ isVisible: false })
        setTimeout(()=>{
            Alert.alert("Server issue");
        },200);
      });
    }

    apiSuccessfullResponse(jsonRes){
      Alert.alert(
        I18n.t('Certified_Applicator_Login.email_sent_title'),
        I18n.t('Certified_Applicator_Login.email_sent'),
        [
          {text: 'OK', onPress: () => this.props.navigation.pop()},
        ],
        {cancelable: false},
      )
    }

    componentDidMount(){
      AsyncStorage.getItem('SelectedLang').then((val)=>{
        if(val=='en'){
        this.setState({lng:'en'})
        }
        else{
        this.setState({lang:'es'})
        }
    })
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}/>
                </View>
                <View style={styles.headerBox}>
                    <Text style={styles.headerText}>{I18n.t('Forgot_Screen.Title')}</Text>
                    <View style={{width:'20%',backgroundColor:"#000",height:moderateScale(2),marginTop:moderateScale(10)}}/>
                </View>
                <View style={styles.inputBox}>
                    <TextInput
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                        returnKeyType={ "go"}
                        selectionColor={"#000000"}
                        autoFocus={ false}
                        placeholder={I18n.t('Certified_Applicator_Login.email')}
                        placeholderTextColor="#808080"
                        style={styles.input}
                        ref="email"
                        keyboardType={ 'email-address'}
                        onFocus={ () => this.setState({emailerr:''}) }
                        onChangeText={email=> this.setState({email})}
                    />
                </View>
                { !(this.state.emailerr) ? null :
                <Text allowFontScaling={false} style={styles.error}>{I18n.t('Certified_Applicator_Login.empty_email')}</Text>
                }
                <View style={styles.buttonBox}>
                    <Button
                        label = {I18n.t('Forgot_Screen.sendButton')}
                        parentCallback={this.childCallback}
                    />
                </View>
                <View style={styles.loginBox}>
                    <TouchableOpacity style={styles.loginButton} onPress={()=>this.props.navigation.pop()}>
                        <Text style={{fontSize:moderateScale(14)}}>{I18n.t('Forgot_Screen.back_text')}</Text>
                    </TouchableOpacity>
                </View>
                <Spinner visible={this.state.isVisible}  />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        alignItems:'center',
    },
    headerBox:{
      width:'100%',
      alignItems:'center',
      justifyContent:'center',
      paddingBottom:moderateScale(15),
    },
    headerText:{
      color:'#04bdf0',
      fontSize:moderateScale(24),
      fontWeight:'bold'
    },
    inputBox:{
      width:'80%',
      paddingTop:moderateScale(30),
    },
    buttonBox:{
      width:'80%',
      marginTop:moderateScale(10)
    },
    input:{
      width:'100%',
      height:moderateScale(50),
      backgroundColor:'#ddd',
      borderRadius:moderateScale(50),
      textAlign:'center',
      color:'#000',
      fontSize:moderateScale(14),
      marginBottom:moderateScale(10)
    },
    error:{
      color:'red',
      textAlign:'center',
      fontSize:moderateScale(14),
    },
    logoContainer:{
      width:'100%',
      height:'30%',
      alignItems:'center',
      justifyContent:'center',
      marginTop:moderateScale(40)
    },
    logo:{
      width:moderateScale(120),
      height:moderateScale(120)
    },
    loginBox:{
      width:'100%',
      alignItems:'center',
      justifyContent:'center',
      padding:moderateScale(10)
    },
    loginButton:{
      padding:moderateScale(5),
    }
})
