/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from './src/Components/Screens/SplashScreen'
import SelectLanguage from './src/Components/Screens/SelectLanguage'
import ScanQRCodeScreen from './src/Components/Screens/ScanQRCodeScreen'
import LoginScreen from './src/Components/Screens/LoginScreen'
import ForgotPassword from './src/Components/Screens/ForgotPassword'
import SelectComponentScreen from './src/Components/Screens/SelectComponentScreen'
import InspectionScreen from './src/Components/Screens/InspectionScreen'
import InspectionPicScreen from './src/Components/Screens/InspectionPicScreen'
import InspectionReviewScreen from './src/Components/Screens/InspectionReviewScreen'
import RegisterQRCodeScreen from './src/Components/Screens/RegisterQRCodeScreen'
import EquipmentPicsScreen from './src/Components/Screens/EquipmentPicsScreen'
import ReviewPicture from './src/Components/Screens/ReviewPicture'
import VerificationError from './src/Components/Screens/VerificationError'
import VerificationInfo from './src/Components/Screens/VerificationInfo'
import AboutScreen from './src/Components/Screens/AboutScreen'
import MaintenanceScreen from './src/Components/Screens/MaintenanceScreen'
import WarrantyScreen from './src/Components/Screens/WarrantyScreen'
import SelectLang from './src/Components/Screens/SelectLang'
import ThankyouScreen from './src/Components/Screens/ThankyouScreen'
import InspectionThankyouScreen from './src/Components/Screens/InspectionThankyouScreen'
import WarrantyClaimScreen from './src/Components/Screens/WarrantyClaimScreen'
import WarrantyClaimContentScreen from './src/Components/Screens/WarrantyClaimContentScreen'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import ReportingScreen from './src/Components/Screens/Reporting'
import ReportingThankyouScreen from './src/Components/Screens/ReportingThankyou'

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen name="ScanQRCodeScreen" component={ScanQRCodeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SelectComponentScreen" component={SelectComponentScreen} />
        <Stack.Screen name="InspectionScreen" component={InspectionScreen} />
        <Stack.Screen name="InspectionPicScreen" component={InspectionPicScreen} />
        <Stack.Screen name="InspectionReviewScreen" component={InspectionReviewScreen} />
        <Stack.Screen name="RegisterQRCodeScreen" component={RegisterQRCodeScreen} />
        <Stack.Screen name="EquipmentPicsScreen" component={EquipmentPicsScreen} />
        <Stack.Screen name="ReviewPicture" component={ReviewPicture} />
        <Stack.Screen name="VerificationError" component={VerificationError} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} />
        <Stack.Screen name="WarrantyScreen" component={WarrantyScreen} />
        <Stack.Screen name="SelectLang" component={SelectLang} />
        <Stack.Screen name="ThankyouScreen" component={ThankyouScreen} />
        <Stack.Screen name="InspectionThankyouScreen" component={InspectionThankyouScreen} />
        <Stack.Screen name="WarrantyClaimScreen" component={WarrantyClaimScreen} />
        <Stack.Screen name="WarrantyClaimContentScreen" component={WarrantyClaimContentScreen} />
        <Stack.Screen name="VerificationInfo" component={VerificationInfo} />
        <Stack.Screen name="ReportingScreen" component={ReportingScreen} />
        <Stack.Screen name="ReportingThankyou" component={ReportingThankyouScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App