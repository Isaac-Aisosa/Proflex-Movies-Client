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
import { uploadAsync } from "expo-file-system";
import { AdMobRewarded, AdMobBanner } from 'expo-ads-admob';
import * as IntentLauncher from 'expo-intent-launcher';
import admobConfig from "./admob";

export default function MovieDetails({ route,navigation }) {

    const {  
        id,
      } = route.params; 

      const app = initializeApp(firebaseConfig);
      //const storage = getStorage(app);
      const database = getDatabase(app);
      const [movie, setMovie] = useState('');
      const [enablePlay, setEnablePlay] = useState(false);
      const video = useRef(null);
      const [status, setStatus] = useState({});
      let view = 0;

      const LoadRewardAd = async () => {
        await  AdMobRewarded.setAdUnitID(admobConfig.ViewrewardAdUnit); // Test ID, Replace with your-admob-unit-id
        await AdMobRewarded.requestAdAsync();
        }
      LoadRewardAd();

      AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', (reward) => {
        //console.log(reward)
        Play();
        LoadRewardAd();
      });

      AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', () => {
        LoadRewardAd();
      });
    
      AdMobRewarded.addEventListener('rewardedVideoDidDismiss', () => {
        LoadRewardAd();
        Alert.alert(`Please Watch Ad to Stream Video.`);
      });

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
      
      const GetMovie = async () => {
      const GetMovie = ref_database(database, 'Movies/' + id);
      onValue(GetMovie, (snapshot) => {
       setMovie(snapshot.val());
       view = snapshot.val().views
       // console.log(snapshot.val());
      });
      }
      const UpdateViewCount = async () => {
        update(ref_database(database, 'Movies/' + id),{"views": ++view})
       // console.log(view)
        }
       
       async function Play() {
        try {
                     
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
              data: movie.fileUri,
              flags: 1,
              type: "video/*",
          });
        }catch(e){
            console.log(e.message);
        }
        }



      function Download(id) {
        // console.log(id);
        navigation.navigate('Download',{id:id})
      }

      
      async function enablePlays (){ 
        setEnablePlay(true);
        console.log('play Enabled')
    }

    
      async function showAd (){
      AdMobRewarded.showAdAsync();
        Play(); 
      }

      useEffect(()=>{
        GetMovie();
        UpdateViewCount();
        setTimeout(() => {  enablePlays() }, 6000);
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


  {enablePlay == true ? (
  <TouchableOpacity style={{marginTop:0, width:'100%', height:40, backgroundColor:'#11a603', borderBottomRightRadius:10, borderBottomLeftRadius:10}}  
  onPress={(url)=>showAd()}>
 <Text style={{fontWeight:'bold', fontSize:20, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,alignSelf:'center'}}>
 <MaterialCommunityIcons name="play" style={{fontSize:20, paddingRight:0,  color:'#fff'}} /> Watch now</Text>
 </TouchableOpacity>

    ):( 
     <View style={{flexDirection:'row',marginTop:0, width:'100%', height:40, backgroundColor:'#11a603', borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
       <ActivityIndicator size='small' color="#e8e6e6"  animating={true}
           style={{paddingRight:0,position:'relative', alignSelf:'center', }}/>
      <Text style={{fontWeight:'bold', fontSize:15, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,alignSelf:'center'}}>
      Please Wait...</Text>
    </View>
    )}

     
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
   {/* <Pressable onPress={(id)=>Download(movie.id)}
     style={{width:'90%',height:40, backgroundColor:'#ad0794',padding:5, borderRadius:5, marginTop:20, alignSelf:'center'}}>
    <Text style={{fontWeight:'bold', fontSize:18, marginLeft:5,marginTop:5, color:'#fff', paddingRight:10,alignSelf:'center'}}>
    <MaterialCommunityIcons name="cloud-download" style={{fontSize:20, paddingRight:0,  color:'#fff'}} /> Download</Text>
   </Pressable> */}

<View  style={{width:'100%', marginTop:50, alignSelf:'center',bottom:0,position:'relative'}}>
<AdMobBanner
     bannerSize="smartBannerPortrait"
     adUnitID= {admobConfig.ViewbannerAdUnit} // Test ID, Replace with your-admob-unit-id
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
