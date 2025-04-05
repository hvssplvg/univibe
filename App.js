import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/LoginScreen';
import SignupScreen from './app/SignupScreen'; 
import ForgotPassword from './app/ForgotPassword';
import VerifyEmail from './app/VerifyEmail';
import TabLayout from './app/(tabs)/TabLayout';
import Toast from 'react-native-toast-message'; // ✅ Toast import
import UniMap from './app/MyAiSetup';
import SocialHub from './app/(tabs)/SocialHub';
import PartyRooms from './app/PartyRooms';
import MyAiSetup from './app/MyAiSetup';
import MyAiChat from './app/MyAiChat';
import RoomView from './app/RoomView';
import Society from './app/Society';
import EditProfile from './app/EditProfile';
import UserProfile from './app/(tabs)/UserProfile';
import FriendProfile from './app/FriendProfile';
import Settings from'./app/Settings';
import TermsPrivacyScreen from './app/TermsPrivacyScreen';





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
          <Stack.Screen name="Home" component={TabLayout} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="SocialHub" component={SocialHub} />
        
          <Stack.Screen name="PartyRooms" component={PartyRooms} />
          <Stack.Screen name="MyAiChat" component={MyAiChat} />
          <Stack.Screen name="MyAiSetup" component={MyAiSetup} />
          <Stack.Screen name="RoomView" component={RoomView} />
          <Stack.Screen name="Society" component={Society} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="FriendProfile" component={FriendProfile} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="TermsPrivacyScreen" component={TermsPrivacyScreen} />
          
          

        </Stack.Navigator>
      </NavigationContainer>
      
     
    </>
  );
}
