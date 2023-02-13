import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import useSound from 'react-native-use-sound';
import {UserData} from '../../app';
import {useCountdown} from '../hooks/useCountdown';
import ShowCounter from './ShowCounter';

const CountdownTimer = () => {
  const [duration] = useState<number>(25);
  const [userData, setUserData] = useState<UserData>();

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
    reference.once('value', snapshot => {
      const fetchedStartTime = snapshot.val() as UserData;
      if (fetchedStartTime.startedAt) {
        startCountdown(dayjs(fetchedStartTime.startedAt), false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [play, pause, stop, data] = useSound('pomodoro_finished.wav');
  const [startCountdown, startBreak, cancel, abandon, countdownData] =
    useCountdown();
  const {timeToCancel, status, timeLeft} = countdownData;
  const {minutes, seconds} = timeLeft;

  useEffect(() => {
    if (status === 'abandoned') {
      reference.child(todaysDate).set({pomodoros: 0});
    }
    if (status === 'finished' || status === 'break_finished') {
      if (data.isPlaying) {
        stop();
        play();
      } else {
        play();
      }
    }
    if (status === 'finished') {
      reference
        .child(todaysDate)
        .set({pomodoros: userData && userData[todaysDate].pomodoros + 1});
      reference.child('startedAt').set(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const startCountdownTimer = () => {
    const startTime = dayjs().add(0, 'minutes').add(21, 'second');
    reference.child('startedAt').set(startTime.toString());
    startCountdown(startTime);
  };

  const cancelCountdownTimer = () => {
    reference.child('startedAt').set(null);
    cancel();
  };

  const abandonCountdownTimer = () => {
    reference.child('startedAt').set(null);
    abandon();
  };

  return (
    userData &&
    userData[todaysDate] && (
      <View>
        {(status === 'running' && timeToCancel <= 0) ||
        (status === 'break_running' && timeToCancel <= 0) ? (
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
                      onPress: () => abandonCountdownTimer(),
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
        ) : (status === 'running' && timeToCancel >= 1) ||
          (status === 'break_running' && timeToCancel >= 1) ? (
          <>
            <ShowCounter
              minutes={minutes}
              seconds={seconds}
              pomodoros={userData[todaysDate].pomodoros}
            />
            <TouchableOpacity
              className="mt-4"
              onPress={() => cancelCountdownTimer()}>
              <View className="border-2 border-gray-600 p-2 w-40 mx-auto rounded-md">
                <Text className="text-center font-semibold text-gray-600">
                  Cancel ({timeToCancel})
                </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : status === 'finished' || status === 'break_cancelled' ? (
          <>
            <ShowCounter
              minutes={userData[todaysDate].pomodoros % 4 === 0 ? 25 : 5}
              seconds={0}
              pomodoros={userData[todaysDate].pomodoros}
            />
            <TouchableOpacity
              className="mt-4"
              onPress={() =>
                startBreak(
                  dayjs()
                    .add(
                      userData[todaysDate].pomodoros % 4 === 0 ? 25 : 5,
                      'minutes',
                    )
                    .add(1, 'second'),
                )
              }>
              <View className="bg-green-500 border-2 border-green-500 p-2 w-40 mx-auto rounded-md">
                <Text className="text-center font-semibold text-gray-900">
                  Start Break
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
              onPress={() => startCountdownTimer()}>
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
