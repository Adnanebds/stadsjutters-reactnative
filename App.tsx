import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './Components/Login';
import RegistrationPage from './Components/Register';
import Welcome from './Components/Welcome';
import SpotAanmaken from './Components/SpotAanmaken';
import MapScreen from './Components/Map';
import ChatList from './Components/ChatList';
import ChatScreen from './Components/ChatScreen';
import UserSpots from './Components/Profile';

// Define the type for the root stack parameter list
export type RootStackParamList = {
  LoginPage: undefined;
  RegistrationPage: undefined;
  Welcome: undefined;
  SpotAanmaken: undefined;
  Explore: undefined;
  ChatList: undefined;
  ChatScreen: { chatId: string }; // Assuming ChatScreen needs a chatId
  Profile: { userId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SpotAanmaken" component={SpotAanmaken} />
        <Stack.Screen name="Explore" component={MapScreen} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Profile" component={UserSpots} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
