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
import { TextInput } from 'react-native-paper';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import AsyncStorage from '@react-native-async-storage/async-storage'

import firebaseConfig from './firebase'
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import { getDatabase, set, ref as ref_database, child, onValue,remove,orderByChild,query,limitToFirst,limitToLast,startAt,endAt,equalTo } from "firebase/database";
import { ScrollView } from "react-native-gesture-handler";



export default function Search({ route,navigation }) {

  const app = initializeApp(firebaseConfig);
  //const storage = getStorage(app);
  const database = getDatabase(app);
  const [search_result, setSearch_Result] = useState('');
  const [search_query, setSearchQuery] = useState('');
  const [notFound, setNotFound] = useState('none');
  const [makeSearch, setMakeSearch] = useState('flex');
  const [isLoading, setisLoading] = useState(false);

  useEffect(()=>{
    if (search_query == '' || [] || null){
        setSearch_Result([]);
        setMakeSearch('flex');
      }
  },[search_query])


  const Search = async () => {
      setisLoading(true);
      const Results = query(ref_database(database, 'Movies/'), orderByChild('title'),startAt(search_query),endAt(search_query+"\uf8ff"), limitToFirst(50));
      onValue(Results, (snapshot) => {
        let values = [];
        snapshot.forEach((child) => {
          values.push(child.val());
        });
         setisLoading(false);
         setMakeSearch('none');
         setNotFound('none');
         setSearch_Result(values);
      //  console.log(values);
      });
      } 

    function ShowDetails(id) {
      console.log(id);
      navigation.navigate('MovieDetails',{id:id})
    }



  return (
    <View style={styles.container}>
       <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'}/>
    <View style={{backgroundColor:'#141414', width:'100%', height:80, marginBottom:0,marginTop:30, flexDirection:'row',borderWidth:0}}>
    <TextInput
             mode="flat"
             label=""
             placeholder='Search'
             name='Search'
             keyboardType='default'
             style={{fontSize:20, color:'#fff', backgroundColor:'#fff', width:'80%', margin:10}}
             textContentType='none'
             autoCapitalize='none'
             outlineColor="#fff"
             activeOutlineColor="#fff"
             activeUnderlineColor="#fff"
             underlineColor="#fff"
             selectionColor="#000"
             placeholderTextColor="#000"
             onChangeText={(val)=>setSearchQuery(val)}      
             />
    <MaterialCommunityIcons onPress={Search} name="magnify" style={{fontSize:40, paddingRight:10, color:'#fff', alignSelf:'center'}} />
    </View>


    <ActivityIndicator size='large' color="#e8e6e6"  animating={isLoading}
     style={{paddingRight:10,position:'absolute', alignSelf:'center', paddingTop:10, marginVertical:200}}/>
    <Text style={{marginLeft:5, color:'gray', fontWeight:'bold', fontSize:25,alignSelf:'center', display:makeSearch, marginVertical:200}}>Make Search</Text> 
    <Text style={{marginLeft:5, color:'gray', fontWeight:'bold', fontSize:25,alignSelf:'center', display:notFound,marginVertical:200}}>No Match Found</Text>
    <View>
    {/* <Text style={{marginLeft:5, color:'#fff', marginTop:10, fontWeight:'bold', fontSize:15}}>Latest</Text> */}
    <FlatList
      data={search_result}
      keyExtractor={(item, index) => index.toString()}
      inverted={false}
      numColumns={3}
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

    </View>
 
  );

  
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
          backgroundColor: '#141414',
        },

  });
