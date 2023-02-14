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
    // Store date to when cancel time should expire
    const currentDate = dayjs().add(10500, 'milliseconds');
    // Set cancellable to true if not set
    cancellable = cancellable ?? true;
    // Added delay same as intervall time
    date = dayjs(date).add(500, 'milliseconds');

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
    // Intervall with 0,5 second delay
    intervalId.current = setInterval(() => {
      // Calculate diff for both countdown and cancel time
      const currentTimeLeft = dayjs(date).diff(dayjs());
      const currentCancelTimeLeft = dayjs(currentDate).diff(dayjs());

      // If countdown is finished
      if (currentTimeLeft <= 0) {
        setStatus(TimerStatus.FINISHED);
        intervalId.current && clearInterval(intervalId.current);
      } else {
        setTimeLeft({
          minutes: dayjs(currentTimeLeft).get('minutes'),
          seconds: dayjs(currentTimeLeft).get('seconds'),
        });

        // Do not update cancel countdown unless not finished
        if (cancellable && currentCancelTimeLeft >= 0) {
          setTimeToCancel(dayjs(currentCancelTimeLeft).get('seconds'));
        }

        // Fixex a bug where the status is delayd 0,5 seconds
        const checkIfFinnished = currentTimeLeft - 500;
        if (checkIfFinnished <= 0) {
          setStatus(TimerStatus.FINISHED);
          intervalId.current && clearInterval(intervalId.current);
        }
      }
    }, 500);
  }, []);

  const startBreak = useCallback((date: Dayjs) => {
    // Store date to when cancel time should expire
    const currentDate = dayjs().add(10500, 'milliseconds');
    // Added delay same as intervall time
    date = dayjs(date).add(500, 'milliseconds');

    setStatus(TimerStatus.BREAK_RUNNING);
    setTimeLeft({
      minutes: dayjs(dayjs(date).diff(dayjs())).get('minutes'),
      seconds: dayjs(dayjs(date).diff(dayjs())).get('seconds'),
    });

    setTimeToCancel(10);

    // Intervall with 0,5 second delay
    intervalId.current = setInterval(() => {
      // Calculate diff for both countdown and cancel time
      const currentTimeLeft = dayjs(date).diff(dayjs());
      const currentCancelTimeLeft = dayjs(currentDate).diff(dayjs());

      // If countdown is finished
      if (currentTimeLeft <= 0) {
        setStatus(TimerStatus.BREAK_FINISHED);
        intervalId.current && clearInterval(intervalId.current);
      } else {
        setTimeLeft({
          minutes: dayjs(currentTimeLeft).get('minutes'),
          seconds: dayjs(currentTimeLeft).get('seconds'),
        });

        // Do not update cancel countdown unless not finished
        if (currentCancelTimeLeft >= 0) {
          setTimeToCancel(dayjs(currentCancelTimeLeft).get('seconds'));
        }

        // Fixex a bug where the status is delayd 0,5 seconds
        const checkIfFinnished = currentTimeLeft - 1000;
        if (checkIfFinnished <= 0) {
          setStatus(TimerStatus.BREAK_FINISHED);
          intervalId.current && clearInterval(intervalId.current);
        }
      }
    }, 500);
  }, []);

  const cancel = useCallback(() => {
    // Set status depending on countdown type
    if (status === 'break_running') {
      setStatus(TimerStatus.BREAK_CANCELLED);
    } else if (status === 'running') {
      setStatus(TimerStatus.CANCELLED);
    }

    // Reset states
    setTimeLeft({minutes: 0, seconds: 0});
    setTimeToCancel(0);
    intervalId.current && clearInterval(intervalId.current);
  }, [status]);

  const abandon = useCallback(() => {
    // Set status depending on countdown type
    if (status === 'break_running') {
      setStatus(TimerStatus.BREAK_ABANDONED);
    } else if (status === 'running') {
      setStatus(TimerStatus.ABANDONED);
    }

    // Reset states
    setTimeLeft({minutes: 0, seconds: 0});
    setTimeToCancel(0);
    intervalId.current && clearInterval(intervalId.current);
  }, [status]);

  // Clear if unmounteds
  useEffect(() => {
    return () => {
      intervalId.current && clearInterval(intervalId.current);
    };
  }, []);

  // Store data in a object
  const countdownData = {
    timeLeft,
    timeToCancel,
    status,
  };

  return [startCountdown, startBreak, cancel, abandon, countdownData];
};
export {useCountdown};
