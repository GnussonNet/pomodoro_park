import React from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ShowCounter from './ShowCounter';

const CountdownBg = {
  primary: 'bg-green-500 border-green-500',
  secondary: 'border-gray-600',
};

const CountdownColor = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
};

const Countdown = ({
  title,
  type,
  minutes,
  seconds,
  pomodoros,
  action,
}: {
  title: string;
  type: 'primary' | 'secondary';
  minutes: number;
  seconds: number;
  pomodoros: number;
  action: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  return (
    <>
      <ShowCounter minutes={minutes} seconds={seconds} pomodoros={pomodoros} />
      <TouchableOpacity className="mt-4" onPress={action}>
        <View
          className={`border-2 p-2 w-40 mx-auto rounded-md ${CountdownBg[type]}`}>
          <Text className={`text-center font-semibold ${CountdownColor[type]}`}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default Countdown;
