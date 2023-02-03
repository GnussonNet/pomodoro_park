import React, { useEffect, useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const ShowCounter = ({ minutes, seconds }: {
  minutes: number,
  seconds: number,
}) => {
  return (
    <View>
      <View className='flex flex-row ml-auto mr-auto bg-gray-800 rounded-full py-2 px-4 items-center'>
        <Text className='text-gray-200 font-semibold mr-2'>Pomodoros</Text>
        <View className='w-3 h-3 bg-gray-700 rounded-full mr-1'></View>
        <View className='w-3 h-3 bg-gray-700 rounded-full mr-1'></View>
        <View className='w-3 h-3 bg-gray-700 rounded-full mr-1'></View>
        <View className='w-3 h-3 bg-gray-700 rounded-full'></View>
      </View>
      <View className='flex flex-row justify-center gap-2 mt-2'>
        <Text className='text-white text-8xl font-extralight text-right w-28'>{minutes.toString().padStart(2, '0')}</Text>
        <Text className='text-white text-8xl font-extralight bottom-2'>:</Text>
        <Text className='text-white text-8xl font-extralight text-left w-28'>{seconds.toString().padStart(2, '0')}</Text>
      </View>
    </View>
  );
};

const CountdownTimer = () => {
  const { getItem, setItem } = useAsyncStorage('@pomodoro_park_data');
  const [targetDate, setTargetDate] = useState<string>("");
  const [minutes, seconds, timeToCancel] = useCountdown(targetDate);

  const readItemFromStorage = async () => {
    const item = await getItem();
    if (item)
      setTargetDate(item);
  };

  const writeItemToStorage = async (newValue: string) => {
    await setItem(newValue);
    setTargetDate(newValue)
  };

  useEffect(() => {
    readItemFromStorage();
  }, []);

  return (
    <View>
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
      />
      {minutes + seconds <= 0 ? (

        <TouchableOpacity
          className="mt-12"
          onPress={() => writeItemToStorage(dayjs().add(25, 'minutes').add(1, "second").toString())}
        >
          <View className="bg-green-500 p-3 rounded-md hover:bg-slate-300 active:bg-slate-500">
            <Text className="text-center font-semibold text-gray-900">
              Plant Seed
            </Text>
          </View>
        </TouchableOpacity>
      ) : timeToCancel >= 1 ? (
        <TouchableOpacity
        className="mt-12"
        onPress={() => writeItemToStorage("")}
      >
        <View className="bg-gray-500 p-3 rounded-md">
          <Text className="text-center font-semibold text-gray-900">
            Cancel ({timeToCancel})
          </Text>
        </View>
      </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="mt-12"
          onPress={() => writeItemToStorage("")}
        >
          <View className="bg-red-500 p-3 rounded-md">
            <Text className="text-center font-semibold text-gray-900">
              Abandon Plant
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
};

export default CountdownTimer;