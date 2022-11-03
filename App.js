// In App.js in a new project
import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, Button,Image, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle, } from '@react-navigation/stack';
import  Base from './src/Base';
import MovieDetails from './src/movieDetails';
import Download from './src/download';
import PlayVideo from './src/playVideo';
import Explore from './src/Explore';
import Search from './src/seaarch';
import More from './src/More';
import * as NavigationBar from 'expo-navigation-bar';

const Stack = createStackNavigator();

NavigationBar.setBackgroundColorAsync("#141414");

class App extends React.Component {
  render(){ 
  return (
    <NavigationContainer>
   <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'}/>
      <Stack.Navigator>
        <Stack.Screen name="Base" component={Base}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>

     <Stack.Screen name="MovieDetails" component={MovieDetails}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>

     <Stack.Screen name="Download" component={Download}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>

    <Stack.Screen name="PlayVideo" component={PlayVideo}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>

    <Stack.Screen name="Explore" component={Explore}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>  

      <Stack.Screen name="Search" component={Search}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>   

     <Stack.Screen name="More" component={More}  
        options={{ title: 'Proflex',
        headerShown: false,
        headerTitleStyle: {
        fontWeight: 'bold',       
        },
        }}/>   
     
     </Stack.Navigator>  
    </NavigationContainer>

  );

  
}

}
export default (App)

