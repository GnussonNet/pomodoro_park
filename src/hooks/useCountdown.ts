import { useEffect, useState, useRef } from 'react';

const useCountdown = (targetDate: Date) => {
  const countDownDate = new Date(targetDate).getTime();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateCountdown = () => {
      const countDown = countDownDate - new Date().getTime();
      setMinutes(Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((countDown % (1000 * 60)) / 1000));
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => { intervalRef.current && clearInterval(intervalRef.current) };
  }, [countDownDate]);

  return [minutes, seconds];
};

export { useCountdown };