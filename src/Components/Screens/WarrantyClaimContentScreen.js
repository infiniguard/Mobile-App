import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Header from '../Common/Header'
import I18n from '../../languages/i18n2'
import { CommonActions } from '@react-navigation/native'
import { moderateScale } from 'react-native-size-matters'
import Button from '../Common/Button'

export default class WarrantyClaimContentScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uid: '',
      isVisible: false,
      Modal_Visibility: false
    }
  }

  additional = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'ScanQRCodeScreen' }]
    })
    this.props.navigation.dispatch(resetAction)
  }

  gobackScreen = () => {
    this.props.navigation.navigate('ScanQRCodeScreen')
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('WarrantyClaimContentScreen.Title')}
          </Text>
          <View style={styles.border} />
        </View>
        <View style={styles.container2}>
          <ScrollView contentContainerStyle={styles.contentbox}>
            <Text allowFontScaling={false} style={styles.contenttext}>
              {I18n.t('WarrantyClaimContentScreen.Text1')}
            </Text>
            <Text></Text>
            <Text allowFontScaling={false} style={styles.contenttext}>
              {I18n.t('WarrantyClaimContentScreen.Text2')}
            </Text>
            <Text></Text>
            <Text allowFontScaling={false} style={styles.contenttext}>
              {I18n.t('WarrantyClaimContentScreen.Text3')}
            </Text>
          </ScrollView>
        </View>
        <Button
          style={{ width: '100%' }}
          label={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Back')}
          parentCallback={this.gobackScreen}
        />
        {/* <Button
                    style={{width:'100%'}}
                    label={I18n.t('WarrantyClaimContentScreen.button')}
                    parentCallback={this.additional}
                /> */}
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
  content: {
    flex: 1,
    height: '70%',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: '5%'
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: moderateScale(5),
    paddingRight: moderateScale(3)
  },
  border: {
    width: moderateScale(30),
    borderBottomWidth: moderateScale(2),
    color: '#13b0dd',
    margin: moderateScale(8)
  },
  pageheading: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    textAlign: 'center',
    color: '#32c8ed',
    width: '100%'
  },
  container2: {
    flex: 5,
    alignItems: 'center',
    padding: 5,
    paddingLeft: 30,
    paddingRight: 30
  },

  contentbox: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(5)
  },
  contenttext: {
    fontSize: moderateScale(15),
    fontWeight: '300',
    color: '#0f0f0f',
    textAlign: 'justify'
  },
  container3: {
    flex: 0.8,
    width: '100%',
    paddingHorizontal: moderateScale(2),
    justifyContent: 'center',
    paddingBottom: moderateScale(2)
  }
})
