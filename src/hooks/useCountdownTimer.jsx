import { useEffect, useState } from 'react';

function useCountdownTimer(createdTime, expireTime, onTimeout) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!createdTime || !expireTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((expireTime - now) / 1000);
      setTimeLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        clearInterval(timer);
        onTimeout?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdTime, expireTime, onTimeout]);

  return timeLeft;
}

export default useCountdownTimer;