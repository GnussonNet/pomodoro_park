import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SignIn from './views/SignIn';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './views/LandingPage';
import Home from './views/Home';

const MainStack = createNativeStackNavigator();

function App(): JSX.Element {
  const { Navigator, Screen } = MainStack;

  return (
    <SafeAreaView className="bg-white dark:bg-gray-900 h-full">
      <StatusBar animated={true} />
      <NavigationContainer>
        <Navigator screenOptions={{
          headerShown: false
        }}>
          <Screen name="LandingPage" component={LandingPage} />
          <Screen name="SignIn" component={SignIn} />
          <Screen name="Home" component={Home} />
        </Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
