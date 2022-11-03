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
  Pressable,
  ToastAndroid ,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  FlatList,
  Alert,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import image from '../assets/em.gif'
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AdMobBanner} from 'expo-ads-admob';
import { ScrollView } from "react-native-gesture-handler";
import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue,remove,orderByChild,query,limitToFirst,limitToLast,push, equalTo,update } from "firebase/database";


export default function FeedBack({ route,navigation }) {

  const app = initializeApp(firebaseConfig);
//const storage = getStorage(app);
const database = getDatabase(app);
const [feedback, setFeedBack] = useState('');

function SendFeedBack(){
    if (feedback == ''){
        ToastAndroid.show(`Please write a feedback`, ToastAndroid.SHORT);
    }
    else{
        const PostKey = push(ref_database(database, 'FeedBacks/'), {
            feedback: feedback,
          })
          update(PostKey,{"id": PostKey.key})
          ToastAndroid.show(`Sent`, ToastAndroid.SHORT);  
          Alert.alert(`Thanks, We have recieved your feedback.`);
          setFeedBack('') 
    }
}

useEffect(()=>{
  
},[])

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'}/>
    
    <View style={{backgroundColor:'#141414', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
     {/* <Image style={{ alignSelf:'center', marginLeft:20,marginTop:5, width:'10%', height:40}} source={logo}   /> */}
      <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#e8e6e6'}}>Pro<Text style={{fontWeight:'normal'}}>flex.</Text></Text>
      <View style={{alignSelf:'flex-end', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <MaterialCommunityIcons onPress={(id)=>navigation.navigate('Search')} name="magnify" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      {/* <MaterialCommunityIcons onPress={(id)=>navigation.navigate('Explore')} name="compass" style={{fontSize:30, paddingRight:10, color:'#fff'}} /> */}
      <MaterialCommunityIcons onPress={(id)=>navigation.navigate('More')} name="dots-vertical" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
    </View>
    </View>
<ScrollView>
    <Text style={{fontSize:15, marginTop:20, color:'#fff', margin:10}}>
           Please Send us your Feedback, so we can serve you better.
        </Text>
            <TextInput
             mode="outlined"
             label=""
             placeholder='Tell us what you want.....'
             name='Description'
             value={feedback}
             keyboardType='default'
             style={{backgroundColor:'#f7f0f4', fontSize:20, height:300,textAlignVertical:'top',margin:5}}
             textContentType='none'
             autoCapitalize='none'
             textAlignVertical='top'
             multiline={true}
             activeOutlineColor="#0255d1"
             onChangeText={(val)=>setFeedBack(val)}/>

    <Pressable
     onPress={()=>SendFeedBack()}
     style={{width:'80%',height:40, backgroundColor:'#0255d1',padding:5, borderRadius:5, margin:30, alignSelf:'center'}}>
    <Text style={{fontWeight:'bold', fontSize:18, marginLeft:5,marginTop:2, color:'#fff', paddingRight:10,alignSelf:'center'}}>
    <MaterialCommunityIcons name="send-circle" style={{fontSize:20, paddingRight:0,  color:'#fff',}} />
        Send Feedback</Text>
   </Pressable>

</ScrollView>
    </View>
 
  );

  
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: '#141414',
        },

        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 150,
          backgroundColor:'red'
        },
  });


