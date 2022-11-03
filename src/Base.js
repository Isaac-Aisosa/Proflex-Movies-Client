import * as React from 'react';
import { View, Text, Button, StatusBar } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Feed from './FeedIndex'
import FeedBack from './feedback'
import Explore from './Explore'
import SavedVideo from './SavedVideos';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    
    <Tab.Navigator
    initialRouteName="Feed"
    screenOptions={{
      tabBarLabelStyle: { fontSize: 10, color:'#fff', fontWeight:'300' },
      tabBarStyle: { backgroundColor: '#141414', borderWidth:0 },
      tabBarActiveTintColor:'#e8e6e6',
    }}>
   
    
      
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          headerShown: false,
          tabBarLabel: 'Proflex',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={25} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          headerShown: false,
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass" color={color} size={25} />
          ),
        }}
      />


      <Tab.Screen
        name="SavedVideo"
        component={SavedVideo}
        options={{
          headerShown:false,
          tabBarLabel: 'Saved Videos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-star-outline" color={color} size={25} />
          ),
        }}
      />

     <Tab.Screen
        name="FeedBack"
        component={FeedBack}
        options={{
          headerShown: false,
          tabBarLabel: 'Feedback',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal-circle" color={color} size={25} />
          ),
        }}
      />  
    </Tab.Navigator>


  );
}