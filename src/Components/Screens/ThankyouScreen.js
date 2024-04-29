import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Header from '../Common/Header'
import Button from '../Common/Button'
import I18n from '../../languages/i18n2'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Fonts } from '../../utils/Fonts'
import { moderateScale } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../Themes/color'
export default class ThankyouScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      seller_name: null,
      qr_code: ''
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('UserData').then((UserData) => {
      const data = JSON.parse(UserData)
      this.setState({ seller_name: data.name })
    })
    AsyncStorage.getItem('qr_code').then((qr_code) => {
      const code = JSON.parse(qr_code)
      this.setState({ qr_code: code })
    })
  }

  componentbtn = () => {
    this.props.navigation.navigate('RegisterQRCodeScreen')
  }

  goToReporting = () => {
    this.props.navigation.navigate('ReportingScreen', {
      qr_id: this.props.route.params.qr_id,
      address: this.props.route.params.address,
      new_qr: 'yes',
      qr_number: parseInt(this.props.route.params.qr_number)
    })
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

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.headtitle}>
            {I18n.t('REGISTRATION_COMPLETE.Title')}
          </Text>
          <View style={styles.border} />
          <Text allowFontScaling={false} style={styles.thanktext}>
            {I18n.t('REGISTRATION_COMPLETE.Thankyou')}{' '}
            <Text style={{ fontWeight: 'bold', fontSize: moderateScale(16), flexWrap: 'wrap' }}>
              {this.state.seller_name}
            </Text>{' '}
            {I18n.t('REGISTRATION_COMPLETE.Text')}
          </Text>
        </View>

        <View style={{ position: 'absolute', bottom: 0 }}>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.conatiner,
              { marginBottom: 20, alignItems: 'center', justifyContent: 'center' }
            ]}
            onPress={() => this.goToReporting()}
          >
            <LinearGradient
              colors={['#7bb3c2', '#51b6d3', '#2abae2', '#07bcef']}
              style={styles.btn}
            >
              <Text style={styles.text}>{I18n.t('InspectionThankyou.reporting')}</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <Button
              style={{ width: '29.3%' }}
              label={I18n.t('REGISTRATION_COMPLETE.logout')}
              parentCallback={this.logoutbtn}
            /> */}
            <Button
              style={{ width: '100%' }}
              label={I18n.t('REGISTRATION_COMPLETE.Register')}
              parentCallback={this.componentbtn}
            />
          </View>
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
  content: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%'
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    paddingTop: moderateScale(10)
  },
  thanktext: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    color: '#0f0f0f',
    textAlign: 'justify',
    flexWrap: 'wrap',
    // fontFamily:Fonts.RobotoRegular,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10)
  },

  headtitle: {
    fontSize: moderateScale(18),
    marginTop: moderateScale(5),
    fontWeight: '700',
    color: '#04bdf0',
    width: '100%',
    textAlign: 'center',
    flexWrap: 'wrap'
    // fontFamily:Fonts.RobotoBlack
  },
  border: {
    width: moderateScale(50),
    borderBottomWidth: moderateScale(2),
    color: '#000',
    margin: moderateScale(15)
  },
  btn: {
    width: '90%',
    height: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center'
    // marginLeft:0,
  },
  text: {
    color: colors.colorWhite,
    fontSize: moderateScale(14),
    fontWeight: '700',
    textAlign: 'center'
  }
})
