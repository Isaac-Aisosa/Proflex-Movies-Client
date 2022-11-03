import React, { useEffect, useState, useRef } from "react";
import {
  Platform,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Image,
  ToastAndroid ,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Easing,
  FlatList,
  Share,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.png'
import { TextInput } from 'react-native-paper';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from '@react-native-async-storage/async-storage'

import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue,remove,orderByChild,query,limitToFirst,limitToLast,startAt,endAt,equalTo } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";



export default function More({ route,navigation }) {

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Proflex Movies | Stream and download your favourite movies url: https://play.google.com/store/apps/details?id=com.proflex_movies_app.www',
        
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };




  return (
    <View style={styles.container}>
       <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'}/>
       <View style={{backgroundColor:'#141414', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
       <Pressable style={{width:'100%',height:50, flexDirection:'row', marginTop:30,marginLeft:20}} onPress={onShare}>
    <MaterialCommunityIcons name="share-variant" style={{fontSize:25,color:'#fff'}} />
    <Text style={{fontSize:18,color:'#fff',fontWeight:'300', marginLeft:10}}>Share Proflex</Text>
 
    </Pressable>
      </View>

    <Image style={{ alignSelf:'center', marginLeft:20,marginTop:'50%', width:'20%', height:90}} source={logo}   />
    <Text style={{alignSelf:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#e8e6e6'}}>Pro<Text style={{fontWeight:'normal'}}>flex.</Text></Text>
    <Text style={{fontSize:14,color:'#cccccc',fontWeight:'300',letterSpacing:18, alignSelf:'center'}}>movies</Text>

<View style={{alignSelf:'center', bottom:0,position:'absolute', paddingBottom:30}}>
<Text style={{fontSize:14,color:'#cccccc',fontWeight:'300',letterSpacing:1, alignSelf:'center',}}>Developed by</Text>
    <Text style={{fontSize:18,color:'#cccccc',fontWeight:'bold',letterSpacing:1, alignSelf:'center', marginTop:0}}>AISO-Tech</Text>
    <Text style={{fontSize:18,color:'#cccccc',fontWeight:'100',letterSpacing:1, alignSelf:'center', marginTop:0}}>aisotech10@gmail.com</Text>
</View>

    </View>      

 
 
  );

  
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: '#141414',
        },

  });
