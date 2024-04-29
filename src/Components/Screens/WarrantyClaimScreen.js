import React, { Component } from 'react'
import { StyleSheet, Text, View, Platform, TextInput, Alert, AppState } from 'react-native'
import Header from '../Common/Header'
import * as commonFunctions from '../../utils/CommonFunctions'
import Button from '../Common/Button'
import Geocoder from 'react-native-geocoder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import Spinner from 'react-native-loading-spinner-overlay'
import I18n from '../../languages/i18n2'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'
import { moderateScale } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'

var Constant = require('../../api/ApiRules').Constant
var WebServices = require('../../api/ApiRules').WebServices

export default class WarrantyClaimScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      name: '',
      email: '',
      phone_number: '',
      qr_id: '',
      insp_id: '',
      phoneerr: '',
      emailerr: '',
      nameerr: '',
      latitude: null,
      longitude: null,
      address: '',
      permission: false,
      appState: ''
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    AsyncStorage.getItem('qrData').then((qrData) => {
      const data = JSON.parse(qrData)
      console.log(data)
      var qr_id = data.id
      this.setState({ qr_id: qr_id })
    })
    AsyncStorage.getItem('inspection_id').then((inspection_id) => {
      const insp_id = JSON.parse(inspection_id)
      this.setState({ insp_id: insp_id })
    })
    this.checkPermission()
  }

  checkPermission() {
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)')
              break
            case RESULTS.DENIED:
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
                console.log(result)
                if (result == 'granted') {
                  this.setState({ permission: true }, () => {
                    this.getLocation()
                  })
                }
              })
              break
            case RESULTS.GRANTED:
              this.setState({ permission: true }, () => {
                this.getLocation()
              })
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
                console.log(result)
              })
              break
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
    if (Platform.OS == 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)')
              break
            case RESULTS.DENIED:
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
                console.log(result)
                if (result == 'granted') {
                  this.setState({ permission: true }, () => {
                    this.getLocation()
                  })
                }
              })
              break
            case RESULTS.GRANTED:
              this.setState({ permission: true }, () => {
                this.getLocation()
              })
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
                console.log(result)
              })
              break
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  focusEmailInput() {
    this.email.focus()
  }

  focusPhoneNumberInput() {
    this.phoneerr.focus()
  }

  getLocation() {
    if (this.state.permission) {
      try {
        Geocoder.fallbackToGoogle('AIzaSyAYTpjpEFI-lVEQj5rrN3DyrbhW_6tpEEo') //old - AIzaSyBX6rKXe6Jsk6ZynShEZiNfDfyhZWgmXsQ
        Geolocation.getCurrentPosition(
          (position) => {
            var region = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            Geocoder.geocodePosition(region).then((res) => {
              var address = res[0].formattedAddress
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: address
              })
            })
          },
          (error) => {
            console.log(error.code, error.message)
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
      } catch (err) {
        console.log(err)
      }
    }
  }

  backBtn = () => {
    // const resetAction = CommonActions.reset({
    //   index: 0,
    //   routes: [{ name: 'ScanQRCodeScreen' }],
    // });
    // this.props.navigation.dispatch(resetAction);
    // this.props.navigation.dispatch(CommonActions.goBack())
    this.props.navigation.navigate('ScanQRCodeScreen')
  }

  warrantyclaimBtn = () => {
    if (this.state.permission) {
      this.validationAndApiParameter()
    }
  }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkPermission()
    }
    this.setState({ appState: nextAppState })
  }

  validationAndApiParameter() {
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
      this.setState({ nameerr: 'Please enter name' })
      error = 1
    } else {
      this.setState({ nameerr: '' })
    }
    if (phone_number.indexOf(' ') >= 0 || phone_number.length <= 0) {
      this.setState({ phoneerr: 'Please enter phone number' })
      error = 1
    } else {
      this.setState({ phoneerr: '' })
    }
    if (error == 0) {
      const data = new FormData()
      data.append('qr_id', qr_id)
      data.append('inspection_id', insp_id)
      data.append('email', email)
      data.append('name', name)
      data.append('phone_number', phone_number)
      data.append('notes', '')
      data.append('address', address)
      data.append('lat', latitude)
      data.append('lng', longitude)
      data.append('Lang', I18n.locale == 'en' ? 'english' : 'spanish')
      this.setState({ isVisible: true })
      this.postToApiCalling('POST', 'warrenty', Constant.URL_WarrantyClaim, data)
    }
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
            Alert.alert('Error', jsonRes.message)
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
    if (apiKey == 'warrenty') {
      this.props.navigation.navigate('WarrantyClaimContentScreen')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <KeyboardAwareScrollView>
          <View style={styles.container2}>
            <View style={{ alignItems: 'center' }}>
              <Text allowFontScaling={false} style={styles.headtitle}>
                {I18n.t('WarrantyClaimScreen.Heading')}
              </Text>
              <View style={styles.border} />
              <Text allowFontScaling={false} style={styles.titlecontent}>
                {I18n.t('WarrantyClaimScreen.Title')}
              </Text>
            </View>
            <View style={styles.form}>
              <TextInput
                autoCorrect={false}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                selectionColor={'#000000'}
                autoFocus={false}
                multiline={false}
                placeholder={I18n.t('WarrantyClaimScreen.Name')}
                placeholderTextColor="#808080"
                // onSubmitEditing={() => this.focusEmailInput()}
                style={styles.input}
                ref="name"
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
                autoCapitalize={'none'}
                autoCorrect={false}
                ref={(c) => (this.email = c)}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                selectionColor={'#000000'}
                autoFocus={false}
                multiline={false}
                placeholder={I18n.t('WarrantyClaimScreen.email')}
                placeholderTextColor="#808080"
                style={styles.input}
                // onSubmitEditing={() => this.focusPhoneNumberInput()}
                ref="email"
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
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                selectionColor={'#000000'}
                autoFocus={false}
                placeholder={I18n.t('WarrantyClaimScreen.phone')}
                placeholderTextColor="#808080"
                style={styles.input}
                ref="phone_number"
                multiline={false}
                keyboardType={'phone-pad'}
                returnKeyType="done"
                onSubmitEditing={() => this.warrantyclaimBtn()}
                onFocus={() => this.setState({ phoneerr: '' })}
                onChangeText={(phone_number) => this.setState({ phone_number })}
              />
              {!this.state.phoneerr ? null : (
                <Text allowFontScaling={false} style={styles.error}>
                  {this.state.phoneerr}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0
          }}
        >
          <Button
            style={{ width: '29.5%' }}
            label={I18n.t('WarrantyClaimScreen.back')}
            parentCallback={this.backBtn}
          />
          {/* <View style={{width:"5%"}}/> */}
          <Button
            style={{
              width: '72%',
              alignItems: 'center',
              borderLeftWidth: 1,
              alignItems: 'center',
              borderColor: 'white'
            }}
            label={I18n.t('WarrantyClaimScreen.Submit')}
            parentCallback={this.warrantyclaimBtn}
          />
        </View>
        <Spinner visible={this.state.isVisible} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%'
  },
  textbtn: {
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: moderateScale(10),
    color: '#3e3e3e'
  },
  container1: {
    backgroundColor: '#fff',
    paddingTop: moderateScale(2),
    height: moderateScale(150)
  },
  boxicon: {
    flexGrow: 1,
    height: null,
    width: null,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain'
  },
  headtitle: {
    fontSize: moderateScale(25),
    marginTop: moderateScale(1),
    fontWeight: '700',
    color: '#04bdf0',
    textAlign: 'center'
  },
  titlecontent: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: 5
  },
  border: {
    width: moderateScale(30),
    borderBottomWidth: moderateScale(2),
    color: '#000',
    margin: moderateScale(8)
  },
  container2: {
    paddingHorizontal: moderateScale(2)
  },
  form: {
    paddingTop: moderateScale(1.5),
    flex: 1
  },
  input: {
    height: moderateScale(50),
    backgroundColor: '#ebebeb',
    borderRadius: 50,
    textAlign: 'center',
    marginBottom: moderateScale(5),
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  smalltext: {
    fontSize: moderateScale(10),
    color: '#000',
    textAlign: 'center'
  },
  lasttext: {
    fontSize: moderateScale(12),
    color: '#000',
    textAlign: 'center',
    fontWeight: '600'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: moderateScale(3)
  },
  bottombox: {
    marginTop: moderateScale(2)
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: moderateScale(12),
    paddingBottom: moderateScale(3)
  }
})
