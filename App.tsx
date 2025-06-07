import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';

const Stack = createNativeStackNavigator();
export default function App() {


  
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
    <NavigationContainer>
  
<AppNavigator/>
    
   </NavigationContainer></PersistGate></Provider>
  )
}


const AppNavigator = () => {
  const { token, user } = useSelector(state => state.user);

  return (
    <Stack.Navigator
      initialRouteName={token && user ? "Dashboard" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Dashboard" component={Dashboard}   />
    </Stack.Navigator>
  );
};
