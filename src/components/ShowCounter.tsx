import React from 'react';
import {Text, View} from 'react-native';

const ShowCounter = ({
  minutes,
  seconds,
  pomodoros,
}: {
  minutes: number;
  seconds: number;
  pomodoros: number;
}) => {
  const dotCount = ((pomodoros - 1) % 4) + 1;
  const inverseDotCount = 4 - dotCount;
  return (
    <View>
      <View className="flex flex-row ml-auto mr-auto bg-gray-800 rounded-full py-2 px-4 items-center">
        <Text className="text-gray-200 font-semibold mr-2">Pomodoros</Text>
        {Array.from({length: dotCount}, (_: number, index: number) => (
          <View
            key={index}
            className={`w-3 h-3 bg-green-700 rounded-full ${
              (index + 1) % 4 === 0 ? 'mr-0' : 'mr-1'
            }`}
          />
        ))}
        {Array.from({length: inverseDotCount}, (_: number, index: number) => (
          <View
            key={index}
            className={`w-3 h-3 bg-gray-700 rounded-full ${
              index === inverseDotCount - 1 ? 'mr-0' : 'mr-1'
            }`}
          />
        ))}
      </View>
      <View className="flex flex-row justify-center gap-2 mt-2">
        <Text className="text-white text-8xl font-extralight text-right w-28">
          {minutes.toString().padStart(2, '0')}
        </Text>
        <Text className="text-white text-8xl font-extralight bottom-2">:</Text>
        <Text className="text-white text-8xl font-extralight text-left w-28">
          {seconds.toString().padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};

export default ShowCounter;
