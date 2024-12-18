import cx from 'classnames';
import React, { useEffect, useState } from 'react';

import styles from './countdown-timer.module.scss';
import toast from 'react-hot-toast';

interface ICountdownTimerProps {
  targetTime: string;
  onEnd: () => void;
}

const CountdownTimer: React.FC<ICountdownTimerProps> = ({
  targetTime,
  onEnd,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const fetchTimeServerTime = async () => {
      try {
        const response = await fetch(
          'https://worldtimeapi.org/api/timezone/Asia/Kolkata',
        );
        const data = await response.json();
        return new Date(data.datetime).getTime();
      } catch (error) {
        toast.error('Error fetching the time server time');
        return null;
      }
    };

    const updateTimer = async () => {
      const serverTime = await fetchTimeServerTime();
      if (!serverTime) return;

      // Check for the reloaded query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const reloaded = urlParams.get('reloaded');
      const closed = urlParams.get('closed');

      if (reloaded === 'true') {
        // Remove the reloaded parameter
        urlParams.delete('reloaded');
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}?${urlParams}`,
        );
        // Avoid setting up the timer if the page was reloaded by the timer
        return;
      }

      const targetDate = new Date(targetTime).getTime();
      const duration = targetDate - serverTime;

      if (duration <= 0) {
        setTimeLeft('00:00:00:00');
        if (closed === 'true') {
          return;
        }
        onEnd();
        return;
      }

      const days = Math.floor(duration / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, '0');
      const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, '0');
      const minutes = Math.floor((duration / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0');
      const seconds = Math.floor((duration / 1000) % 60)
        .toString()
        .padStart(2, '0');

      setTimeLeft(`${days}:${hours}:${minutes}:${seconds}`);
    };

    const timerID = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, [targetTime, onEnd]);

  return (
    <div className={cx(styles['d-container'])}>
      <div
        className={cx(styles['d-container__timer'], {
          [cx(styles['d-container__blink'])]: timeLeft === '00:00:00:00',
        })}
      >
        {timeLeft.split(':').map((segment, index, array) => (
          <div key={index}>
            <span>{segment}</span>
            {index < array.length - 1 && <span> : </span>}
          </div>
        ))}
      </div>
      <div className={styles['d-container__labels']}>
        <span>Days</span>
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
