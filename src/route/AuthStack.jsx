// AuthStack.jsx
//bug id 2822 Jamshed start
// Description: Created an authentication stack navigator using React Navigation's createNativeStackNavigator. This stack includes screens for login, signup, and a home screen that serves as the main entry point after successful authentication. The stack is designed to manage the flow of authentication-related screens, allowing users to navigate between them seamlessly while maintaining a clean and organized navigation structure.
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import navigationString from './navigationString';
import Tabroutes from './Tabroutes';


const AuthStack = (Stack) => {

     
  return (
   <>

<Text>hi</Text>
{/* <Stack.Screen name={navigationString.HOMESCREEN} 
        component={Tabroutes}
        options={{headerShown:false}} 
        /> */}
        {/* <Stack.Screen name={navigationString.LOGIN} 
        component={Screens.Login}
        options={{headerShown:false}} 
        />
         <Stack.Screen name={navigationString.SIGNUP} 
        component={Screens.SignUp}
        options={{headerShown:false}} 
        />
         <Stack.Screen name={navigationString.SIGNUPFORM} 
        component={Screens.SignUpForm}
        options={{headerShown:false}} 
        /> */}
   </>

  )
}

export default AuthStack

const styles = StyleSheet.create({})