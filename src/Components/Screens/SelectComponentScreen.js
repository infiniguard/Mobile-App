import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native'
import { colors } from '../../Themes/color'
import Header from '../Common/Header'
import Spinner from 'react-native-loading-spinner-overlay'
import FlipToggle from 'react-native-flip-toggle-button'
import I18n from '../../languages/i18n2'
import { moderateScale } from 'react-native-size-matters'
import Button from '../Common/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

export default class SelectComponentScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      condenser_coil: false,
      cabinet: false,
      evaporator: false,
      evaporator_coil: false,
      image_source: '',
      image_name: '',
      serialNumber: '',
      sNerr: '',
      qr_id: '',
      seller_id: '',
      uploadTextHeading: 'TAKE A PICTURE OF EQUIPMENT TAG',
      review: 'Review Equipment Tag Picture'
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('qr_id').then((id) => {
        qr_id = JSON.parse(id)
        this.setState({
          qr_id: qr_id,
          isVisible: false,
          condenser_coil: false,
          cabinet: false,
          evaporator: false,
          evaporator_coil: false,
          serialNumber: ''
        })
      })
      AsyncStorage.getItem('UserData').then((UserData) => {
        const data = JSON.parse(UserData)
        console.log(data)
        this.setState({ seller_id: data.id })
      })
    })
  }

  back = () => {
    // this.navigation.navigate('ScanQRCodeScreen')
    this.props.navigation.pop()
  }

  childCallback = () => {
    const { condenser_coil, cabinet, evaporator_coil, seller_id, qr_id } = this.state
    var error = 0
    if (condenser_coil == false && cabinet == false && evaporator_coil == false) {
      Alert.alert(I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Alert1'))
      error = 1
    }
    // else if (this.state.serialNumber == '') {
    //   //   Alert.alert(I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Alert2'))
    //   this.setState({ sNerr: 'Please Enter Serial Number' })
    //   error = 1
    // }
    if (error == 0) {
      var condenser_coil1 = ''
      var cabinet1 = ''
      var evaporator_coil1 = ''
      if (condenser_coil == true) {
        condenser_coil1 = 'yes'
      } else {
        condenser_coil1 = 'no'
      }
      if (cabinet == true) {
        cabinet1 = 'yes'
      } else {
        cabinet1 = 'no'
      }
      if (evaporator_coil == false) {
        evaporator_coil1 = 'no'
      } else {
        evaporator_coil1 = evaporator_coil
      }
      var data = []
      data['qr_id'] = qr_id
      data['seller_id'] = seller_id
      data['condenser_coil'] = condenser_coil1
      data['cabinet'] = cabinet1
      data['serial_number'] = this.state.serialNumber
      ;(data['evaporator_coil'] = evaporator_coil1),
        this.props.navigation.navigate('EquipmentPicsScreen', { data })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <View style={styles.container1}>
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Title1')}
          </Text>
          <View style={styles.border} />
          <Text allowFontScaling={false} style={styles.pageheading}>
            {I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Title2')}
          </Text>
          <View style={styles.border} />
          <View style={styles.box}>
            <View style={styles.questionbox}>
              <View style={{ width: '75%' }}>
                <Text allowFontScaling={false} style={styles.questionheading}>
                  {I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Condensor')}
                </Text>
              </View>
              <View style={{ width: '25%' }}>
                <FlipToggle
                  value={this.state.condenser_coil}
                  buttonOnColor={'#4eb4c4'}
                  buttonOffColor={'#9e9e9e'}
                  sliderOnColor={'#ffffff'}
                  sliderOffColor={'#ffffff'}
                  buttonWidth={moderateScale(75)}
                  buttonHeight={moderateScale(25)}
                  buttonRadius={moderateScale(50)}
                  onLabel={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Yes')}
                  offLabel={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.No')}
                  onToggle={(value) => {
                    this.setState({ condenser_coil: value })
                  }}
                  onToggleLongPress={(value) => {
                    this.setState({ condenser_coil: value })
                  }}
                />
              </View>
            </View>
            <View style={styles.questionbox}>
              <View style={{ width: '75%' }}>
                <Text allowFontScaling={false} style={styles.questionheading}>
                  {I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Cabinet')}
                </Text>
              </View>
              <View style={{ width: '25%' }}>
                <FlipToggle
                  value={this.state.cabinet}
                  buttonOnColor={'#4eb4c4'}
                  buttonOffColor={'#9e9e9e'}
                  sliderOnColor={'#ffffff'}
                  sliderOffColor={'#ffffff'}
                  buttonWidth={moderateScale(75)}
                  buttonHeight={moderateScale(25)}
                  buttonRadius={moderateScale(50)}
                  onLabel={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Yes')}
                  offLabel={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.No')}
                  onToggle={(value) => {
                    this.setState({ cabinet: value })
                  }}
                  onToggleLongPress={(value) => {
                    this.setState({ cabinet: value })
                  }}
                />
              </View>
            </View>
            <View style={styles.questionbox}>
              <View style={{ width: '75%' }}>
                <Text allowFontScaling={false} style={styles.questionheading}>
                  {I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Evaporator')}
                </Text>
              </View>
              <View style={{ width: '25%' }}>
                <FlipToggle
                  value={this.state.evaporator}
                  buttonOnColor={'#4eb4c4'}
                  buttonOffColor={'#9e9e9e'}
                  sliderOnColor={'#ffffff'}
                  sliderOffColor={'#ffffff'}
                  buttonWidth={moderateScale(75)}
                  buttonHeight={moderateScale(25)}
                  buttonRadius={moderateScale(50)}
                  onLabel={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Yes')}
                  offLabel={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.No')}
                  onToggle={(value) => {
                    this.setState({ evaporator: value, evaporator_coil: value })
                  }}
                  onToggleLongPress={(value) => {
                    this.setState({ evaporator: value, evaporator_coil: value })
                  }}
                />
              </View>
            </View>
          </View>

          <KeyboardAwareScrollView style={{ width: '90%' }}>
            <View
              style={{ alignItems: 'center', paddingHorizontal: moderateScale(3), width: '100%' }}
            >
              <View style={styles.border} />
            </View>
            <View style={styles.container2}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>
                {I18n.t('Certified_Applicator_Login.serialNumberText')}
              </Text>
              <TextInput
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                selectionColor={'#000000'}
                onSubmitEditing={() => this.childCallback()}
                placeholder={I18n.t('Certified_Applicator_Login.serialNumber')}
                placeholderTextColor="#808080"
                style={styles.input}
                value={this.state.serialNumber}
                multiline={false}
                returnKeyType="done"
                onFocus={() => this.setState({ sNerr: '' })}
                blurOnSubmit={false}
                onChangeText={(serialNumber) => this.setState({ serialNumber })}
              />
              {!this.state.sNerr ? null : (
                <Text allowFontScaling={false} style={styles.error}>
                  {this.state.sNerr}
                </Text>
              )}
            </View>
          </KeyboardAwareScrollView>

          {/* {this.state.evaporator==true ?
                        <View style={styles.container2}>
                            <Text allowFontScaling={false} style={styles.smallheading}>
                            {I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Evaporator_heading')}
                            </Text>
                            <View style={styles.border} />
                            <ScrollView style={styles.fullbox}>
                                <View style={styles.options}>
                                <TouchableOpacity activeOpacity={.6} style={[styles.selectbox,(this.state.evaporator_coil === 'Full' ? styles.selectboxActive : styles.selectboxInActive )]} onPress={() => this.setState({ evaporator_coil: 'Full' })} >
                                    <Text allowFontScaling={false} style={styles.selecttext}>{I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Full')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={.6} style={[styles.selectbox,(this.state.evaporator_coil === 'Edges' ? styles.selectboxActive : styles.selectboxInActive )]} onPress={() => this.setState({ evaporator_coil: 'Edges' })} >
                                    <Text allowFontScaling={false} style={styles.selecttext}>{I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Edges')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={.6} style={[styles.selectbox,(this.state.evaporator_coil === 'Light on face' ? styles.selectboxActive : styles.selectboxInActive )]} onPress={() => this.setState({ evaporator_coil: 'Light on face' })} >
                                    <Text allowFontScaling={false} style={styles.selecttext}>{I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Light')}</Text>
                                </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    :
                        null
                    } */}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            style={{ width: '29.5%' }}
            label={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Back')}
            parentCallback={this.back}
          />
          <Button
            style={{ width: '70%' }}
            label={I18n.t('PROTECTED_EQUIPMENT_REGISTRATION.Take_Pic')}
            parentCallback={this.childCallback}
          />
        </View>
        <Spinner visible={this.state.isVisible} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#ffffff'
  },
  content: {
    flex: 1,
    height: '70%',
    paddingLeft: '6%',
    paddingRight: '6%',
    paddingBottom: '5%'
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(10)
  },
  border: {
    width: moderateScale(50),
    borderBottomWidth: moderateScale(2),
    color: '#13b0dd',
    margin: moderateScale(10)
  },
  pageheading: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    textAlign: 'center',
    color: colors.loginPrimary,
    width: '100%'
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: moderateScale(10)
  },
  questionbox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    paddingVertical: moderateScale(5)
  },
  questionheading: {
    fontSize: moderateScale(14),
    fontWeight: '600'
  },
  smallheading: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#333'
  },
  options: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  selecttext: {
    fontSize: moderateScale(12),
    color: '#000'
  },
  selectbox: {
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
    flex: 0.25,
    justifyContent: 'center',
    marginBottom: 7,
    height: 45
  },
  selectboxActive: {
    backgroundColor: '#74b3c5'
  },
  selectboxInActive: {
    backgroundColor: '#eee'
  },
  bottombtn: {
    justifyContent: 'flex-end'
  },
  box: {
    height: moderateScale(150),
    justifyContent: 'space-around'
  },
  fullbox: {
    width: '100%'
  },
  error: {
    color: colors.colorRed,
    textAlign: 'center',
    fontSize: moderateScale(12),
    paddingBottom: moderateScale(5)
  },
  input: {
    height: moderateScale(50),
    backgroundColor: '#ebebeb',
    borderRadius: 50,
    paddingHorizontal: 15,
    width: '100%',
    textAlign: 'center',
    marginBottom: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }
})
