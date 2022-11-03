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
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../assets/logo.png'
import { FAB } from 'react-native-paper';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from '@react-native-async-storage/async-storage'

import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue,remove,orderByChild,query,limitToFirst,limitToLast,startAt,endAt,equalTo } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";



export default function Explore({ route,navigation }) {

  const app = initializeApp(firebaseConfig);
  //const storage = getStorage(app);
  const database = getDatabase(app);
  const [latest, setLatest] = useState('');
  const [topRated, setTopRated] = useState('');
  const [nollywood, setNollyWood] = useState('');
  const [hollyWood, setHollyWood] = useState('');
  const [isLoading, setisLoading] = useState(true);



    const GetLatest = async () => {
      const GetLatests = query(ref_database(database, 'Movies/'), limitToLast(30));
      onValue(GetLatests, (snapshot) => {
        let values = [];
        snapshot.forEach((child) => {
          values.push(child.val());
        });
        setisLoading(false);
       setLatest(values.reverse());
      //  console.log(values);
      });
      } 

      const GetTopRated = async () => {
        const GetTopRateds = query(ref_database(database, 'Movies/'), orderByChild('rating'),startAt(7),endAt(10), limitToFirst(20));
        onValue(GetTopRateds, (snapshot) => {
          let values = [];
          snapshot.forEach((child) => {
            values.push(child.val());
          });
         setTopRated(values.reverse());
        //  console.log(values);
        });
        } 

        const GetNollyWood = async () => {
          const GetNollyWoods = query(ref_database(database, 'Movies/'), orderByChild('category'),equalTo('NollyWood'), limitToFirst(50));
          onValue(GetNollyWoods, (snapshot) => {
            let values = [];
            snapshot.forEach((child) => {
              values.push(child.val());
            });
           setNollyWood(values.reverse());
          //  console.log(values);
          });
          }

          const GetHollyWood = async () => {
            const GetHollyWoods = query(ref_database(database, 'Movies/'), orderByChild('category'),equalTo('HollyWood'), limitToFirst(50));
            onValue(GetHollyWoods, (snapshot) => {
              let values = [];
              snapshot.forEach((child) => {
                values.push(child.val());
              });
             setHollyWood(values.reverse());
            //  console.log(values);
            });
            } 


    function ShowDetails(id) {
      console.log(id);
      navigation.navigate('MovieDetails',{id:id})
    }

    useEffect(()=>{
      GetLatest();
      GetTopRated();
      GetNollyWood();
      GetHollyWood();
    },[])

  return (
    <View style={styles.container}>
       <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'}/>
    <View style={{backgroundColor:'#141414', width:'100%', height:50, marginBottom:0,marginTop:30, flexDirection:'column',borderWidth:0}}>
     {/* <Image style={{ alignSelf:'center', marginLeft:20,marginTop:5, width:'10%', height:40}} source={logo}   /> */}
      <Text style={{marginLeft:20, textAlignVertical:'center', marginTop:5, fontSize:25,letterSpacing:4, fontWeight:'bold', color:'#e8e6e6'}}>Pro<Text style={{fontWeight:'normal'}}>flex.</Text></Text>
      <View style={{alignSelf:'flex-end', position:'absolute', marginTop:5, paddingVertical:5, flexDirection:'row'}}>
      <MaterialCommunityIcons onPress={(id)=>navigation.navigate('Search')} name="magnify" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      <MaterialCommunityIcons onPress={(id)=>navigation.navigate('More')} name="dots-vertical" style={{fontSize:30, paddingRight:10, color:'#fff'}} />
      </View>
    </View>
    <ActivityIndicator size='large' color="#e8e6e6"  animating={isLoading}
           style={{paddingRight:10,position:'absolute', alignSelf:'center', paddingTop:10, marginVertical:200}}/>
<ScrollView>
    <View>
    <Text style={{marginLeft:5, color:'#fff', marginTop:10, fontWeight:'bold', fontSize:15}}>Latest</Text>
    <FlatList
      data={latest}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      horizontal={true}
      onScrollToTop={true}
      renderItem={({ item }) => (
   <View style={{backgroundColor:'#141414', flex: 1, flexDirection: 'column',  margin:1}}>
    <View>
      <TouchableOpacity onPress={(id)=>ShowDetails(item.id)}>
      <Image   style={{justifyContent: 'center',  alignItems: 'center', height: 200,width:130}}       
      source={{uri: item.thumbnailUri}}/>
      </TouchableOpacity>
   <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20, position:'absolute',}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,}}>
    <MaterialCommunityIcons name="hexagram" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.rating}</Text>
    </View>
    <Text style={{fontWeight:'bold', fontSize:10, marginLeft:1,marginTop:5, color:'#e8e6e6'}}>{item.title}</Text>
   </View>  
   </View>
     
      )}
    />
    </View>      

  <View>
    <Text style={{marginLeft:5, color:'#fff', marginTop:15, fontWeight:'bold', fontSize:15}}>Top Rated</Text>
    <FlatList
      data={topRated}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      horizontal={true}
      onScrollToTop={true}
      renderItem={({ item }) => (
   <View style={{backgroundColor:'#141414', flex: 1, flexDirection: 'column',  margin:1}}>
    <View>
      <TouchableOpacity onPress={(id)=>ShowDetails(item.id)}>
      <Image   style={{justifyContent: 'center',  alignItems: 'center', height: 200,width:130}}       
      source={{uri: item.thumbnailUri}}/>
      </TouchableOpacity>
   <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20, position:'absolute',}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,}}>
    <MaterialCommunityIcons name="hexagram" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.rating}</Text>
    </View>
    <Text style={{fontWeight:'bold', fontSize:10, marginLeft:1,marginTop:5, color:'#e8e6e6'}}>{item.title}</Text>
   </View>  
   </View>
     
      )}
    />
    </View>   

    <View>
    <Text style={{marginLeft:5, color:'#fff', marginTop:15, fontWeight:'bold', fontSize:15}}>Nollywood</Text>
    <FlatList
      data={nollywood}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      horizontal={true}
      onScrollToTop={true}
      renderItem={({ item }) => (
   <View style={{backgroundColor:'#141414', flex: 1, flexDirection: 'column',  margin:1}}>
    <View>
      <TouchableOpacity onPress={(id)=>ShowDetails(item.id)}>
      <Image   style={{justifyContent: 'center',  alignItems: 'center', height: 200,width:130}}       
      source={{uri: item.thumbnailUri}}/>
      </TouchableOpacity>
   <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20, position:'absolute',}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,}}>
    <MaterialCommunityIcons name="hexagram" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.rating}</Text>
    </View>
    <Text style={{fontWeight:'bold', fontSize:10, marginLeft:1,marginTop:5, color:'#e8e6e6'}}>{item.title}</Text>
   </View>  
   </View>
     
      )}
    />
    </View>

    <View>
    <Text style={{marginLeft:5, color:'#fff', marginTop:15, fontWeight:'bold', fontSize:15}}>Hollywood</Text>
    <FlatList
      data={hollyWood}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={10}
      inverted={false}
      horizontal={true}
      onScrollToTop={true}
      renderItem={({ item }) => (
   <View style={{backgroundColor:'#141414', flex: 1, flexDirection: 'column',  margin:1}}>
    <View>
      <TouchableOpacity onPress={(id)=>ShowDetails(item.id)}>
      <Image   style={{justifyContent: 'center',  alignItems: 'center', height: 200,width:130}}       
      source={{uri: item.thumbnailUri}}/>
      </TouchableOpacity>
   <View  style={{paddingRight:10,flexDirection:'row', marginBottom:20, position:'absolute',}}>
    <Text style={{fontWeight:'normal', fontSize:14, marginLeft:5,marginTop:5, color:'#fff', paddingRight:5,}}>
    <MaterialCommunityIcons name="hexagram" style={{fontSize:18, paddingRight:0,marginTop:5,  color:'#f5710c',}} />{item.rating}</Text>
    </View>
    <Text style={{fontWeight:'bold', fontSize:10, marginLeft:1,marginTop:5, color:'#e8e6e6'}}>{item.title}</Text>
   </View>  
   </View>
     
      )}
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

  });
