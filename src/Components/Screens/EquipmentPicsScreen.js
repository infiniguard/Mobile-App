import React, { Component, useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, Alert, Dimensions, Vibration, BackHandler } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

import Header from '../Common/Header'
import Button from '../Common/Button'
import I18n from '../../languages/i18n2'
import { moderateScale } from 'react-native-size-matters'
import SystemSetting from 'react-native-system-setting'
import { Camera, useCameraDevices, PhotoFile } from 'react-native-vision-camera'
import { useRingerMode, RINGER_MODE } from 'react-native-ringer-mode'
import { CommonActions } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'

var images = []
var count = 0

function EquipmentPicsScreen(props) {
  const devices = useCameraDevices()
  const device = devices.back
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [isVisible, setIsVisiable] = useState(false)
  const [imagess, setImages] = useState([])
  const [data1, setData1] = useState(null)
  const [counts, setCount] = useState(0)
  const [totalcount, setTotalCount] = useState(2)
  const [title, setTitle] = useState(I18n.t('PicScreen.title1'))
  let cameraRef = useRef(null)
  const { mode, error, setMode } = useRingerMode()

  const onCameraInitialized = useCallback(() => {
    setIsCameraInitialized(true)
  }, [])

  useEffect(() => {
    // let data=props.route.params.dat

    setData1(props.route.params.data)
    showAlert(props?.route.params.data)
    for (let i = 0; i <= 1; i++) {
      images[i] = ''
    }
  }, [])

  const onResetData = () => {
    images = []
    count = 0
    // setData1(props?.route?.params?.data)
    for (let i = 0; i <= 1; i++) {
      images[i] = ''
    }
  }

  const handleBackButtonClick = () => {
    resetCall()
  }

  const resetCall = () => {
    images = []
    count = 0
    // setData1(props?.route?.params?.data)
    for (let i = 0; i <= 1; i++) {
      images[i] = ''
    }
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
    }
  }, [])

  const showAlert = () => {
    setTitle(I18n.t('PicScreen.title1'))
    // setTotalCount(2)
    Alert.alert(I18n.t('PicScreen.alert_head'), I18n.t('PicScreen.alert_text'))
  }

  const back = useCallback(() => {
    onResetData()
    props.navigation.navigate('RegisterQRCodeScreen')
  })

  //   const  childCallback = async () => {
  //         SystemSetting.getVolume().then(currentVolume => {
  //             if(currentVolume==0){
  //             Vibration.vibrate(100)
  //             }
  //         });

  const takePhoto = useCallback(async () => {
    console.log('mode', mode)
    let takePhotoOptions = {
      photoCodec: 'jpeg',
      qualityPrioritization: 'balanced',
      quality: 100
    }

    try {
      const photo = await cameraRef.current.takePhoto(takePhotoOptions)
      onMediaCaptured(photo, 'photo')
    } catch (e) {
      console.error('Failed to take photo!', e)
    }
  }, [onMediaCaptured])

  const onMediaCaptured = useCallback((media: PhotoFile, type: 'photo') => {
    SystemSetting.getVolume().then((currentVolume) => {
      if (currentVolume == 0) {
        Vibration.vibrate(100)
      }
    })

    ImagePicker.openCropper({
      path: 'file://' + media.path,
      width: 300,
      height: 400
    })
      .then((image) => {
        setTitle(I18n.t('PicScreen.title2'))
        ;(images[count] = 'file://' + image.path), (count = count + 1)
        if (count == totalcount) {
          setImages(images)
          //    images=[];
          count = 0
          props.navigation.navigate('ReviewPicture', {
            images: images,
            data: props.route.params.data,
            onResetDataL: onResetData
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
      })

    // setTitle(I18n.t('PicScreen.title2'))
    // ;(images[count] = 'file://' + media.path), (count = count + 1)
    // console.log('totalcount', totalcount)
    // console.log(count, totalcount)
    // if (count == totalcount) {
    //   console.log('images', images)
    //   setImages(images)
    //   //  images=[];
    //   count = 0
    //   console.log('data1')
    //   props.navigation.navigate('ReviewPicture', {
    //     images: images,
    //     data: props.route.params.data,
    //     onResetDataL: onResetData
    //   })
    // }
  }, [])

  // if (this.camera) {
  //     let width= Dimensions.get('window').width
  //     let height= Dimensions.get('window').height-moderateScale(100)
  //     const options = {
  //         width:width,
  //         height:height,
  //         quality: 0.5,
  //         mirrorImage:false,
  //         orientation:'portrait'
  //     };
  //     const data = await this.camera.takePictureAsync(options)
  //     let {data1,totalcount}=this.state
  //     this.setState({title:I18n.t('PicScreen.title2')})
  //     images[count]=data.uri
  //     count= count + 1;
  //     if(count==totalcount){
  //         this.setState({images: images});
  //         images=[];
  //         count=0;
  //         this.props.navigation.navigate('ReviewPicture',{images: this.state.images,data: data1});
  //     }
  // }

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} />
      <View style={styles.container1}>
        <Text allowFontScaling={false} style={styles.pageheading}>
          {title}
        </Text>
      </View>
      <View style={styles.container2}>
        {/* <RNCamera
                    ref={ref => {
                        this.camera = ref;
                     }}
                    captureAudio={false}
                    style = {styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    /> */}
        {device ? (
          <Camera
            hdr={true}
            photo={true}
            ref={(ref) => (cameraRef.current = ref)}
            isActive={true}
            focusable={true}
            enableZoomGesture={true}
            device={device}
            style={styles.preview}
            onInitialized={onCameraInitialized}
          />
        ) : null}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white'
        }}
      >
        <Button style={{ width: '29.5%' }} label={I18n.t('PicScreen.back')} parentCallback={back} />
        <Button
          style={{ width: '70.3%' }}
          label={I18n.t('PicScreen.takePic')}
          parentCallback={takePhoto}
        />
      </View>
      <Spinner visible={isVisible} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  container2: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  container1: {
    backgroundColor: 'white',
    height: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center'
  },
  pageheading: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center',
    color: '#32c8ed',
    width: '100%'
  }
})
export default EquipmentPicsScreen
