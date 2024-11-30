import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './Components/Login';
import RegistrationPage from './Components/Register'; // Create this component
import Welcome from './Components/Welcome';
import SpotAanmaken from './Components/SpotAanmaken';
import MapScreen from './Components/Map';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SpotAanmaken" component={SpotAanmaken} />
        <Stack.Screen name="Explore" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}