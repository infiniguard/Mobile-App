import React, { PureComponent } from "react";
import { TouchableOpacity,Text, StyleSheet } from "react-native";
import LinearGradient from 'react-native-linear-gradient'
import { moderateScale } from "react-native-size-matters";
import { colors } from "../../Themes/color";

export default class Button extends PureComponent{
    constructor(props){
        super(props)
        this.state={}
    }

    componentDidMount(){
        console.log(this.props);
    }

    render(){
        return(
            <TouchableOpacity activeOpacity={0.8} style={[styles.conatiner,this.props.styles]} onPress={()=>this.props.parentCallback()}>
                <LinearGradient colors={['#7bb3c2','#51b6d3','#2abae2','#07bcef']} style={styles.btn}>
                    <Text style={styles.text}>{this.props.label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    comntainer:{
        width:'100%',
        height:moderateScale(50),
        borderRadius:moderateScale(50)
    },
    btn:{
        width:'100%',
        height:moderateScale(50),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:moderateScale(50)
    },
    text:{
        color:colors.colorWhite,
        fontSize:moderateScale(18)
    }
})