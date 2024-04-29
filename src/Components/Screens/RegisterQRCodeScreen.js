import React, { Component } from 'react'
import { StyleSheet, Text, View, Platform, Alert } from 'react-native'
import { QRscanner } from 'react-native-qr-scanner'
import Header from '../Common/Header'
import I18n from '../../languages/i18n2'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Constant, WebServices } from '../../api/ApiRules'
import { moderateScale } from 'react-native-size-matters'
import LoginHeader from '../Common/LoginHeader'
export default class RegisterQRCodeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flashMode: false,
      zoomIOS: 0,
      zoom: 0.2,
      qr_id: '',
      start: false,
      isLogin: false,
      checkPermission: null,
      isScanning: false,
      scannedData: null
    }
  }

  componentDidMount() {
    const { navigation } = this.props

    this.setState({ isScanning: true, scannedData: null })
    console.log('I18n.locale', I18n.locale)
    this.focusListener = navigation.addListener('focus', () => {
      setTimeout(() => {
        this.setState({ isScanning: true, scannedData: null })
      }, 1000)
    })
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

  onRead = async (res) => {
    var data = await res.data
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
  }

  validationAndApiParameter(apiname, qr_code) {
    if (apiname == 'qrCodeCheck') {
      AsyncStorage.setItem('qr_code', JSON.stringify(qr_code))
      const data = new FormData()
      data.append('qr_code', qr_code)
      data.append('Lang', I18n.locale == 'en' ? 'english' : 'spanish')
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
        this.setState({ isVisible: false })
        if (!jsonRes || jsonRes.code == 0) {
          setTimeout(() => {
            Alert.alert(jsonRes.message)
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
          Alert.alert('Server Error')
        }, 200)
      })
  }

  apiSuccessfullResponse(apiKey, jsonRes) {
    if (apiKey == 'qrCodeCheck') {
      var code = jsonRes.code
      var jdata = jsonRes.result
      this.setState({ scannedData: jsonRes, isScanning: false })
      if (code == 1) {
        console.log('insert')
        AsyncStorage.setItem('qr_id', JSON.stringify(jdata.id))
        this.props.navigation.navigate('SelectComponentScreen')
      } else if (code == 2) {
        var jdata = jsonRes.result[0]
        var inspection_date = jsonRes.inspection_date
        var current_date = jsonRes.current_date
        var qr_code = jsonRes.qr_code
        AsyncStorage.setItem('qrData', JSON.stringify(jdata))
        this.props.navigation.navigate('InspectionScreen', {
          inspection_date: inspection_date,
          current_date: current_date,
          qr_code: qr_code
        })
        // this.props.navigation.navigate('VerificationInfo');
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
        <LoginHeader navigation={this.props.navigation} updateAlert={this.updateAlert} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('Scan_QR_Code_For_Equipment_Registeration.Title')}
          </Text>
        </View>
        <View style={styles.container2}>
          {isScanning ? (
            <QRscanner
              onRead={this.onRead}
              allowFontScaling={false}
              flashMode={this.state.flashMode}
              zoom={Platform.OS === 'ios' ? this.state.zoomIOS : this.state.zoom}
              finderY={10}
              aspectRatio={3 / 4}
              scanBarColor={'white'}
              cornerColor={'white'}
              scanBarHeight={4.5}
              hintText={I18n.t('Scan_QR_Code_For_Equipment_Registeration.Camera_Text')}
              hintTextStyle={styles.hintTextStyle}
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
    paddingTop: 0
  },
  content: {
    flex: 1,
    height: '70%',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: '5%'
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
    color: '#32c8ed',
    width: '100%'
  },
  container2: {
    backgroundColor: '#000',
    flex: 1
  },
  hintTextStyle: {
    color: '#74b3c5',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    padding: moderateScale(5),
    textAlign: 'center'
  }
})
