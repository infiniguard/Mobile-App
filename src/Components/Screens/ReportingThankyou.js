import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from '../Common/Header'
import Button from '../Common/Button'
import I18n from '../../languages/i18n2'
import { moderateScale } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'

export default class ReportingThankyouScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false
    }
  }

  warrantyclaim = () => {
    this.props.navigation.navigate('WarrantyClaimScreen')
  }

  goToReporting = () => {
    this.props.navigation.navigate('ReportingScreen', {
      qr_id: this.props.qr_id,
      address: this.props.address
    })
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
          <Text allowFontScaling={false} style={styles.pageheading}>
            {' '}
            {I18n.t('InspectionThankyou.reportingHeading')}
          </Text>
          <View style={styles.border} />
          <View>
            <Text allowFontScaling={false} style={styles.thanktext}>
              {I18n.t('InspectionThankyou.reportingThankuBoday') +
                `${parseInt(this.props.route.params.qr_number)}` +
                I18n.t('InspectionThankyou.reportingThankuBodyOne')}
              {/* {I18n.t('InspectionThankyou.Text2')} */}
            </Text>
            {/* <Text style={[styles.thanktext,{color:"blue",textDecorationLine: 'underline'}]}>{`${this.props.route.params.email}`}</Text> */}
          </View>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: moderateScale(15),
              fontWeight: '300',
              color: '#0f0f0f',
              width: '100%',
              marginTop: 30,
              textAlign: 'left'
            }}
          >
            {I18n.t('InspectionThankyou.justThankuMsg')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0
          }}
        >
          <Button
            style={{ width: '54.6%' }}
            label={I18n.t('InspectionThankyou.Inspect')}
            parentCallback={this.additionalcomponentbtn}
          />
          <Button
            style={{ width: '44.9%' }}
            label={I18n.t('InspectionThankyou.Submit')}
            parentCallback={this.warrantyclaim}
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
    textAlign: 'justify'
  },
  pageheading: {
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: '#32c8ed',
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 20
  }
})
