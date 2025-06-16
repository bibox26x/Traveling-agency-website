import React, { useState, useEffect } from 'react';
import { format, differenceInSeconds } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  expiresAt: string | Date;
  isPaid?: boolean;
  onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt, isPaid = false, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isPaid) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = differenceInSeconds(expiry, now);
      return Math.max(0, diff);
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, isPaid, isExpired, onExpire]);

  if (isPaid) {
    return (
      <div className="text-green-600 font-medium">
        {t('countdown.paymentConfirmed')}
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-red-600 font-medium">
        {t('countdown.bookingExpired')}
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-600">
        {t('countdown.timeRemaining')}
      </div>
      <div className="text-lg font-semibold">
        {timeString}
      </div>
      <div className="text-sm text-red-600">
        {t('countdown.autoCancelWarning')}
      </div>
    </div>
  );
};

export default CountdownTimer; 