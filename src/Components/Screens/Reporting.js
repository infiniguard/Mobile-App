import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import Header from '../Common/Header'
import Button from '../Common/Button'
import I18n from '../../languages/i18n2'
import * as commonFunctions from '../../utils/CommonFunctions'
import { colors } from '../../Themes/color'
import { moderateScale } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'
import { Constant, WebServices } from '../../api/ApiRules'
import Spinner from 'react-native-loading-spinner-overlay'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class ReportingScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      emailerr: '',
      nameerr: '',
      isVisible: false,
      name: '',
      email: ''
    }
  }

  warrantyclaim = () => {
    this.props.navigation.navigate('WarrantyClaimScreen')
  }

  gobackScreen = () => {
    this.props.navigation.navigate('ScanQRCodeScreen')
  }

  additionalcomponentbtn = () => {
    // const resetAction = CommonActions.reset({
    //     index: 0,
    //     routes: [{ name:'ScanQRCodeScreen'}],
    // });
    this.props.navigation.navigate('ScanQRCodeScreen')
  }

  validationAndApiParameter(apiname) {
    if (apiname == 'report') {
      const data1 = new FormData()
      data1.append('qr_id', this.props.route.params.qr_id)
      data1.append('Email', this.state.email)
      data1.append('ContactName', this.state.name)
      data1.append('Lang', I18n.locale == 'en' ? 'english' : 'spanish')
      console.log('data1', data1)
      this.setState({ isVisible: true })
      this.postToApiCalling('POST', apiname, Constant.URL_sendReport, data1)
    }
  }

  postToApiCalling(method, apiKey, apiUrl, data1) {
    new Promise(function (resolve, reject) {
      if (method == 'POST') {
        resolve(WebServices.callWebService(apiUrl, data1))
      } else {
        resolve(WebServices.callWebService_Get(apiUrl, data1))
      }
    })
      .then((jsonRes) => {
        console.log('jsonRes', jsonRes)
        this.setState({ isVisible: false })
        if (!jsonRes || jsonRes.code == 0) {
          Alert.alert('Sorry', jsonRes?.message)
          // console.log("jsonRes",jsonRes)
          // setTimeout(() => { console.log('Error', jsonRes); }, 200);
        } else {
          if (jsonRes.code == 1) {
            this.apiSuccessfullResponse(apiKey, jsonRes)
          }
        }
      })
      .catch((error) => {
        console.log('ERROR' + error)
        this.setState({ isVisible: false })
        setTimeout(() => {
          Alert.alert('Server issue')
        }, 200)
      })
  }

  async apiSuccessfullResponse(apiKey, jsonRes) {
    if (apiKey == 'report') {
      var jdata = jsonRes.result
      images = []
      console.log('hellow haider', jdata)
      // await AsyncStorage.setItem('inspection_id', JSON.stringify(jdata));
      this.props.navigation.navigate('ReportingThankyou', {
        qr_number: parseInt(this.props.route.params.qr_number),
        email: this.state.email
      })
    }
  }

  childCallback = () => {
    // this.validationAndApiParameter("report")

    const {
      method,
      email,
      name,
      phone_number,
      qr_id,
      address,
      latitude,
      longitude,
      insp_id,
      isVisible
    } = this.state
    var error = 0
    if (email.indexOf(' ') >= 0 || email.length <= 0) {
      this.setState({ emailerr: 'Please enter Email address' })
      error = 1
    } else if (!commonFunctions.validateEmail(email)) {
      this.setState({ emailerr: 'Please enter valid Email address' })
      error = 1
    } else {
      this.setState({ emailerr: '' })
    }
    if (name.length <= 0) {
      this.setState({ nameerr: 'Please enter Name' })
      error = 1
    } else {
      this.setState({ nameerr: '' })
    }
    if (error == 0) {
      this.validationAndApiParameter('report')
    }
  }

  focusPasswordInput() {
    this.pwderr.focus()
  }

  logoutbtn = async () => {
    const keys = ['loggedIn', 'UserData', 'qr_code', 'qr_id']
    await AsyncStorage.multiRemove(keys)
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'ScanQRCodeScreen' }]
    })
    this.props.navigation.dispatch(resetAction)
  }

  componentbtn = () => {
    this.props.navigation.navigate('RegisterQRCodeScreen')
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('InspectionThankyou.reportingHeading')}
          </Text>
          <View style={styles.border} />
          <Text allowFontScaling={false} style={styles.thanktext}>
            {I18n.t('InspectionThankyou.reportingBody') +
              ` ${parseInt(this.props.route.params.qr_number)}.`}
          </Text>

          {/* <View>
           <View style={{flexDirection:"row",marginTop:30}}>
            <Text style={styles.thanktext}>Full Name:</Text>
          <TextInput
          //  placeholder='heellow haider'
           style={styles.inputField}
           onChangeText={(val)=>this.setState({FirstName:val})}

          />
          </View> 
          <View style={{flexDirection:"row",marginTop:10}}>
            <Text style={styles.thanktext}>Email Address:</Text>
          <TextInput
          //  placeholder='heellow haider'
           style={styles.inputField}
           onChangeText={(val)=>this.setState({email:val})}
           keyboardType="email-address"

          />
          </View> 
          </View> */}
          <View style={styles.form}>
            <TextInput
              autoCorrect={false}
              underlineColorAndroid="transparent"
              returnKeyType={'next'}
              selectionColor={'#000000'}
              autoFocus={false}
              placeholder={I18n.t('WarrantyClaimScreen.Name')}
              placeholderTextColor="#808080"
              // onSubmitEditing={() => this.focusEmailInput()}
              style={styles.input}
              ref="name"
              multiline={false}
              keyboardType={'default'}
              onFocus={() => this.setState({ nameerr: '' })}
              onChangeText={(name) => this.setState({ name })}
            />
            {!this.state.nameerr ? null : (
              <Text allowFontScaling={false} style={styles.error}>
                {this.state.nameerr}
              </Text>
            )}
            <TextInput
              textAlign="center"
              autoCapitalize={'none'}
              autoCorrect={false}
              ref={(c) => (this.email = c)}
              underlineColorAndroid="transparent"
              returnKeyType={'done'}
              selectionColor={'#000000'}
              multiline={false}
              autoFocus={false}
              placeholder={I18n.t('WarrantyClaimScreen.email')}
              placeholderTextColor="#808080"
              style={styles.input}
              // onSubmitEditing={() => this.focusPhoneNumberInput()}
              // ref="email"
              keyboardType={'email-address'}
              onFocus={() => this.setState({ emailerr: '' })}
              onChangeText={(email) => this.setState({ email })}
            />
            {!this.state.emailerr ? null : (
              <Text allowFontScaling={false} style={styles.error}>
                {this.state.emailerr}
              </Text>
            )}
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: 0 }}>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.conatiner,
              { marginBottom: 20, alignItems: 'center', justifyContent: 'center' }
            ]}
            onPress={() => this.childCallback()}
          >
            <LinearGradient
              colors={['#7bb3c2', '#51b6d3', '#2abae2', '#07bcef']}
              style={styles.btn}
            >
              <Text style={styles.text}>{I18n.t('InspectionThankyou.reporting')}</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          {!this.props.route.params.new_qr ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                style={{ width: '20.6%' }}
                label={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Back')}
                parentCallback={this.gobackScreen}
              />
              <Button
                style={{ width: '78.9%', marginLeft: 1 }}
                label={I18n.t('WarrantyClaimScreen.SignUp')}
                parentCallback={this.childCallback}
              />
              {/* <Button
                style={{ width: '44.9%' }}
                label={I18n.t('InspectionThankyou.Submit')}
                parentCallback={this.warrantyclaim}
              /> */}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                style={{ width: '29.3%' }}
                label={I18n.t('REGISTRATION_COMPLETE.logout')}
                parentCallback={this.logoutbtn}
              />
              <Button
                style={{ width: '70%' }}
                label={I18n.t('REGISTRATION_COMPLETE.Register')}
                parentCallback={this.componentbtn}
              />
            </View>
          )}
        </View>
        <Spinner visible={this.state.isVisible} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container1: {
    // alignItems:'center',
    flex: 3,
    paddingHorizontal: moderateScale(5),
    paddingTop: moderateScale(20),
    paddingLeft: 20,
    paddingRight: 20
  },
  thanktext: {
    fontSize: moderateScale(15),
    fontWeight: '300',
    color: '#0f0f0f',
    textAlign: 'justify'
  },
  inputField: {
    marginTop: 5,
    fontSize: moderateScale(15),
    fontWeight: '300',
    color: '#0f0f0f',
    textAlign: 'left',
    marginBottom: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '70%'
  },
  pageheading: {
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: '#32c8ed',
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 20
  },
  form: {
    paddingTop: moderateScale(20),
    flex: 1
  },
  input: {
    height: moderateScale(50),
    backgroundColor: '#ebebeb',
    borderRadius: 50,
    paddingHorizontal: 15,
    textAlign: 'center',
    marginBottom: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: moderateScale(12),
    paddingBottom: moderateScale(3)
  },
  btn: {
    width: '90%',
    // height: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
    // marginLeft:0,
  },
  text: {
    color: colors.colorWhite,
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center'
  }
})
