import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  AppState,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native'
import { colors } from '../../Themes/color'
import Button from '../Common/Button'
import Header from '../Common/Header'
import I18n from '../../languages/i18n2'
import { launchCamera } from 'react-native-image-picker'

import Spinner from 'react-native-loading-spinner-overlay'
import { moderateScale } from 'react-native-size-matters'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'
import Geocoder from 'react-native-geocoder'
import { CommonActions } from '@react-navigation/native'
import { Constant, WebServices } from '../../api/ApiRules'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
var edit = require('../../Themes/Images/edit-pin.png')
import { useRingerMode, RINGER_MODE } from 'react-native-ringer-mode'
import ImagePicker from 'react-native-image-crop-picker'

const frame = require('../../Themes/Images/frame.png')

let images = []

let image_name = [
  'condenser_coil1',
  'condenser_coil2',
  'cabinet1',
  'cabinet2',
  'evaporator_coil1',
  'evaporator_coil2'
]

export default class InspectionReviewScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      tempImage: [],
      data: '',
      appState: AppState.currentState,
      isVisible: false,
      additionalImage1: '',
      additionalImage2: '',
      imageHeight: null,
      imageWidth: null,
      note: '',
      showModal: false,
      imageModel: false,
      modalImage: null,
      seletedIndex: null
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
    var all_images = this.props.route.params.images
    images = all_images
    var data = this.props.route.params.data
    this.setState({
      images: images,
      data: data
    })

    this.checkPermission()
  }

  // componentWillUnmount() {

  //     AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkPermission()
    }
    this.setState({ appState: nextAppState })
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
              break
            case RESULTS.BLOCKED:
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
              break
            case RESULTS.BLOCKED:
              break
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  getLocation() {
    if (this.state.permission) {
      try {
        Geocoder.fallbackToGoogle('AIzaSyBX6rKXe6Jsk6ZynShEZiNfDfyhZWgmXsQ')
        Geolocation.getCurrentPosition(
          (position) => {
            var region = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            console.log('lat', region)
            Geocoder.geocodePosition(region).then((res) => {
              var address = res[0].formattedAddress
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: address
              })
            })
          },
          (error) => console.log('error ' + error.message),
          { enableHighAccuracy: false, timeout: 50000, maximumAge: 80000 }
        )
      } catch (err) {
        console.log(err)
      }
    }
  }

  showImageModel(index) {
    if (index == 2)
      this.setState({
        imageModel: true,
        modalImage: this.state.additionalImage1,
        seletedIndex: index
      })
    else if (index == 3)
      this.setState({
        imageModel: true,
        modalImage: this.state.additionalImage2,
        seletedIndex: index
      })
    if (index != 2 && index != 3)
      this.setState({ imageModel: true, modalImage: this.state.images[index], seletedIndex: index })
  }

  selectPhotoTapped(index) {
    // const options = {
    //   quality: 1.0,
    //   width: Dimensions.get('window').width,
    //   height: (deviceWidth * 3) / 4,
    //   storageOptions: {
    //     skipBackup: true
    //   },
    //   multiple: false
    // }
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    }).then((image) => {
      images[index] = 'file://' + image.path
      this.setState({ images: images, imageModel: false })
    })
    // launchCamera(options, (response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker')
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error)
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton)
    //   } else {

    //     images[index] = response.uri
    //     this.setState({ images: images, imageModel: false })
    //   }
    // })
  }

  clickImage(index) {
    // const options = {
    //   quality: 1.0,
    //   width: Dimensions.get('window').width,
    //   height: (Dimensions.get('window').width * 3) / 4,

    //   storageOptions: {
    //     skipBackup: true
    //   },
    //   multiple: false
    // }
    // launchCamera(options, (response) => {
    //   console.log('Response = ', response)
    //   this.setState({ imageModel: false })
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker')
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error)
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton)
    //   } else {
    //     if (index == '2') {
    //       this.setState({ additionalImage1: response.uri, imageModel: false })
    //     } else if (index == '3') {
    //       this.setState({ additionalImage2: response.uri, imageModel: false })
    //     }
    //   }
    // })
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    }).then((image) => {
      this.setState({ imageModel: false })
      images[index] = 'file://' + image.path
      this.setState({ images: images, imageModel: false })
      if (index == '2') {
        this.setState({ additionalImage1: 'file://' + image.path, imageModel: false })
      } else if (index == '3') {
        this.setState({ additionalImage2: 'file://' + image.path, imageModel: false })
      }
    })
  }

  back = () => {
    // const resetAction = CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: 'InspectionPicScreen', params: { data: this.state.data } }],
    // });
    this.props.route.params.onResetDataL()
    this.props.navigation.navigate('ScanQRCodeScreen')
    // this.props.navigation.dispatch(resetAction);
  }

  childCallback = () => {
    if (this.state.permission) {
      this.validationAndApiParameter('inspection_qr')
    }
  }

  validationAndApiParameter(apiname) {
    if (apiname == 'inspection_qr') {
      const {
        images,
        data,
        address,
        note,
        latitude,
        longitude,
        additionalImage1,
        additionalImage2
      } = this.state
      const data1 = new FormData()
      data1.append('qr_id', data.qr_id)
      data1.append('address', address)
      data1.append('lat', latitude)
      data1.append('lng', longitude)
      data1.append('notes', note)
      data1.append(
        'additionalImage1',
        additionalImage1 == ''
          ? ''
          : {
              uri: additionalImage1,
              type: 'image/jpeg',
              name: 'additional1.jpg'
            }
      )
      data1.append(
        'additionalImage2',
        additionalImage2 == ''
          ? ''
          : {
              uri: additionalImage2,
              type: 'image/jpeg',
              name: 'additional2.jpg'
            }
      )

      var image = ''
      for (let i = 0; i <= 1; i++) {
        image = images[i]
        console.log('imasse', image)
        if (image[i] != '') {
          data1.append('equipment_pic' + i, {
            uri: image,
            type: 'image/jpeg',
            name: image_name[i] + '.jpg'
          })
        } else {
          data1.append('equipment_pic' + i, '')
        }
      }

      this.setState({ isVisible: true })
      this.postToApiCalling('POST', apiname, Constant.URL_qrInspection, data1)
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
        console.log('jsonReds', jsonRes)
        this.setState({ isVisible: false })
        if (!jsonRes || jsonRes.code == 0) {
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
    if (apiKey == 'inspection_qr') {
      var jdata = jsonRes.result
      images = []
      console.log('jdata.qr_number', jsonRes.qr_number)
      await AsyncStorage.setItem('inspection_id', JSON.stringify(jdata))
      this.props.navigation.navigate('InspectionThankyouScreen', {
        qr_id: this.state.data.qr_id,
        address: this.state.address,
        qr_number: jsonRes.qr_number
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <ScrollView style={styles.sview}>
          <View style={styles.container1}>
            <Text allowFontScaling={false} style={styles.pageheading}>
              {I18n.t('InspectionReview.title1')}
            </Text>
            <View style={styles.border} />
            <Text allowFontScaling={false} style={styles.pageTitle}>
              {I18n.t('InspectionReview.title2')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.container2}>
              <View style={styles.buttonbox}>
                <View style={styles.equipics}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.showImageModel(0)}
                    style={styles.equipics1}
                  >
                    <Image style={styles.boxicon} source={{ uri: this.state.images[0] }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.showImageModel(1)}
                    style={styles.equipics1}
                  >
                    <Image style={styles.boxicon} source={{ uri: this.state.images[1] }} />
                  </TouchableOpacity>
                </View>
                <View style={{ marginVertical: moderateScale(10), alignItems: 'center' }} />

                <View style={styles.equipics}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      if (this.state.additionalImage1) this.showImageModel('2')
                      else this.clickImage('2')
                    }}
                    style={styles.equipics1}
                  >
                    {this.state.additionalImage1 == '' ? (
                      <Image resizeMode="contain" style={styles.boxicon} source={frame} />
                    ) : (
                      <Image style={styles.boxicon} source={{ uri: this.state.additionalImage1 }} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      if (this.state.additionalImage2) this.showImageModel('3')
                      else this.clickImage('3')
                    }}
                    style={styles.equipics1}
                  >
                    {this.state.additionalImage2 == '' ? (
                      <Image resizeMode="contain" style={styles.boxicon} source={frame} />
                    ) : (
                      <Image style={styles.boxicon} source={{ uri: this.state.additionalImage2 }} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          {this.state.note.length == 0 ? (
            <View style={styles.bottomText}>
              <TouchableOpacity
                style={{
                  borderColor: '#e1e1e1',
                  borderWidth: moderateScale(1),
                  padding: moderateScale(5)
                }}
                activeOpacity={0.8}
                onPress={() => this.setState({ showModal: true })}
              >
                <Text style={styles.noteText}>{I18n.t('ReviewPicture.addNotes')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, padding: moderateScale(20) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    flex: 1,
                    fontWeight: 'bold',
                    color: '#000'
                  }}
                >
                  {I18n.t('ReviewPicture.note_tile')}
                </Text>
                <TouchableOpacity onPress={() => this.setState({ showModal: true })}>
                  <Image
                    source={edit}
                    style={{ width: moderateScale(12), height: moderateScale(12) }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: moderateScale(12), color: '#000', width: '100%' }}>
                {this.state.note}
              </Text>
            </View>
          )}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            style={{ width: '29.5%' }}
            label={I18n.t('InspectionReview.back')}
            parentCallback={this.back}
          />
          <Button
            style={{ width: '70%' }}
            label={I18n.t('InspectionReview.submit')}
            parentCallback={this.childCallback}
          />
        </View>
        <Modal isVisible={this.state.showModal} style={{ margin: 0 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <KeyboardAvoidingView
              behavior="padding"
              style={{
                borderRadius: moderateScale(5),
                backgroundColor: '#e1e1e1',
                width: '90%',
                height: moderateScale(250)
              }}
            >
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginVertical: moderateScale(5),
                  fontWeight: 'bold'
                }}
              >
                {I18n.t('ReviewPicture.header')}
              </Text>
              <View style={{ flex: 1, padding: moderateScale(10) }}>
                <TextInput
                  allowFontScaling={false}
                  autoCapitalize={'sentences'}
                  autoFocus={true}
                  maxLength={280}
                  multiline
                  value={this.state.note}
                  numberOfLines={5}
                  onChangeText={(text) => this.setState({ note: text })}
                  placeholder={I18n.t('ReviewPicture.placeholder')}
                  style={{
                    flex: 1,
                    color: '#000',
                    backgroundColor: '#fff',
                    borderRadius: moderateScale(5)
                  }}
                  textAlignVertical="top"
                />
                <View
                  style={{
                    width: '100%',
                    alignItems: 'flex-end',
                    paddingVertical: moderateScale(10)
                  }}
                >
                  <Text>{this.state.note.length}/280</Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: moderateScale(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  borderColor: '#999',
                  borderTopWidth: moderateScale(1)
                }}
              >
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() =>
                      this.setState({ showModal: false, note: this.state.note.trim() })
                    }
                  >
                    <Text style={{ color: '#007AFF', fontWeight: '400' }}>
                      {I18n.t('ReviewPicture.ok')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
        <Modal
          statusBarTranslucent={true}
          animationType="fade"
          transparent={false}
          isVisible={this.state.imageModel}
          style={{ backgroundColor: 'black', flex: 1, margin: 0 }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image
              style={{ width: Dimensions.get('window').width, height: '50%' }}
              source={{ uri: this.state.modalImage }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: 25,
                backgroundColor: '#131313'
              }}
            >
              <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  if (this.state.seletedIndex >= 2) this.clickImage(this.state.seletedIndex)
                  else this.selectPhotoTapped(this.state.seletedIndex)
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 17 }}>{'Retake'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: 'center' }}
                onPress={() => this.setState({ imageModel: false })}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 17 }}>
                  {'Use Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Spinner visible={this.state.isVisible} />
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
    paddingTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(15),
    paddingHorizontal: moderateScale(5)
  },
  border: {
    width: moderateScale(30),
    borderBottomWidth: moderateScale(2),
    color: '#13b0dd',
    margin: moderateScale(1)
  },
  pageheading: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    color: colors.loginPrimary,
    width: '100%',
    fontWeight: 'bold'
  },
  pageTitle: {
    fontSize: moderateScale(14),
    paddingTop: moderateScale(5),
    fontWeight: '700',
    textAlign: 'center',
    width: '100%'
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonbox: {
    width: '90%',
    marginBottom: moderateScale(15)
  },
  equipics: {
    height: moderateScale(150),
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  equipics1: {
    flexDirection: 'column',
    width: '100%',
    marginRight: moderateScale(8)
  },
  boxicon: {
    height: '100%',
    width: '100%',
    aspectRatio: 4 / 4
  },
  noteText: {
    fontSize: moderateScale(14)
  },
  bottomText: {
    width: '100%',
    paddingHorizontal: moderateScale(20),
    height: moderateScale(60),
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  noteText: {
    fontSize: moderateScale(14)
  }
})
