import dayjs, {Dayjs} from 'dayjs';
import {useCallback, useEffect, useRef, useState} from 'react';

enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
  ABANDONED = 'abandoned',
}

interface ITimeLeft {
  minutes: number;
  seconds: number;
}

const useCountdown = (): [
  ITimeLeft,
  number,
  string,
  (date: Dayjs) => void,
  () => void,
  () => void,
] => {
  const [timeLeft, setTimeLeft] = useState<ITimeLeft>({
    minutes: 0,
    seconds: 0,
  });
  const [timeToCancel, setTimeToCancel] = useState<number>(10);
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const intervalId = useRef<number | undefined>(undefined);

  const start = useCallback((date: Dayjs) => {
    setStatus(TimerStatus.RUNNING);
    setTimeLeft({
      minutes: dayjs(dayjs(date).diff(dayjs())).get('minutes'),
      seconds: dayjs(dayjs(date).diff(dayjs())).get('seconds'),
    });
    setTimeToCancel(10);
    let count = 0;
    intervalId.current = setInterval(() => {
      count++;
      const currentTimeLeft = dayjs(date).diff(dayjs());
      if (currentTimeLeft <= 0) {
        setStatus(TimerStatus.FINISHED);
        intervalId.current && clearInterval(intervalId.current);
      } else {
        setTimeLeft({
          minutes: dayjs(currentTimeLeft).get('minutes'),
          seconds: dayjs(currentTimeLeft).get('seconds'),
        });
        if (count <= 10) {
          setTimeToCancel(10 - count);
        }
        const checkIfFinnished = currentTimeLeft - 1000;
        if (checkIfFinnished <= 0) {
          setStatus(TimerStatus.FINISHED);
          intervalId.current && clearInterval(intervalId.current);
        }
      }
    }, 1000);
  }, []);
  const cancel = useCallback(() => {
    setStatus(TimerStatus.CANCELLED);
    setTimeLeft({minutes: 0, seconds: 0});
    setTimeToCancel(0);
    intervalId.current && clearInterval(intervalId.current);
  }, []);

  const abandon = useCallback(() => {
    setStatus(TimerStatus.ABANDONED);
    setTimeLeft({minutes: 0, seconds: 0});
    setTimeToCancel(0);
    intervalId.current && clearInterval(intervalId.current);
  }, []);

  useEffect(() => {
    return () => {
      intervalId.current && clearInterval(intervalId.current);
    };
  }, []);

  return [timeLeft, timeToCancel, status, start, cancel, abandon];
};
export {useCountdown};
