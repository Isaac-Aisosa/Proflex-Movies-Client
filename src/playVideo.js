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
  Text,
  Alert,
  FlatList
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue, update} from "firebase/database";
import { ResizeMode } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import { WebView } from 'react-native-webview';

export default function PlayVideo({ route,navigation }) {

    const {  
        id,
      } = route.params; 

      const app = initializeApp(firebaseConfig);
      //const storage = getStorage(app);
      const database = getDatabase(app);
      const [movie, setMovie] = useState('');
      const video = useRef(null);
      const [status, setStatus] = useState({});
      const [downloadProgresss, setDownloadProgress] = useState();

      let view = 0;
      
      const GetMovie = async () => {
      const GetMovie = ref_database(database, 'Movies/' + id);
      onValue(GetMovie, (snapshot) => {
       setMovie(snapshot.val());
       view = snapshot.val().views
        console.log(snapshot.val());
      });
      }

    //   const UpdateViewCount = async () => {
    //     update(ref_database(database, 'Movies/' + id),{"views": ++view})
    //     console.log(view)
    //     }
    
        async function play(uri){
            const supported = await Linking.canOpenURL(uri);
        
            if (supported) {
              // Opening the link with some app, if the URL scheme is "http" the web link should be opened
              // by some browser in the mobile
              await Linking.openURL(uri);
            } else {
              Alert.alert(`Don't know how to open this URL: ${uri}`);
            }
        }
        
      useEffect(()=>{
        GetMovie();
        // UpdateViewCount();
      },[])

  return (
    <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'}/>
    <View style={{backgroundColor:'#141414', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
     {/* <Image style={{ alignSelf:'center', marginLeft:20,marginTop:5, width:'10%', height:40}} source={logo}   /> */}
      <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#e8e6e6'}}>Pro<Text style={{fontWeight:'normal'}}>flex.</Text></Text>
      <View style={{alignSelf:'flex-end', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <MaterialCommunityIcons name="magnify" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      <MaterialCommunityIcons name="compass" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      </View>
    </View>
    {/* <VideoPlayer
      videoProps={{
      shouldPlay: true,
      resizeMode: ResizeMode.CONTAIN,
      // ❗ source is required https://docs.expo.io/versions/latest/sdk/video/#props
      source: {
      uri: movie.fileUri,
    },
  }}
   />    */}

<WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: '<iframe src="https://players.brightcove.net/1752604059001/VJCJXL3Ye_default/index.html?videoId=4093643993001" allowfullscreen="" allow="encrypted-media" style="width: 640px; height: 360px;"></iframe>' }}
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
