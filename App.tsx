import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
   <Stack.Navigator initialRouteName="Login">
    <Stack.Screen  name="Login" component={Login} />
    <Stack.Screen  name="SignUp" component={SignUp} />

    
   </Stack.Navigator>
  )
}