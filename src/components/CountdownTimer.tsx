import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {UserData} from '../../app';
import {useCountdown} from '../hooks/useCountdown';

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

const CountdownTimer = () => {
  const [duration] = useState<number>(25);
  const [userData, setUserData] = useState<UserData>({});

  const todaysDate = dayjs().add(0, 'day').format('YYYY-MM-DD');

  const user = auth().currentUser;
  const reference = firebase
    .app()
    .database(
      'https://pomodoro-park-default-rtdb.europe-west1.firebasedatabase.app',
    )
    .ref(`/users/${user?.uid}`);

  useEffect(() => {
    reference.on('value', snapshot => {
      setUserData(snapshot.val());
      const fetchedDate = snapshot.val() as UserData;
      if (!fetchedDate[todaysDate]) {
        reference.child(todaysDate).set({pomodoros: 0});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [timeLeft, timeToCancel, status, start, cancel, abandon] =
    useCountdown();
  const {minutes, seconds} = timeLeft;

  useEffect(() => {
    if (status === 'abandoned') {
      reference.child(todaysDate).set({pomodoros: 0});
    }
    if (status === 'finished') {
      reference
        .child(todaysDate)
        .set({pomodoros: userData[todaysDate].pomodoros + 1});
    }
  }, [reference, status, todaysDate, userData]);

  return (
    userData[todaysDate] && (
      <View>
        {status === 'running' && timeToCancel <= 0 ? (
          <>
            <ShowCounter
              minutes={minutes}
              seconds={seconds}
              pomodoros={userData[todaysDate].pomodoros}
            />
            <TouchableOpacity
              className="mt-4"
              onPress={() =>
                Alert.alert(
                  'Abandon Plant',
                  'Are you sure you want to abandon your plant?',
                  [
                    {
                      text: 'Close',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Abondon Plant',
                      onPress: () => abandon(),
                      style: 'destructive',
                    },
                  ],
                )
              }>
              <View className="border-2 border-gray-600 p-2 w-40 mx-auto rounded-md">
                <Text className="text-center font-semibold text-gray-600">
                  Abandon Plant
                </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : status === 'running' && timeToCancel >= 1 ? (
          <>
            <ShowCounter
              minutes={minutes}
              seconds={seconds}
              pomodoros={userData[todaysDate].pomodoros}
            />
            <TouchableOpacity className="mt-4" onPress={() => cancel()}>
              <View className="border-2 border-gray-600 p-2 w-40 mx-auto rounded-md">
                <Text className="text-center font-semibold text-gray-600">
                  Cancel ({timeToCancel})
                </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ShowCounter
              minutes={duration}
              seconds={0}
              pomodoros={userData[todaysDate].pomodoros}
            />
            <TouchableOpacity
              className="mt-4"
              onPress={() =>
                start(dayjs().add(duration, 'minutes').add(1, 'second'))
              }>
              <View className="bg-green-500 border-2 border-green-500 p-2 w-40 mx-auto rounded-md">
                <Text className="text-center font-semibold text-gray-900">
                  Plant Seed
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    )
  );
};

export default CountdownTimer;
