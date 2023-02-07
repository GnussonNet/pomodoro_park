import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import auth from '@react-native-firebase/auth';

const Home = () => {
  return (
    <View className="bg-white dark:bg-gray-900 px-8 py-4 h-full">
      <View className="mt-auto">
        <TouchableOpacity
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log('User signed out!'))
          }>
          <Text>Sign Out</Text>
        </TouchableOpacity>
        <CountdownTimer />
      </View>
    </View>
  );
};

export default Home;
