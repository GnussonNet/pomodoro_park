import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import auth from '@react-native-firebase/auth';
import {LogOut} from 'lucide-react-native';

const Home = () => {
  return (
    <View className="bg-white dark:bg-gray-900 px-8 py-4 h-full">
      <TouchableOpacity
        className="flex flex-row gap-2 absolute top-4 right-8"
        onPress={() =>
          auth()
            .signOut()
            .then(() => console.log('User signed out!'))
        }>
        <LogOut className="text-white" />
      </TouchableOpacity>
      <View className="mt-auto">
        <CountdownTimer />
      </View>
    </View>
  );
};

export default Home;
