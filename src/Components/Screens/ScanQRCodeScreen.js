import React, { Component } from 'react'
import { StyleSheet, View, Text, Alert, PermissionsAndroid } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { colors } from '../../Themes/color'
import Header from '../Common/Header'
import I18n from '../../languages/i18n2'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QRscanner } from 'react-native-qr-scanner'
import { Constant, WebServices } from '../../api/ApiRules'
import { withNavigationFocus } from 'react-navigation'
import { RNCamera } from 'react-native-camera'

export default class ScanQRCodeScreen extends Component {
  constructor(props) {
    super(props)
    this.scannerRef = React.createRef()
    this.state = {
      flashMode: false,
      zoomIOS: 0,
      zoom: 0.2,
      start: false,
      isLogin: false,
      checkPermission: null,
      isScanning: false,
      scannedData: null
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this.getLanguageSelection()
    this.setState({ isScanning: true, scannedData: null })
    console.log('I18n.locale', I18n.locale)
    this.focusListener = navigation.addListener('focus', () => {
      setTimeout(() => {
        this.setState({ isScanning: true, scannedData: null })
      }, 1000)
    })
    // setTimeout(() => {

    //     this.permision();
    //   this.setState({start:true})
    // }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (this.props.isFocused) {
        this.setState({ isScanning: true, scannedData: null })
      } else {
        this.setState({ isScanning: false })
      }
    }
  }
  resetScanner = () => {
    if (this.scannerRef.current) {
      this.scannerRef.current.reactivate()
    }
  }

  getLanguageSelection = async () => {
    await AsyncStorage.getItem('SelectedLang').then((val) => {
      I18n.locale = val
      console.log('18n.localed', I18n.locale)
    })
    //   let login = JSON.stringify(AsyncStorage.getItem("loggedIn"))
    //     if(login==true){
    // ß this.setState({isLogin:login})
    //     }
    await AsyncStorage.getItem('loggedIn').then((val) => {
      if (val == null) console.log('val==', null)
      else this.setState({ isLogin: val })
    })
  }

  permision = async () => {
    let perms = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]
    const granted = await PermissionsAndroid.requestMultiple(perms, {
      title: 'Cool Photo App Camera Permission',
      message: 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    })
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('hee')
    } else {
      console.log('sdsd')
    }
  }

  onRead = async (res) => {
    var data = await res.data
    if (data) {
      if (data.indexOf('infiniguard') != -1) {
        var qr_arr = data.split(',')
        var qr_code = qr_arr[0].trim()
        this.validationAndApiParameter('qrCodeCheck', qr_code)
      } else if (data.indexOf('IMTA') != -1) {
        var qr_arr = data.split(' ')
        var qr_text = qr_arr[1]
        var qr_code = qr_text.slice(2, qr_text.length)
        console.log(qr_code)
        this.validationAndApiParameter('qrCodeCheck', qr_code)
      } else {
        this.setState({ isScanning: false })
        this.props.navigation.navigate('VerificationError')
      }
      this.resetScanner()
    }
  }

  validationAndApiParameter(apiname, qr_code) {
    if (apiname == 'qrCodeCheck') {
      const data = new FormData()
      data.append('qr_code', parseInt(qr_code))
      data.append('Lang', I18n.locale == 'en' ? 'english' : 'spanish')

      // data.append()
      console.log('dadta', data)
      this.postToApiCalling('POST', apiname, Constant.URL_qrScan, data)
    }
  }

  postToApiCalling(method, apiKey, apiUrl, data) {
    new Promise(function (resolve, reject) {
      if (method == 'POST') {
        resolve(WebServices.callWebService(apiUrl, data))
      } else {
        resolve(WebServices.callWebService_POST(apiUrl, data))
      }
    })
      .then((jsonRes) => {
        console.log(jsonRes)
        this.setState({ isVisible: false })
        if (!jsonRes || jsonRes.code == 0) {
          setTimeout(() => {
            console.log('jsonRes', jsonRes)
            // Alert.alert(jsonRes);
          }, 200)
        } else {
          if (jsonRes.code != 0) {
            this.apiSuccessfullResponse(apiKey, jsonRes)
          }
        }
      })
      .catch((error) => {
        console.log('ERROR' + error)
        this.setState({ isVisible: false })
        setTimeout(() => {
          Alert.alert('Internet issue')
        }, 200)
      })
  }

  apiSuccessfullResponse(apiKey, jsonRes) {
    if (apiKey == 'qrCodeCheck') {
      console.log(jsonRes)
      var code = jsonRes.code
      this.setState({ scannedData: jsonRes, isScanning: false })
      if (code == 1 && this.state.isLogin == false) {
        var jdata = jsonRes.result
        AsyncStorage.setItem('qr_id', JSON.stringify(jdata.id))
        this.props.navigation.navigate('LoginScreen')
      } else if (this.state.isLogin && code == 1) {
        var jdatad = jsonRes.result

        AsyncStorage.setItem('qr_id', JSON.stringify(jdatad.id))
        this.props.navigation.navigate('SelectComponentScreen')
      } else if (code == 2) {
        var jdata = jsonRes.result[0]
        var inspection_date = jsonRes.inspection_date
        var current_date = jsonRes.current_date
        var qr_code = jsonRes.qr_code
        AsyncStorage.setItem('qrData', JSON.stringify(jdata))
        // this.setState({start:false});
        this.props.navigation.navigate('InspectionScreen', {
          inspection_date: inspection_date,
          current_date: current_date,
          qr_code: qr_code
        })
      } else if (code == 3) {
        this.setState({ isScanning: false })
        this.props.navigation.navigate('VerificationError')
      }
    }
  }

  render() {
    const { isScanning, scannedData } = this.state

    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('page2.headerText')}
          </Text>
        </View>
        <View style={styles.container2}>
          {isScanning ? (
            <QRscanner
              ref={this.scannerRef}
              onRead={this.onRead}
              flashMode={this.state.flashMode}
              allowFontScaling={false}
              zoom={Platform.OS === 'ios' ? this.state.zoomIOS : this.state.zoom}
              finderY={5}
              finderX={10}
              aspectRatio={3 / 4}
              type={RNCamera.Constants.Type.back}
              PixelRatio={307200}
              scanBarColor={'white'}
              cornerColor={'white'}
              reactivate={true}
              reactivateTimeout={5000}
              scanBarHeight={3.4}
              hintText={I18n.t('page2.cameraText')}
              hintTextStyle={styles.hinttext}
              hintTextPosition={20}
            />
          ) : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorWhite
  },
  container1: {
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageheading: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'center',
    color: '#00BDF2',
    width: '100%'
  },
  container2: {
    backgroundColor: '#000',
    flex: 1
  },
  hinttext: {
    textAlign: 'center',
    padding: moderateScale(10),
    color: '#74b3c5',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  }
})
