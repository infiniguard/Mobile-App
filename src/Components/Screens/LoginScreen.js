import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { colors } from '../../Themes/color'
import Header from '../Common/Header'
import I18n from '../../languages/i18n2'
import { moderateScale } from 'react-native-size-matters'
import Button from '../Common/RoundButton'
import Spinner from 'react-native-loading-spinner-overlay'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Constant, WebServices } from '../../api/ApiRules'
import * as commonFunctions from '../../utils/CommonFunctions'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailerr: '',
      password: '',
      pwderr: ''
    }
  }

  componentDidMount() {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      })
    )
      .then((result) => {
        console.log(result)
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)')
            break
          case RESULTS.DENIED:
            request(
              Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              })
            ).then((result) => {
              console.log(result)
              if (result == 'granted') {
                this.setState({ permission: true })
              }
            })
            break
          case RESULTS.GRANTED:
            this.setState({ permission: true })
            request(
              Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              })
            ).then((result) => {
              console.log(result)
            })
            break
          case RESULTS.BLOCKED:
            break
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  focusPasswordInput() {
    this.pwderr.focus()
  }

  postToApiCalling(method, apiKey, apiUrl, data) {
    new Promise(function (resolve, reject) {
      if (method == 'POST') {
        resolve(WebServices.callWebService(apiUrl, data))
      } else {
        resolve(WebServices.callWebService_GET(apiUrl, data))
      }
    })
      .then((jsonRes) => {
        this.setState({ isVisible: false })
        if (!jsonRes || jsonRes.code == 0) {
          setTimeout(() => {
            if (jsonRes.message == 'Please verify your username and/or password.')
              Alert.alert(
                I18n.t('Certified_Applicator_Login.not_exits_title'),
                I18n.t('Certified_Applicator_Login.not_exits')
              )
            else if (
              jsonRes.message == 'Please contact info@infiniguard.com for additional assistance.'
            )
              Alert.alert(
                I18n.t('Certified_Applicator_Login.accout_disable_title'),
                I18n.t('Certified_Applicator_Login.accout_disable')
              )
          }, 200)
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

  apiSuccessfullResponse(apiKey, jsonRes) {
    if (apiKey == 'login') {
      var jdata = jsonRes.data
      AsyncStorage.setItem('loggedIn', JSON.stringify(true))
      AsyncStorage.setItem('UserData', JSON.stringify(jdata))
      this.props.navigation.navigate('RegisterQRCodeScreen')
    }
  }

  childCallback = () => {
    const { email, password } = this.state
    var error = 0
    if (email.indexOf(' ') >= 0 || email.length <= 0) {
      this.setState({ emailerr: I18n.t('Certified_Applicator_Login.empty_email') })
      error = 1
    } else if (!commonFunctions.validateEmail(email)) {
      this.setState({ emailerr: I18n.t('Certified_Applicator_Login.valid_email') })
      error = 1
    } else {
      this.setState({ emailerr: '' })
    }
    if (password.indexOf(' ') >= 0 || password.length <= 0) {
      this.setState({ pwderr: I18n.t('Certified_Applicator_Login.empty_password') })
      error = 1
    } else {
      this.setState({ pwderr: '' })
    }
    if (error == 0) {
      const data = new FormData()
      data.append('email', email)
      data.append('password', password)
      console.log(data)
      this.setState({ isVisible: true })
      this.postToApiCalling('POST', 'login', Constant.URL_login, data)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.main}>
          <KeyboardAwareScrollView>
            <View style={{ alignItems: 'center', paddingHorizontal: moderateScale(3) }}>
              <Text allowFontScaling={false} style={styles.headtitle}>
                {I18n.t('Certified_Applicator_Login.Title')}
              </Text>
              <View style={styles.border} />
            </View>
            <View style={styles.container2}>
              <TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                selectionColor={'#000000'}
                onSubmitEditing={() => this.focusPasswordInput()}
                autoFocus={false}
                multiline={false}
                placeholder={I18n.t('Certified_Applicator_Login.email')}
                placeholderTextColor="#808080"
                style={styles.input}
                keyboardType={'email-address'}
                onFocus={() => this.setState({ emailerr: '' })}
                onChangeText={(email) => this.setState({ email })}
              />
              {!this.state.emailerr ? null : (
                <Text allowFontScaling={false} style={styles.error}>
                  {this.state.emailerr}
                </Text>
              )}
              <TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                ref={(c) => (this.pwderr = c)}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                selectionColor={'#000000'}
                onSubmitEditing={() => this.childCallback()}
                placeholder={I18n.t('Certified_Applicator_Login.pass')}
                placeholderTextColor="#808080"
                style={styles.input}
                secureTextEntry
                multiline={false}
                returnKeyType="done"
                onFocus={() => this.setState({ pwderr: '' })}
                secureTextEntry={true}
                blurOnSubmit={false}
                onChangeText={(password) => this.setState({ password })}
              />
              {!this.state.pwderr ? null : (
                <Text allowFontScaling={false} style={styles.error}>
                  {this.state.pwderr}
                </Text>
              )}
              <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.forgotBox}
                  onPress={() => this.props.navigation.navigate('ForgotPassword')}
                >
                  <Text allowFontScaling={false} style={styles.smalltext}>
                    {I18n.t('Forgot_Text.title')}
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                label={I18n.t('Certified_Applicator_Login.login_button')}
                parentCallback={this.childCallback}
              />
            </View>
          </KeyboardAwareScrollView>
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
  content: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%'
  },
  headtitle: {
    fontSize: moderateScale(22),
    marginTop: moderateScale(5),
    fontWeight: '700',
    color: '#04bdf0',
    textAlign: 'center'
  },
  border: {
    width: moderateScale(50),
    borderBottomWidth: moderateScale(2),
    color: '#000',
    margin: moderateScale(5)
  },
  container2: {
    padding: moderateScale(15),
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
  smalltext: {
    fontSize: moderateScale(14),
    color: '#000',
    textAlign: 'center'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: moderateScale(10)
  },
  error: {
    color: colors.colorRed,
    textAlign: 'center',
    fontSize: moderateScale(12),
    paddingBottom: moderateScale(5)
  },
  forgotBox: {
    paddingVertical: moderateScale(10)
  }
})
