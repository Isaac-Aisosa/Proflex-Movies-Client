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
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.png'
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AdMobBanner} from 'expo-ads-admob';
import { ScrollView } from "react-native-gesture-handler";
import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue,remove,orderByChild,query,limitToFirst,limitToLast,push } from "firebase/database";
import admobConfig from "./admob";


export default function IndexFeed({ route,navigation }) {

  const app = initializeApp(firebaseConfig);
//const storage = getStorage(app);
const database = getDatabase(app);
const [movies, setMovies] = useState('');
const [savedVideos, setSavedVideos] = useState('');
const [isLoading, setisLoading] = useState(true);



function nFormatter(num) {
  if (num >= 1000000000) {
     return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
     return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
     return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

const MoviesFeeds = async () => {
const GetMovies = query(ref_database(database, 'Movies/'),limitToLast(200));
onValue(GetMovies, (snapshot) => {
  let values = [];
  snapshot.forEach((child) => {
    values.push(child.val());
    
  });
  setisLoading(false);
  insertAds(values,admobConfig.bannerAdUnit1);
  insertAds(values,admobConfig.bannerAdUnit2);
  insertAds(values,admobConfig.bannerAdUnit3);
  insertAds(values,admobConfig.bannerAdUnit4);
  setMovies(values.reverse());
// console.log(values);
});
}

function insertAds(arr,adUnit){
  var randomIndex = Math.floor(Math.random() * arr.length)
  arr.splice(randomIndex, 0, {id: 'ad',unit: adUnit})
  return arr;
}

function ShowDetails(id) {
  console.log(id);
  navigation.navigate('MovieDetails',{id:id})
}

function Download(id) {
  console.log(id);
  navigation.navigate('Download',{id:id})
}

function SaveVideo(id,title) {
  AsyncStorage.setItem(id, JSON.stringify(id));
  ToastAndroid.show(`${title} Saved Succesfully`, ToastAndroid.SHORT);
  retriveSavedVideos();
}

let retriveSavedVideos = async () => {
  try {
       const keys = await AsyncStorage.getAllKeys();
     // console.log(keys);
      setSavedVideos(keys);
  } catch (error) {
    console.error(error)
  }
}

useEffect(()=>{
  MoviesFeeds();
  retriveSavedVideos();
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
    <ActivityIndicator size='large' color="#e8e6e6"  animating={isLoading}
           style={{paddingRight:10,position:'absolute', alignSelf:'center', paddingTop:10, marginVertical:200}}/>
    <FlatList
      data={movies}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      renderItem={({ item }) => (
   
   <View style={{backgroundColor:'#141414', flex: 1, flexDirection: 'column',  margin:1}}>
    {item.id == 'ad' ? (
     <View style={{backgroundColor:'#141414'}}>
    <AdMobBanner
    style={{width:'100%', marginBottom:20, alignSelf:'center'}}
     bannerSize="smartBannerPortrait"
     adUnitID={item.unit} // Test ID, Replace with your-admob-unit-id
     servePersonalizedAds={false}
      />
      </View> 
     ):(
      <View>
      <TouchableOpacity onPress={(id)=>ShowDetails(item.id)}>
      <Image   style={{justifyContent: 'center',  alignItems: 'center',width:"100%", height:item.thumbnailHeight * Dimensions.get('window').width/item.thumbnailWidth}}       
      source={{uri: item.thumbnailUri}}/>
      </TouchableOpacity>
   <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20, position:'absolute',}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,}}>
    <MaterialCommunityIcons name="hexagram" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.rating}</Text>
    </View>
    <Text style={{fontWeight:'bold', fontSize:20, marginLeft:5,marginTop:5, color:'#e8e6e6'}}>{item.title}</Text>
    <Text numberOfLines={2} style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:0, color:'#9e9e9e', }}>{item.description}</Text>
    <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}> 
    <MaterialCommunityIcons name="video-vintage" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#ad0794',}} />{item.category}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="movie-roll" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.genre}</Text>
    </View>
    <View  style={{paddingRight:10,flexDirection:'column', marginBottom:20, width:'100%'}}>

    {savedVideos.includes(item.id) == true ? (
      <MaterialCommunityIcons name="bookmark-check" style={{fontSize:30, paddingLeft:15, color:'yellow', position:'absolute'}} />
    ):(
      <MaterialCommunityIcons onPress={(id)=>SaveVideo(item.id, item.title)} name="bookmark-check" style={{fontSize:30, paddingLeft:15, color:'gray', position:'absolute'}} />
   
   )}

    <View style={{alignSelf:'flex-end',flexDirection:'row'}}>
    <MaterialCommunityIcons name="download" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(item.downloads)}</Text>
    <MaterialCommunityIcons name="eye-outline" style={{fontSize:18, paddingRight:0, marginTop:5, color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(item.views)}</Text>
    <Pressable
     onPress={(id)=>Download(item.id)}
     style={{width:100,height:30, flexDirection:'row', backgroundColor:'#ad0794',padding:5, borderRadius:5}}>
   <MaterialCommunityIcons name="cloud-download" style={{fontSize:18, paddingRight:0,  color:'#fff'}} />
    <Text style={{fontWeight:'bold', fontSize:15, marginLeft:5,marginTop:0, color:'#fff', paddingRight:10,}}>Download</Text>
   </Pressable>
   </View>
   </View>
  </View>
        
  )}

   </View>
     
      )}
    />


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


