import React , {PureComponent} from 'react'
import  {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { colors } from '../../Themes/color'

export default class LangCard extends PureComponent{
    constructor(props){
        super(props)
        this.state={}
    }

    render(){
        return(
            <TouchableOpacity onPress={()=>this.props.parentCallback(this.props.shortName)} activeOpacity={0.8} style={[styles.container,this.props.active?styles.shadow:null]}>
                <Image resizeMode='contain' source={this.props.flag} style={styles.flag}/>
                <Text allowFontScaling={false} style={styles.text} >{this.props.lang}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:moderateScale(150),
        height:moderateScale(150),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colors.colorWhite,
        borderWidth:moderateScale(1),
        borderRadius:moderateScale(10),
        borderColor:colors.colorGrey
    },
    shadow:{
        borderRadius: moderateScale(10),
        borderColor: '#fff',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderBottomWidth: 0,
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        elevation: 8,
    },
    flag:{
        width:moderateScale(50),
        height:moderateScale(50)
    },
    text:{
        fontSize:moderateScale(16),
        color:colors.colorBlack
    },
})