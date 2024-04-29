import React, { Component } from 'react';
import {StyleSheet,Text,View,TouchableOpacity,ScrollView,Linking, Alert} from 'react-native';
import Header from '../Common/Header'
import I18n from '../../languages/i18n2';
import { moderateScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage'


export default class MaintenanceScreen extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isVisible: false,
            url:'https://www.infiniguard.com/warranty'
        }
    }

  pressHandler(){
    if('Lang',I18n.locale=="en"){
    Linking.canOpenURL('http://www.infiniguard.com/maintenance').then(supported => {
      if (supported) {
        return Linking.openURL('http://www.infiniguard.com/maintenance').catch(()=>null);
      } else {
        Alert.alert('Error',"Don't know how to open URI: " + 'http://www.infiniguard.com/maintenance');
      }
    })
  }
  else{
    Linking.canOpenURL('https://www.infiniguard.com/mantenimiento').then(supported => {
      if (supported) {
        return Linking.openURL('https://www.infiniguard.com/mantenimiento').catch(()=>null);
      } else {
        Alert.alert('Error',"Don't know how to open URI: " + 'https://www.infiniguard.com/mantenimiento');
      }
    })
  }
  }

  componentWillMount(){
    AsyncStorage.getItem('SelectedLang').then((value)=>{
        var selected=value
        if(selected=='es'){
            this.setState({url:'https://www.infiniguard.com/garantia'})
        }
        else{
          this.setState({url:'https://www.infiniguard.com/warranty'})
        }
    })
}

  render() {
    const headerProp = {
      title: '',
      type: 'image',
    };

    

    return (
      <View style={styles.container}>
        <Header info={headerProp} navigation={this.props.navigation} />
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.box}>
              <View style={styles.container1}>
                <Text allowFontScaling={false} style={styles.pageheading}>{I18n.t('Guidelines.Title')}</Text>
                <View style={styles.border} />
              </View>
              <Text></Text>
              <View style={styles.textbox}>
                <View style={styles.dot} />
                <Text allowFontScaling={false} style={styles.textcontent}>{I18n.t('Guidelines.Text1')}</Text>
              </View>
              <Text></Text>
              <View style={styles.textbox}>
                <View style={styles.dot} />
                <Text allowFontScaling={false} style={styles.textcontent}>{I18n.t('Guidelines.Text2')}</Text>
              </View>
              <Text></Text>
              <View style={styles.textbox}>
                <View style={styles.dot} />
                <Text allowFontScaling={false} style={styles.textcontent}>{I18n.t('Guidelines.Text3')}</Text>
              </View>
              <Text></Text>
              <View style={styles.textbox}>
                <View style={styles.dot} />
                <Text allowFontScaling={false} style={styles.textcontent}>{I18n.t('Guidelines.Text4')}</Text>
              </View>
              <Text></Text>
              <View style={styles.textbox}>
                <View style={styles.dot} />
                <Text allowFontScaling={false} style={styles.textcontent}>{I18n.t('Guidelines.Text5')}</Text>
              </View>
              <Text></Text>
              <View style={styles.textbox}>
                <View style={styles.dot} />
                <Text allowFontScaling={false} style={styles.textcontent}>{I18n.t('Guidelines.Text6')}</Text>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>this.pressHandler()}>
                  <Text allowFontScaling={false} style={styles.textlink}>{I18n.t('Guidelines.Text7')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:  0,
    backgroundColor: '#fff',
  },

  content: {
      flex: 1,

      height:'70%',
      padding:'5%'
  },
  box:{
    height:'100%'
  },
  textbox:{
    position:'relative',
    flexDirection:'row'
  },
  textcontent:{
   color:'#333333',
   textAlign:'left',
   fontSize:moderateScale(13),
   fontWeight:'300',
   paddingLeft:10
},
textlink:{
  color:'blue',
  textAlign:'left',
  fontSize:moderateScale(13),
  fontWeight:'300',
  paddingLeft:2,
   textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "blue",
  
},
  textHeading:{
    color:'#333333',
    textAlign:'justify',
    fontSize:moderateScale(13),
    fontWeight:'500',
  },
  container1:{
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:moderateScale(5),
  },
  pageheading:{
    fontSize:moderateScale(17),
    fontWeight:'700',
    textAlign:'center',
    color: '#32c8ed',
    width:'100%'
  },
  border:{
    width:30,
    borderBottomWidth:2,
    color: '#13b0dd',
    margin:8
  },
  dot:{
    height:6,
    width:6,
    marginTop:9,
    backgroundColor:'#000',
    borderRadius:50,
  }
});
