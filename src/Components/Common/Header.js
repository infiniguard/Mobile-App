import React, { PureComponent } from 'react'
import { StatusBar, StyleSheet, TouchableOpacity, View, Image, Text, Linking } from 'react-native'
import { fonts } from '../../Themes/fontSize'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../Themes/color'
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import { moderateScale } from 'react-native-size-matters'
import Modal from 'react-native-modal'
import { CommonActions } from '@react-navigation/native'
import I18n from '../../languages/i18n2'
import { useNavigation } from '@react-navigation/native'

var logo = require('../../Themes/Images/infilogo.png')

export default class Header extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      sideMenu: false,
      lang: '',
      name: '',
      url: ''
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('loggedIn').then((value) => {
      var loggedInUser = JSON.parse(value)
      this.setState({ loggedIn: loggedInUser })

      if (loggedInUser) {
        AsyncStorage.getItem('UserData').then((UserData) => {
          const data = JSON.parse(UserData)
          var myname = data.name
          this.setState({ name: myname })
        })
      }
    })
    AsyncStorage.getItem('SelectedLang').then((val) => {
      if (val == 'en') {
        this.setState({ lang: 'Español' })
        this.setState({ url: 'https://www.infiniguard.com/contact' })
      } else {
        this.setState({ lang: 'English' })
        this.setState({ url: 'https://www.infiniguard.com/contacto' })
      }
    })
  }

  buttonCallback = async () => {
    if (this.state.lang == 'English') {
      await AsyncStorage.setItem('SelectedLang', 'en')
      I18n.locale = 'en'
      this.navigateToScreen('ScanQRCodeScreen')
    } else {
      await AsyncStorage.setItem('SelectedLang', 'es')
      I18n.locale = 'es'
      this.navigateToScreen('ScanQRCodeScreen')
    }
    // AsyncStorage.setItem('SelectedLang',this.state.selected)
    // I18n.locale=this.state.selected
    // this.props.navigation.navigate('ScanQRCodeScreen')
  }

  async navigateToScreen(route) {
    if (route == 'ContactScreen') {
      this.setState({ sideMenu: false }, () => Linking.openURL(this.state.url))
    } else if (route == 'Logout') {
      const keys = ['loggedIn', 'UserData', 'qr_code', 'qr_id']
      await AsyncStorage.multiRemove(keys)
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: 'ScanQRCodeScreen' }]
      })
      this.props.navigation.dispatch(resetAction)
    } else {
      this.setState({ currentScreen: route })
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: route }]
      })
      console.log('resetActio', this?.props?.navigation)
      this.setState({ sideMenu: false }, () => this.props?.navigation?.dispatch(resetAction))
    }
  }

  render() {
    return (
      <>
        <LinearGradient
          colors={this.state.loggedIn ? colors.loginGradient : colors.logoutGradient}
          style={styles.container}
        >
          <StatusBar
            backgroundColor={this.state.loggedIn ? colors.loginPrimary : colors.logoutPrimary}
            barStyle={'light-content'}
          />
          <View style={styles.subContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ sideMenu: true })}>
              <SimpleLineIcons name="menu" size={moderateScale(20)} color={colors.colorWhite} />
            </TouchableOpacity>
            <Image source={logo} resizeMode={'contain'} style={styles.logo} />
            <View style={{ width: moderateScale(20) }} />
          </View>
        </LinearGradient>
        <Modal
          style={{ width: '100%', height: '100%', margin: 0 }}
          isVisible={this.state.sideMenu}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          onBackdropPress={() => this.setState({ sideMenu: false })}
          onSwipeComplete={() => this.setState({ sideMenu: false })}
          swipeDirection={['left']}
        >
          <View style={[styles.container2, this.state.name != '' ? styles.logged : styles.login]}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  marginTop: '10%',
                  width: '65%',
                  marginLeft: '5%',
                  alignSelf: 'flex-start'
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => this.setState({ sideMenu: false })}
                >
                  <AntDesign name="close" size={moderateScale(25)} color={colors.colorWhite} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ margin: '2%', height: '5%' }}></View>
            <View style={styles.navSectionStyle}>
              {this.state.name != '' ? (
                <View
                  style={[
                    styles.navBorderStyle,
                    this.state.currentScreen === 'ScanQRCodeScreen' ? styles.navactive : {}
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.navItemStyle,
                      this.state.currentScreen === 'ScanQRCodeScreen' ? styles.textactive : {}
                    ]}
                    onPress={() => this.navigateToScreen('ScanQRCodeScreen')}
                  >
                    {I18n.t('Side_Menu.Register_equipment')}
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.navBorderStyle,
                    this.state.currentScreen === 'ScanQRCodeScreen' ? styles.navactive : {}
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.navItemStyle,
                      this.state.currentScreen === 'ScanQRCodeScreen' ? styles.textactive : {}
                    ]}
                    onPress={() => this.navigateToScreen('ScanQRCodeScreen')}
                  >
                    {I18n.t('Side_Menu.Equipment_Maintenance_Registration')}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.navBorderStyle,
                  this.state.currentScreen === 'AboutScreen' ? styles.navactive : {}
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.navItemStyle,
                    this.state.currentScreen === 'AboutScreen' ? styles.textactive : {}
                  ]}
                  onPress={() => this.navigateToScreen('AboutScreen')}
                >
                  {I18n.t('Side_Menu.about')}
                </Text>
              </View>
              <View
                style={[
                  styles.navBorderStyle,
                  this.state.currentScreen === 'MaintenanceScreen' ? styles.navactive : {}
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.navItemStyle,
                    this.state.currentScreen === 'MaintenanceScreen' ? styles.textactive : {}
                  ]}
                  onPress={() => this.navigateToScreen('MaintenanceScreen')}
                >
                  {I18n.t('Side_Menu.maintenance')}
                </Text>
              </View>
              <View
                style={[
                  styles.navBorderStyle,
                  this.state.currentScreen === 'WarrantyScreen' ? styles.navactive : {}
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.navItemStyle,
                    this.state.currentScreen === 'WarrantyScreen' ? styles.textactive : {}
                  ]}
                  onPress={() => this.navigateToScreen('WarrantyScreen')}
                >
                  {I18n.t('Side_Menu.warranty')}
                </Text>
              </View>
              <View
                style={[
                  styles.navBorderStyle,
                  this.state.currentScreen === 'ContactScreen' ? styles.navactive : {}
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.navItemStyle,
                    this.state.currentScreen === 'ContactScreen' ? styles.textactive : {}
                  ]}
                  onPress={() => this.navigateToScreen('ContactScreen')}
                >
                  {I18n.t('Side_Menu.contact')}
                </Text>
              </View>
              <View
                style={[
                  styles.navBorderStyle,
                  this.state.currentScreen === 'SelectLang' ? styles.navactive : {}
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.navItemStyle,
                    this.state.currentScreen === 'SelectLang' ? styles.textactive : {}
                  ]}
                  onPress={() => this.buttonCallback()}
                >
                  {this.state.lang}
                </Text>
              </View>
              {this.state.name != '' ? (
                <View
                  style={[
                    styles.navBorderStyle,
                    this.state.currentScreen === 'LogoutScreen' ? styles.navactive : {}
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.navItemStyle,
                      this.state.currentScreen === 'LogoutScreen' ? styles.textactive : {}
                    ]}
                    onPress={() => this.navigateToScreen('Logout')}
                  >
                    {I18n.t('Side_Menu.logout')}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: fonts.headerHeight
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: moderateScale(15)
  },
  logo: {
    flex: 1,
    height: moderateScale(20)
  },
  container2: {
    flex: 1,
    position: 'relative',
    width: '100%'
  },
  navSectionStyle: {
    marginTop: '3%'
  },
  navItemStyle: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    color: '#ffffff'
  },
  navBorderStyle: {
    padding: '5%'
  },
  navactive: {
    backgroundColor: '#45aabd'
  },
  textactive: {
    fontWeight: 'bold'
  },
  logged: {
    backgroundColor: '#00BDF2'
  },
  login: {
    backgroundColor: '#83b2bf'
  }
})
