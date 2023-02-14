import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import useSound from 'react-native-use-sound';
import {UserData} from '../../app';
import {useCountdown} from '../hooks/useCountdown';
import Countdown from './Countdown';

// Default values
const DURATION = 25;

const CountdownTimer = () => {
  //
  // States
  //
  const [userData, setUserData] = useState<UserData>();

  //
  // Hooks
  //
  const [startCountdown, startBreak, cancel, abandon, countdownData] =
    useCountdown();
  const {timeToCancel, status, timeLeft} = countdownData;
  const {minutes, seconds} = timeLeft;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [play, pause, stop, data] = useSound('pomodoro_finished.wav');

  //
  // Constats
  //
  const todaysDate = dayjs().format('YYYY-MM-DD');
  const database = firebase
    .app()
    .database(
      'https://pomodoro-park-default-rtdb.europe-west1.firebasedatabase.app',
    )
    .ref(`/users/${auth().currentUser?.uid}`);

  //
  // App loads
  //
  useEffect(() => {
    database.on('value', snapshot => {
      setUserData(snapshot.val());
      const fetchedDate = snapshot.val() as UserData;
      if (!fetchedDate[todaysDate]) {
        database.child(todaysDate).set({pomodoros: 0});
      }
    });
    database.once('value', snapshot => {
      const fetchedStartTime = snapshot.val() as UserData;
      if (fetchedStartTime.startedAt) {
        startCountdown(dayjs(fetchedStartTime.startedAt), false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  // Status changed
  //
  useEffect(() => {
    if (status === 'abandoned') {
      database.child(todaysDate).set({pomodoros: 0});
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
      database
        .child(todaysDate)
        .set({pomodoros: userData && userData[todaysDate].pomodoros + 1});
      database.child('startedAt').set(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  //
  // Functions
  //
  const startCountdownTimer = () => {
    const startTime = dayjs().add(25, 'minutes');
    database.child('startedAt').set(startTime.toString());
    startCountdown(startTime);
  };

  const cancelCountdownTimer = () => {
    database.child('startedAt').set(null);
    cancel();
  };

  const abandonCountdownTimer = () => {
    database.child('startedAt').set(null);
    abandon();
  };

  return userData ? (
    userData[todaysDate] && (
      <View>
        {(status === 'running' && timeToCancel <= 0) ||
        (status === 'break_running' && timeToCancel <= 0) ? (
          <Countdown
            title="Abandon Plant"
            type="secondary"
            minutes={minutes}
            seconds={seconds}
            pomodoros={userData[todaysDate].pomodoros}
            action={() =>
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
            }
          />
        ) : (status === 'running' && timeToCancel >= 1) ||
          (status === 'break_running' && timeToCancel >= 1) ? (
          <Countdown
            title={`Cancel (${timeToCancel})`}
            type="secondary"
            minutes={minutes}
            seconds={seconds}
            pomodoros={userData[todaysDate].pomodoros}
            action={() => cancelCountdownTimer()}
          />
        ) : status === 'finished' || status === 'break_cancelled' ? (
          <Countdown
            title="Start Break"
            type="primary"
            minutes={userData[todaysDate].pomodoros % 4 === 0 ? 25 : 5}
            seconds={0}
            pomodoros={userData[todaysDate].pomodoros}
            action={() =>
              startBreak(
                dayjs().add(
                  userData[todaysDate].pomodoros % 4 === 0 ? 25 : 5,
                  'minutes',
                ),
              )
            }
          />
        ) : (
          <Countdown
            title="Plant Seed"
            type="primary"
            minutes={DURATION}
            seconds={0}
            pomodoros={userData[todaysDate].pomodoros}
            action={startCountdownTimer}
          />
        )}
      </View>
    )
  ) : (
    <></>
  );
};

export default CountdownTimer;
