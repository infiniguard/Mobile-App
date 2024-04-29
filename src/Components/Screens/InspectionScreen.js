import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { colors } from '../../Themes/color'
import Header from '../Common/Header'
import I18n from '../../languages/i18n2'
import Button from '../Common/Button'
import { moderateScale } from 'react-native-size-matters'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native'
export default class InspectionScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      data: {}
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('qrData').then((qrData) => {
      var data = JSON.parse(qrData)
      this.setState({
        data: data
      })
    })
  }

  back = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'ScanQRCodeScreen' }]
    })
    this.props.navigation.dispatch(resetAction)
    this.props.navigation.navigate('ScanQRCodeScreen')
    // this.props.navigation.pop()
  }

  childCallback = () => {
    const { data } = this.state
    var data1 = []
    data1['qr_id'] = data.id
    data1['condenser_coil'] = data.condenser_coil
    data1['cabinet'] = data.cabinet
    data1['evaporator_coil'] = data.evaporator_coil
    this.props.navigation.navigate('InspectionPicScreen', { data: data1 })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('InspectionScreen.Title')}
          </Text>
          <View style={styles.border} />
        </View>
        <View style={styles.container2}>
          <View style={styles.form}>
            <Text allowFontScaling={false} style={{ alignSelf: 'center', marginBottom: 8 }}>
              {I18n.t('InspectionScreen.SerialNumber')}
            </Text>
            <TextInput
              style={styles.input}
              allowFontScaling={false}
              editable={false}
              value={this.props.route.params.qr_code}
              placeholder="SERIAL NUMBER"
            />
          </View>
        </View>
        <View style={styles.container3}>
          <View style={styles.buttonbox1}>
            <Text allowFontScaling={false} style={styles.smallheading}>
              {I18n.t('InspectionScreen.InspectionDate')}
            </Text>
            <Text allowFontScaling={false} style={styles.headingresult}>
              {this.props.route.params.inspection_date}
            </Text>
          </View>
          <View style={styles.buttonbox1}>
            <View style={styles.border1} />
            <Text allowFontScaling={false} style={styles.smallheading}>
              {I18n.t('InspectionScreen.AppliedDate')}
            </Text>
            <Text allowFontScaling={false} style={styles.headingresult}>
              {this.props.route.params.current_date}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            style={{ width: '29.5%' }}
            label={I18n.t('InspectionScreen.Back')}
            parentCallback={this.back}
          />
          <Button
            style={{ width: '70%' }}
            label={I18n.t('InspectionScreen.TAkePic')}
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
    backgroundColor: colors.colorWhite
  },
  container1: {
    paddingTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10)
  },
  border: {
    width: 30,
    borderBottomWidth: 2,
    color: '#13b0dd',
    margin: moderateScale(5)
  },
  border1: {
    width: '100%',
    height: 2,
    backgroundColor: '#eee',
    marginTop: 6,
    marginBottom: 10
  },
  container3: {
    flex: 1,
    alignItems: 'center'
  },
  smallheading: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: 15,
    color: '#2bc6f2'
  },
  pageheading: {
    fontSize: moderateScale(18),
    textAlign: 'center',
    color: colors.loginSecondary,
    fontWeight: '700',
    width: '100%'
  },
  container2: {
    paddingTop: moderateScale(5),
    paddingHorizontal: moderateScale(3)
  },
  form: {
    paddingTop: moderateScale(5)
  },
  input: {
    height: moderateScale(40),
    backgroundColor: '#ebebeb',
    borderRadius: 50,
    textAlign: 'center',
    color: '#000',
    marginBottom: moderateScale(3)
  },
  buttonbox1: {
    alignItems: 'center',
    width: '90%',
    marginTop: 10
  },
  headingresult: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: moderateScale(10)
  }
})
