import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Text, TouchableOpacity, View } from 'react-native';

const ExpiredNotice = () => {
  return (
    <View className='flex items-center'>
      <Text className='text-white text-xl font-bold'>Time expired!</Text>
      <Text className='text-white text-lg'>Please select a future date and time.</Text>
    </View>
  );
};

const ShowCounter = ({ minutes, seconds }: {
  minutes: number,
  seconds: number,
}) => {
  return (
    <View>
      <View className='flex flex-row justify-center gap-2'>
        <Text className='text-white text-7xl font-extralight text-right w-24'>{minutes.toString().padStart(2, '0')}</Text>
        <Text className='text-white text-7xl font-extralight bottom-2'>:</Text>
        <Text className='text-white text-7xl font-extralight text-left w-24'>{seconds.toString().padStart(2, '0')}</Text>
      </View>
      <TouchableOpacity
        className="mt-8"
      >
        <View className="bg-green-500 p-3 rounded-md">
          <Text className="text-center font-semibold text-gray-900">
            Give Up
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [minutes, seconds] = useCountdown(targetDate);

  if (minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;