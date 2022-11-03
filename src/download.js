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
  Linking,
  Button,
  ActivityIndicator,
  Text,
  Alert,
  FlatList
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.png'
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { ScrollView } from "react-native-gesture-handler";
import { Video, AVPlaybackStatus, Audio } from 'expo-av';

import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue, update} from "firebase/database";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as WebBrowser from 'expo-web-browser';
import { AdMobRewarded, AdMobBanner } from 'expo-ads-admob';
import admobConfig from "./admob";

export default function Download({ route,navigation }) {

    const {  
        id,
      } = route.params; 

      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);

      const [movie, setMovie] = useState('');
      const [enableDowloads, setEnableDownloads] = useState(false);
      const video = useRef(null);
      const [status, setStatus] = useState({});
      const [downloadProgresss, setDownloadProgress] = useState();
      let download = 0;

      const LoadRewardAd = async () => {
        await  AdMobRewarded.setAdUnitID(admobConfig.downloadRewardAdUnit); // Test ID, Replace with your-admob-unit-id
        await AdMobRewarded.requestAdAsync();
        }
      LoadRewardAd();

        AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', (reward) => {
          //console.log(reward)
          downloadFile();
          LoadRewardAd();
        });

        // AdMobRewarded.addEventListener('rewardedVideoDidPresent', () => {
        //   enableDownload();
        //   console.log('Ad loaded')
        // });

        AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', () => {
          LoadRewardAd();
        });
      
        AdMobRewarded.addEventListener('rewardedVideoDidDismiss', () => {
          LoadRewardAd();
          Alert.alert(`Please Watch Ad to Enable Download Process.`);
        });

      const GetMovie = async () => {
      const GetMovie = ref_database(database, 'Movies/' + id);
      onValue(GetMovie, (snapshot) => {
       setMovie(snapshot.val());
       download = snapshot.val().downloads
       // console.log(snapshot.val());
      });
      }

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

      const UpdateDownloadCount = async () => {
        update(ref_database(database, 'Movies/' + id),{"downloads": ++download})
        //console.log(download)
        }
    

        async function downloadFile (){ 
            const supported = await Linking.canOpenURL(movie.fileUri);
            //update download count
            if (supported) {
              await Linking.openURL(movie.fileUri);
            } else {
              Alert.alert(`Don't know how to open this URL: ${movie.fileUri}`);
            }
        }

        async function enableDownload (){ 
          setEnableDownloads(true);
          console.log('download Enabled')
      }
        async function showAd (){
        AdMobRewarded.showAdAsync();
        downloadFile();
        }

      useEffect(()=>{
        GetMovie();
        UpdateDownloadCount();
        setTimeout(() => {  enableDownload() }, 6000);
        AdMobRewarded.removeAllListeners();
      },[])

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'}/>
    <View style={{backgroundColor:'#141414', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
     {/* <Image style={{ alignSelf:'center', marginLeft:20,marginTop:5, width:'10%', height:40}} source={logo}   /> */}
      <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#e8e6e6'}}>Pro<Text style={{fontWeight:'normal'}}>flex.</Text></Text>
      <View style={{alignSelf:'flex-end', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <MaterialCommunityIcons onPress={(id)=>navigation.navigate('Search')} name="magnify" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      <MaterialCommunityIcons onPress={(id)=>navigation.navigate('Explore')} name="compass" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      </View>
    </View>
  
  <ScrollView>
      <Image  style={{justifyContent: 'center',  alignItems: 'center',height:300, width:'100%', marginTop:0}}       
      source={{uri: movie.thumbnailUri}}/>
    <View>
    {enableDowloads == true ? (
    <TouchableOpacity style={{marginTop:0, width:'100%', height:50, backgroundColor:'#ad0794', borderBottomRightRadius:10, borderBottomLeftRadius:10}}  
    onPress={() => showAd()}>
   <Text style={{fontWeight:'bold', fontSize:20, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,alignSelf:'center'}}>
       <MaterialCommunityIcons name="cloud-download" style={{fontSize:20, paddingRight:0,  color:'#fff'}} /> Download</Text>
       <Text style={{fontWeight:'bold', fontSize:10, marginLeft:5, color:'#cfcfcf', paddingRight:5,alignSelf:'center'}}>
        Watch an Ad</Text> 
   </TouchableOpacity>

    ):( 
     <View style={{flexDirection:'row',marginTop:0, width:'100%', height:50, backgroundColor:'#ad0794', borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
       <ActivityIndicator size='small' color="#e8e6e6"  animating={true}
           style={{paddingRight:0,position:'relative', alignSelf:'center', }}/>
      <Text style={{fontWeight:'bold', fontSize:15, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,alignSelf:'center'}}>
      Please Wait...</Text>
    </View>
    )}

    </View>

     
    <Text style={{fontWeight:'bold', fontSize:20, marginLeft:5,marginTop:5, color:'#fff'}}>{movie.title}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:0, color:'#9e9e9e'}}>{movie.description}</Text>
    <View  style={{paddingRight:10,flexDirection:'row', marginBottom:0}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}> 
    <MaterialCommunityIcons name="video-vintage" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#ad0794',}} />{movie.category}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="movie-roll" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#fff',}} />{movie.genre}</Text>
    </View>
    <View  style={{paddingRight:10,flexDirection:'row', marginBottom:0}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="star" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{movie.rating}</Text>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:5,}}>
    <MaterialCommunityIcons name="clock" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#fff',}} />{movie.release_date}</Text>
    <MaterialCommunityIcons name="download" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(movie.downloads)}</Text>
    <MaterialCommunityIcons name="eye-outline" style={{fontSize:18, paddingRight:0, marginTop:5, color:'gray',}} />
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'gray', paddingRight:10,}}>{nFormatter(movie.views)}</Text>
    </View>
 
    <View  style={{width:'100%', marginTop:50, alignSelf:'center',bottom:0,position:'relative'}}>
    <AdMobBanner
     bannerSize="smartBannerPortrait"
     adUnitID= {admobConfig.DownloadbannerAdUnit} // Test ID, Replace with your-admob-unit-id
     servePersonalizedAds={false}
      />
</View>

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
