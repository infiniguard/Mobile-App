import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Header from '../Common/Header'
import Button from '../Common/Button'
import I18n from '../../languages/i18n2'
import { moderateScale } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../Themes/color'

export default class InspectionThankyouScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }

  warrantyclaim = () => {
    this.props.navigation.navigate('WarrantyClaimScreen')
  }

  gobackScreen = () => {
    this.props.navigation.navigate('ScanQRCodeScreen')
  }

  goToReporting = () => {
    this.props.navigation.navigate('ReportingScreen', {
      qr_id: this.props.route.params.qr_id,
      address: this.props.route.params.address,
      qr_number: parseInt(this.props.route.params.qr_number)
    })
  }
  componentDidMount() {
    console.log(this.props)
    console.log(this.props.qr_id, this.props.address)
  }

  additionalcomponentbtn = () => {
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
          <Text allowFontScaling={false} style={styles.thanktext}>
            {I18n.t('InspectionThankyou.Text1')}
            {'\n'}
            {'\n'}
            {I18n.t('InspectionThankyou.Text2')}
          </Text>
        </View>

        <View style={{ position: 'absolute', bottom: 0 }}>
          <TouchableOpacity
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
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <Button
              style={{ width: '54.6%' }}
              label={I18n.t('InspectionThankyou.Inspect')}
              parentCallback={this.additionalcomponentbtn}
            /> */}
            <Button
              style={{ width: '31.6%' }}
              label={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Back')}
              parentCallback={this.gobackScreen}
            />
            <Button
              style={{ width: '69.1%', marginLeft: 1 }}
              label={I18n.t('InspectionThankyou.Submit')}
              parentCallback={this.warrantyclaim}
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
  container1: {
    alignItems: 'center',
    flex: 3,
    paddingHorizontal: moderateScale(5),
    paddingTop: moderateScale(20),
    paddingLeft: 30,
    paddingRight: 30
  },
  thanktext: {
    fontSize: moderateScale(15),
    fontWeight: '300',
    color: '#0f0f0f',
    textAlign: 'left'
  },
  comntainer: {
    width: '100%',
    height: moderateScale(50)
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
    fontSize: moderateScale(12),
    fontWeight: '700',
    textAlign: 'center'
  }
})
