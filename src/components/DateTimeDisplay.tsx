import React from 'react';
import { Text, View } from 'react-native';

const DateTimeDisplay = ({ value, type }: { value: number, type: string }) => {
  return (
    <View className='flex items-center'>
      <Text className='text-white text-lg'>
        {value}
      </Text>
      <Text className='text-white text-lg'>
        {type}
      </Text>
    </View>
  );
};

export default DateTimeDisplay;
