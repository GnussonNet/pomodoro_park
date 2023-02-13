import dayjs, {Dayjs} from 'dayjs';
import {useCallback, useEffect, useRef, useState} from 'react';

enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
  ABANDONED = 'abandoned',
  BREAK_RUNNING = 'break_running',
  BREAK_CANCELLED = 'break_cancelled',
  BREAK_FINISHED = 'break_finished',
  BREAK_ABANDONED = 'break_abandoned',
}

interface ITimeLeft {
  minutes: number;
  seconds: number;
}

interface ICountdownData {
  timeLeft: ITimeLeft;
  timeToCancel: number;
  status: string;
}

const useCountdown = (): [
  (date: Dayjs, cancellable?: boolean) => void,
  (date: Dayjs) => void,
  () => void,
  () => void,
  ICountdownData,
] => {
  const [timeLeft, setTimeLeft] = useState<ITimeLeft>({
    minutes: 0,
    seconds: 0,
  });
  const [timeToCancel, setTimeToCancel] = useState<number>(10);
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const intervalId = useRef<number | undefined>(undefined);

  const startCountdown = useCallback((date: Dayjs, cancellable?: boolean) => {
    cancellable = cancellable ?? true;
    setStatus(TimerStatus.RUNNING);
    setTimeLeft({
      minutes: dayjs(dayjs(date).diff(dayjs())).get('minutes'),
      seconds: dayjs(dayjs(date).diff(dayjs())).get('seconds'),
    });
    if (cancellable) {
      setTimeToCancel(10);
    } else {
      setTimeToCancel(0);
    }
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
        if (count <= 10 && cancellable) {
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
  const startBreak = useCallback((date: Dayjs) => {
    setStatus(TimerStatus.BREAK_RUNNING);
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
        setStatus(TimerStatus.BREAK_FINISHED);
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
          setStatus(TimerStatus.BREAK_FINISHED);
          intervalId.current && clearInterval(intervalId.current);
        }
      }
    }, 1000);
  }, []);

  const cancel = useCallback(() => {
    if (status === 'break_running') {
      setStatus(TimerStatus.BREAK_CANCELLED);
    } else if (status === 'running') {
      setStatus(TimerStatus.CANCELLED);
    }
    setTimeLeft({minutes: 0, seconds: 0});
    setTimeToCancel(0);
    intervalId.current && clearInterval(intervalId.current);
  }, [status]);

  const abandon = useCallback(() => {
    if (status === 'break_running') {
      setStatus(TimerStatus.BREAK_ABANDONED);
    } else if (status === 'running') {
      setStatus(TimerStatus.ABANDONED);
    }
    setTimeLeft({minutes: 0, seconds: 0});
    setTimeToCancel(0);
    intervalId.current && clearInterval(intervalId.current);
  }, [status]);

  useEffect(() => {
    return () => {
      intervalId.current && clearInterval(intervalId.current);
    };
  }, []);

  const countdownData = {
    timeLeft,
    timeToCancel,
    status,
  };

  return [startCountdown, startBreak, cancel, abandon, countdownData];
};
export {useCountdown};
