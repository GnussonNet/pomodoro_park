import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import CountdownTimer from "../components/CountdownTimer";
import dayjs from 'dayjs'
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const Home = () => {
  const { getItem, setItem } = useAsyncStorage('@pomodoro_park_data');

  const readItemFromStorage = async () => {
    const item = await getItem();
  };

  const writeItemToStorage = async (newValue: string) => {
    await setItem(newValue);
  };

  useEffect(() => {
    readItemFromStorage();
  }, []);

  return (
    <View className='bg-white dark:bg-gray-900 px-8 py-4 h-full'>
      <View className='mt-auto'>
        <CountdownTimer targetDate={dayjs().add(25, 'minutes').add(1, "second").toDate()} />
      </View>
    </View >
  )
}

export default Home