import {moderateScale} from 'react-native-size-matters'
import {Platform} from 'react-native'

export const fonts={
	heading:moderateScale(34),
	subHeading:moderateScale(18),
	title:moderateScale(16),
	text:moderateScale(14),
	smallText:moderateScale(12),
	headerHeight:Platform.OS=='ios'?moderateScale(80):moderateScale(60)
}
