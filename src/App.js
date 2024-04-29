import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from './Components/Screens/SplashScreen'
import SelectLanguage from './Components/Screens/SelectLanguage'
import ScanQRCodeScreen from './Components/Screens/ScanQRCodeScreen'
import LoginScreen from './Components/Screens/LoginScreen'
import ForgotPassword from './Components/Screens/ForgotPassword'
import SelectComponentScreen from './Components/Screens/SelectComponentScreen'
import InspectionScreen from './Components/Screens/InspectionScreen'
import InspectionPicScreen from './Components/Screens/InspectionPicScreen'
import InspectionReviewScreen from './Components/Screens/InspectionReviewScreen'
import RegisterQRCodeScreen from './Components/Screens/RegisterQRCodeScreen'
import EquipmentPicsScreen from './Components/Screens/EquipmentPicsScreen'
import ReviewPicture from './Components/Screens/ReviewPicture'
import VerificationError from './Components/Screens/VerificationError'
import AboutScreen from './Components/Screens/AboutScreen'
import MaintenanceScreen from './Components/Screens/MaintenanceScreen'
import WarrantyScreen from './Components/Screens/WarrantyScreen'
import SelectLang from './Components/Screens/SelectLang'
import ThankyouScreen from './Components/Screens/ThankyouScreen'
import InspectionThankyouScreen from './Components/Screens/InspectionThankyouScreen'
import WarrantyClaimScreen from './Components/Screens/WarrantyClaimScreen'
import WarrantyClaimContentScreen from './Components/Screens/WarrantyClaimContentScreen'
import ReportingScreen from './Components/Screens/Reporting'
import ReportingThankyouScreen from './Components/Screens/ReportingThankyou'

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen
          name="ScanQRCodeScreen"
          component={ScanQRCodeScreen}
          options={{ unmountOnBlur: true }}
        />
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
        <Stack.Screen name="ReportingScreen" component={ReportingScreen} />
        <Stack.Screen name="ReportingThankyou" component={ReportingThankyouScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
