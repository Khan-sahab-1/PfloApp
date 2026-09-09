// Routes.jsx
// jamshed start bug id 2555
// Description: This file defines the main routing structure for the application using React Navigation. It imports the authentication stack (AuthStack) and the main application stack (MainStack) and sets up the navigation container to manage the navigation flow between these stacks. The Routes component serves as the central point for defining how users navigate through the app, ensuring a seamless transition between authentication screens and the main application screens based on the user's authentication status.
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AuthStack from './AuthStack'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainStack from './MainStack'
import { fetchUserData } from '../redux/reducers/Userinforeducers'
import { useDispatch } from 'react-redux'
const Stack=createNativeStackNavigator()

const Routes = () => {

  const dispatch = useDispatch()
  
    // useEffect(() => {
    //   dispatch(fetchUserData());
    // }, []);
  
  return (
    < >
 

    {MainStack(Stack)}     

    </>


  )
}

export default Routes

const styles = StyleSheet.create({})
//bug id 2555 Jamshed end