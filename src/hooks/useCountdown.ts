import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';

const useCountdown = (targetDate: string) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeToCancel, setTimeToCancel] = useState(0);
  const intervalRef = useRef<number>();
  const intervalRef1 = useRef<number>();

  useEffect(() => {
    const updateCountdown = () => {
      if (!targetDate) {
        setMinutes(0);
        setSeconds(0);
        return
      }
      const countDown = dayjs(targetDate).diff(dayjs());
      setMinutes(dayjs(countDown).get("minutes"));
      setSeconds(dayjs(countDown).get("seconds"));
      if (countDown <= 0) {
        intervalRef.current && clearInterval(intervalRef.current);
        return;
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => { intervalRef.current && clearInterval(intervalRef.current) };
  }, [targetDate]);

  useEffect(() => {
    const updateCountdown = () => {
      if (!targetDate) {
        setTimeToCancel(0);
        return
      }
      const countDown = dayjs(targetDate).subtract(25, "minutes").add(10, "seconds").diff(dayjs());
      if (countDown <= 0) {
        intervalRef1.current && clearInterval(intervalRef1.current);
        return;
      }
      setTimeToCancel(dayjs(countDown).get("seconds"));
    };

    updateCountdown();
    intervalRef1.current = setInterval(updateCountdown, 1000);

    return () => { intervalRef1.current && clearInterval(intervalRef1.current) };
  }, [targetDate]);

  return [minutes, seconds, timeToCancel];
};

export { useCountdown };