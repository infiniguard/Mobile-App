import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  AppState,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Header from '../Common/Header'
import Button from '../Common/Button'
import I18n from '../../languages/i18n2'
import Geocoder from 'react-native-geocoder'
import Geolocation from 'react-native-geolocation-service'
import Modal from 'react-native-modal'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import { moderateScale } from 'react-native-size-matters'
import { Constant, WebServices } from '../../api/ApiRules'
import ImagePicker from 'react-native-image-crop-picker'

let frame = require('../../Themes/Images/frame.png')
let edit = require('../../Themes/Images/edit-pin.png')

let images = []
var image_name = [
  'condenser_coil1',
  'condenser_coil2',
  'cabinet1',
  'cabinet2',
  'evaporator_coil1',
  'evaporator_coil2'
]

export default class ReviewPicture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: '',
      qr_id: '',
      seller_id: '',
      images: props.route.params.images,
      latitude: null,
      longitude: null,
      address: '',
      isVisible: false,
      permission: false,
      appState: AppState.currentState,
      additionalImage1: '',
      additionalImage2: '',
      equipment_type: false,
      showModal: false,
      note: '',
      data: props.route.params.data,
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
          (error) => console.log('error ' + error.message),
          { enableHighAccuracy: false, timeout: 50000, maximumAge: 80000 }
        )
      } catch (err) {
        console.log(err)
      }
    }
  }

  validationAndApiParameter(apiname) {
    if (apiname == 'register_qr') {
      const {
        images,
        note,
        data,
        address,
        latitude,
        longitude,
        additionalImage1,
        additionalImage2,
        equipment_type
      } = this.state
      const data1 = new FormData()
      data1.append('qr_id', data.qr_id)
      data1.append('seller_id', data.seller_id)
      data1.append('condenser_coil', data.condenser_coil)
      data1.append('cabinet', data.cabinet)
      data1.append('serial_number', data.serial_number)
      data1.append('evaporator_coil', data.evaporator_coil)
      data1.append('address', address)
      data1.append('lat', latitude)
      data1.append('lng', longitude)
      data1.append('notes', note)
      data1.append('equipment_type', false)
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
        if (images[i] != '') {
          console.log('dsd', image)
          data1.append('equipment_pic' + i, {
            uri: image,
            type: 'image/jpeg',
            name: image_name[i] + '.jpg'
          })
        } else {
          data1.append('equipment_pic' + i, '')
        }
      }

      console.log('data1', data1)
      this.setState({ isVisible: true })
      this.postToApiCalling('POST', apiname, Constant.URL_qrRegister, data1)
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
        console.log(jsonRes)
        this.setState({ isVisible: false })
        if (!jsonRes || jsonRes.code == 0) {
          setTimeout(() => {
            Alert.alert('Sorry', I18n.t('error_message.alreadyExits'))
          }, 200)
        } else {
          if (jsonRes.code == 1) {
            this.setState({ isVisible: false })
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
    if (apiKey == 'register_qr') {
      images = []
      this.props.navigation.navigate('ThankyouScreen', {
        qr_id: this.state.data.qr_id,
        address: this.state.address,
        qr_number: jsonRes.qr_number
      })
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
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    }).then((image) => {
      images[index] = 'file://' + image.path
      this.setState({ images: images, imageModel: false })
    })
  }

  resetCall = () => {
    images = []
    count = 0
    setData1(props.route.params.data)
    for (let i = 0; i <= 1; i++) {
      images[i] = ''
    }
  }

  submitBtn = () => {
    if (this.state.permission) {
      this.validationAndApiParameter('register_qr')
    }
  }

  backbtn = () => {
    // this.resetCall()
    this.props.route.params.onResetDataL()
    // this.props.navigation.navigate('EquipmentPicsScreen')
    this.props.navigation.navigate('RegisterQRCodeScreen')
  }

  // componentWillUnmount() {
  //     AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  clickImage(index) {
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
    // const options = {
    //   quality: 1.0,
    //   maxWidth: moderateScale(800),
    //   maxHeight: moderateScale(800),
    //   storageOptions: {
    //     skipBackup: true
    //   },
    //   multiple: false
    // }
    // launchCamera(options, (response) => {
    //   this.setState({ imageModel: false })
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker')
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error)
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton)
    //   } else {
    //     if (index == '2') {
    //       this.setState({ additionalImage1: response.uri })
    //     } else if (index == '3') {
    //       this.setState({ additionalImage2: response.uri })
    //     }
    //   }
    // })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <ScrollView style={styles.sview}>
          <View style={styles.container1}>
            <Text allowFontScaling={false} style={styles.pageheading}>
              {I18n.t('ReviewPicture.title1')}
            </Text>
            <View style={styles.border} />
            <Text allowFontScaling={false} style={styles.pageTitle}>
              {I18n.t('ReviewPicture.title2')}
            </Text>
          </View>
          <View style={styles.container2}>
            <View style={styles.buttonbox}>
              <View style={styles.equipics}>
                {console.log(this.state.images[0])}
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={this.showImageModel.bind(this, 0)}
                  style={styles.equipics1}
                >
                  <Image style={styles.boxicon} source={{ uri: this.state.images[0] }} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={this.showImageModel.bind(this, 1)}
                  style={styles.equipics1}
                >
                  <Image style={styles.boxicon} source={{ uri: this.state.images[1] }} />
                </TouchableOpacity>
              </View>
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
          <View style={styles.questionbox}>
            {/* <View style={{width:'70%'}}>
                            <Text allowFontScaling={false} style={styles.questionheading}>{I18n.t('ReviewPicture.equipment_type')}</Text>
                        </View> */}
            {/* <View style={{width:'30%',alignItems:'flex-end'}}> */}
            {/* <FlipToggle
                                value={this.state.equipment_type}
                                buttonOnColor={"#4eb4c4"}
                                buttonOffColor={"#9e9e9e"}
                                sliderOnColor={"#ffffff"}
                                sliderOffColor={"#ffffff"}
                                buttonWidth={moderateScale(90)}
                                buttonHeight={moderateScale(25)}
                                buttonRadius={moderateScale(50)}
                                onLabel={I18n.t('ReviewPicture.new')}
                                offLabel={I18n.t('ReviewPicture.used')}
                                onToggle={(value) => {
                                    this.setState({ equipment_type: value });
                                }}
                                onToggleLongPress={(value) => {
                                    this.setState({ equipment_type: value });
                                }}
                            /> */}
            {/* </View> */}
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
                  {I18n.t('ReviewPicture.edit_node')}
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0
          }}
        >
          <Button
            style={{ width: '29.2%' }}
            label={I18n.t('ReviewPicture.back')}
            parentCallback={this.backbtn}
          />
          <Button
            style={{ width: '70.4%' }}
            label={I18n.t('ReviewPicture.submit')}
            parentCallback={this.submitBtn}
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
        <Spinner visible={this.state.isVisible} />
        {/* <Modal isVisible={this.state.imageModel} style={{backgroundColor:"back",flex:1}}>
                    <View style={{flex:1}}>
                    <Image style={styles.boxicon} resizeMode="contain" source={{ uri: this.state.modalImage }} />
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ imageModel: false })}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>{"Cancel"}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() =>  {
                                        if(this.state.seletedIndex>=2)
                                        this.clickImage(this.state.seletedIndex)
                                        else
                                        this.selectPhotoTapped(this.state.seletedIndex)
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>{"Retake"}</Text>
                                    </TouchableOpacity>
                    </View>

                    </View>
                  
                </Modal> */}
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
  container1: {
    paddingTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(10),
    paddingHorizontal: moderateScale(5)
  },
  border: {
    width: moderateScale(50),
    borderBottomWidth: moderateScale(2),
    color: '#13b0dd',
    margin: moderateScale(5)
  },
  pageheading: {
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: '#32c8ed',
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
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonbox: {
    width: '90%',
    marginBottom: moderateScale(15)
  },
  equipics: {
    height: moderateScale(160),
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10)
  },
  equipics1: {
    flexDirection: 'column',
    width: '100%',
    marginRight: moderateScale(15)
  },
  boxicon: {
    height: '100%',
    width: '100%'
  },
  sview: {
    marginBottom: moderateScale(60)
  },
  questionbox: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20)
  },
  questionheading: {
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
