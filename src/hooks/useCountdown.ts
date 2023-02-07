import dayjs from 'dayjs';
import {useEffect, useState, useRef, Dispatch, SetStateAction} from 'react';
import useSound from 'react-native-use-sound';

interface IRemaining {
  minutes: number;
  seconds: number;
}

const useCountdown = (
  targetDate: string,
  setTargetDate: Dispatch<SetStateAction<string>>,
  duration: number,
) => {
  const [remaining, setRemaining] = useState<IRemaining>({
    minutes: 0,
    seconds: 0,
  });
  const [timeToCancel, setTimeToCancel] = useState(0);
  const countdownRef = useRef<number>();
  const [finished, setFinished] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [play, pause, stop, data] = useSound('pomodoro_finished.wav');

  useEffect(() => {
    // This is fired when canceld or abondoned
    if (!targetDate) {
      countdownRef.current && clearInterval(countdownRef.current);
      setFinished(true);
      setTargetDate('');
      setRemaining({minutes: 0, seconds: 0});
      return;
    }

    // Updated every seconds using interval
    const updateCountdown = async () => {
      // Calculate diff in date from start to now
      const countdown = dayjs(targetDate).diff(dayjs());
      const cancelCountdown = dayjs(targetDate)
        .subtract(duration, 'minutes')
        .add(10, 'seconds')
        .diff(dayjs());

      // If countdown finnished, clear intervall
      if (countdown < 0) {
        if (data.isPlaying) {
          stop();
          play();
        } else {
          play();
        }
        countdownRef.current && clearInterval(countdownRef.current);
        return;
      }
      // Do not update when finished
      if (cancelCountdown > 0) {
        setTimeToCancel(dayjs(cancelCountdown).get('seconds'));
      }

      // Update remaining time
      setRemaining({
        minutes: dayjs(countdown).get('minutes'),
        seconds: dayjs(countdown).get('seconds'),
      });
    };

    // Call function and start interval
    updateCountdown();
    countdownRef.current = setInterval(updateCountdown, 1000);

    // Clear interval when unloaded
    return () => {
      countdownRef.current && clearInterval(countdownRef.current);
    };
  }, [data.isPlaying, duration, play, setTargetDate, stop, targetDate]);

  // Return remaining time and cancel time
  return {remaining, timeToCancel, finished};
};

export {useCountdown};
