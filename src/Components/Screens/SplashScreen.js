import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { Component } from 'react'
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { colors } from '../../Themes/color'
import { fonts } from '../../Themes/fontSize'

var logo = require('../../Themes/Images/cse-white.png')
var infiniguardlogo = require('../../Themes/Images/infiniguardlogo.png')

export default class SplashScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      AsyncStorage.getItem('SelectedLang').then((val) => {
        console.log(val)
        if (val) {
          AsyncStorage.getItem('loggedIn').then((val) => {
            var logged = JSON.parse(val)
            console.log(logged)
            if (logged) {
              this.props.navigation.navigate('ScanQRCodeScreen')
            } else {
              this.props.navigation.navigate('ScanQRCodeScreen')
            }
          })
        } else {
          this.props.navigation.navigate('SelectLanguage')
        }
      })
    }, 5000)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer1}>
          <Image resizeMode="contain" style={styles.logo} source={infiniguardlogo} />
          <View style={styles.border} />
          <Text allowFontScaling={false} style={styles.text}>
            The BEST Protection For {'\n'} Your HVAC Equipment
          </Text>
          <ActivityIndicator size="large" color={colors.colorWhite} />
        </View>
        <View style={styles.subContainer2}>
          {/* <Text allowFontScaling={false} style={styles.text2}>Powered By</Text> */}
          <Image source={logo} style={styles.logo2} resizeMode="contain" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray'
  },
  subContainer1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '90%',
    height: moderateScale(50)
  },
  border: {
    width: moderateScale(50),
    height: moderateScale(2),
    backgroundColor: colors.colorWhite
  },
  text: {
    fontSize: fonts.title,
    color: colors.colorWhite,
    marginVertical: moderateScale(15)
    // fontFamily:'Poppins-Bold'
  },
  subContainer2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: moderateScale(50)
  },
  text2: {
    fontSize: fonts.text,
    color: colors.colorWhite
  },
  logo2: {
    height: moderateScale(50)
  }
})
