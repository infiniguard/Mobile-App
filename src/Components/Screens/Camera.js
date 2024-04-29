import React, { Component } from 'react'
import { StyleSheet, View, Text, Alert, Dimensions, Vibration } from 'react-native'
import Header from '../Common/Header'
import { moderateScale } from 'react-native-size-matters'
import I18n from '../../languages/i18n2'
import Button from '../Common/Button'
import SystemSetting from 'react-native-system-setting'
import Silent from 'react-native-silent'
import { Camera } from 'react-native-vision-camera'

import { RINGER_MODE, getRingerMode, RingerModeType } from 'react-native-ringer-mode'

const modeText = {
  [RINGER_MODE.silent]: 'Silent',
  [RINGER_MODE.normal]: 'Normal',
  [RINGER_MODE.vibrate]: 'Vibrate'
}
const ONE_SECOND_IN_MS = 100

var images = []
var count = 0

export default class InspectionPicScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      type: '',
      images: [],
      data: '',
      count: 0,
      totalcount: 0
    }
  }

  componentDidMount() {
    var data = this.props.route.params.data
    this.setState({ data: data })
    this.showAlert()
    for (var i = 0; i <= 1; i++) {
      images[i] = ''
    }
    this.getIsEnabled()
    const listener = Silent.addListener((status) => {
      console.log('silentStatus changed', status)
    })
  }

  showAlert() {
    this.setState({ totalcount: 2, title: I18n.t('InspectionPic.title1') })

    Alert.alert(I18n.t('InspectionPic.alert_head'), I18n.t('InspectionPic.alert_text'))
  }

  getIsEnabled = () => {
    Silent.isEnabled().then((value) => {
      console.log('isEnabledValue changed', value)
      setIsEnabledValue(value)
    })
  }

  async detectSlientMode() {
    try {
      const currentMode = await getRingerMode()
      console.log('currentMode', currentMode)
    } catch (error) {
      console.error(error)
    }
  }

  takePicture = async function () {
    SystemSetting.getVolume().then((currentVolume) => {
      if (currentVolume == 0) {
        Vibration.vibrate(100)
      }
    })
    if (this.camera) {
      var width = Dimensions.get('window').width
      var height = Dimensions.get('window').height - moderateScale(100)
      const options = {
        width: width,
        height: height,
        quality: 0.5,
        mirrorImage: false,
        orientation: 'portrait'
      }
      const data = await this.camera.takePictureAsync(options)

      var { totalcount } = this.state
      this.setState({ title: I18n.t('InspectionPic.title2') })
      images[count] = data.uri
      count = count + 1
      if (count == totalcount) {
        this.setState({ images: images })
        images = []
        count = 0
        console.log(this.state.images)
        this.props.navigation.navigate('InspectionReviewScreen', {
          images: this.state.images,
          data: this.state.data
        })
      }
    }
  }

  back = () => {
    this.props.navigation.pop()
  }

  childCallback = () => {
    this.takePicture()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        {console.log('here Camera')}
        <View style={styles.container2}>
          {/* <RNCamera
                        ref={ref => {this.camera = ref}}
                        style = {styles.preview}
                        type={RNCamera.Constants.Type.back}
                        captureAudio={false}
                        
                        flashMode={RNCamera.Constants.FlashMode.off}
                    /> */}
          <Camera
            hdr={true}
            photo={true}
            // ref={cameraRef}
            isActive={true}
            focusable={true}
            enableZoomGesture={true}
            style={{ aspectRatio: 3 / 4 }}
            // device={device}
            // onInitialized={onCameraInitialized}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            style={{ width: '29.5%' }}
            label={I18n.t('InspectionPic.back')}
            parentCallback={this.back}
          />
          <Button
            style={{ width: '70%' }}
            label={I18n.t('InspectionPic.takePic')}
            parentCallback={this.childCallback}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container2: {
    flex: 1,
    backgroundColor: '#000'
  },
  preview: {
    flex: 1
  },
  container1: {
    backgroundColor: '#fff',
    height: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15)
  },
  pageheading: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center',
    color: '#32c8ed',
    width: '100%'
  }
})
