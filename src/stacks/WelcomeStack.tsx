import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from '../views/LandingPage';
import SignIn from '../views/SignIn';
import CreateAccount from '../views/CreateAccount';

const MainStack = createNativeStackNavigator();

const WelcomeStack = () => {
  const {Navigator, Screen} = MainStack;
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Screen name="LandingPage" component={LandingPage} />
        <Screen name="SignIn" component={SignIn} />
        <Screen name="CreateAccount" component={CreateAccount} />
      </Navigator>
    </NavigationContainer>
  );
};

export default WelcomeStack;
