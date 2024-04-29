import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,TouchableOpacity,ScrollView} from 'react-native';
import Header from '../Common/Header'
import I18n from '../../languages/i18n2';
import { moderateScale } from 'react-native-size-matters';

export default class AboutScreen extends Component {
    constructor (props) {
      super(props)
      this.state = {
        isVisible: false,
        }
    }

  render() {
    const headerProp = {
      title: '',
      type: 'image',
    };

    return (
      <View style={styles.container}>
        <Header info={headerProp} navigation={this.props.navigation} />
        <View style={styles.content}>
          <ScrollView style={styles.box}>
            <View style={styles.container1}>
              <Text allowFontScaling={false} style={styles.pageheading}>{I18n.t('About_Us.Title')}</Text>
              <View style={styles.border} />
            </View>
            <Text allowFontScaling={false}  style={styles.textcontent}>{I18n.t('About_Us.Text')}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:  0,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    height:'70%',
    padding:moderateScale(20)
  },
  box:{
    height:'100%'
  },
  textcontent:{
    color:'#333333',
    textAlign:'justify',
    fontSize:moderateScale(15),
    lineHeight: moderateScale(20),
    fontWeight:'300',
    paddingLeft:moderateScale(10),
    paddingRight:moderateScale(10)
  },
  container1:{
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:moderateScale(5),
    paddingRight:moderateScale(5)
  },
  pageheading:{
    fontSize:moderateScale(16),
    fontWeight:'700',
    textAlign:'center',
    color: '#32c8ed',
    width:'100%',
  },
  border:{
    width:moderateScale(30),
    borderBottomWidth:moderateScale(2),
    color: '#13b0dd',
    margin:moderateScale(8),
    marginBottom:moderateScale(10)
  }
});
