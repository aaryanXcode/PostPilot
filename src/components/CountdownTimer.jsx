import { useState, useEffect } from 'react';

const CountdownTimer = ({ scheduledDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!scheduledDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const scheduled = new Date(scheduledDate).getTime();
      const difference = scheduled - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [scheduledDate]);

  if (!scheduledDate) {
    return <span className="text-gray-500">-</span>;
  }

  const now = new Date().getTime();
  const scheduled = new Date(scheduledDate).getTime();
  const isOverdue = scheduled < now;

  if (isOverdue) {
    return (
      <span className="text-red-500 font-medium">
        Overdue
      </span>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  // If more than 1 day, show days and hours
  if (days > 0) {
    return (
      <div className="text-sm">
        <div className="font-medium text-blue-600">
          {days}d {hours}h
        </div>
        <div className="text-gray-500 text-xs">
          {minutes}m {seconds}s
        </div>
      </div>
    );
  }

  // If less than 1 day, show hours, minutes, seconds
  if (hours > 0) {
    return (
      <div className="text-sm">
        <div className="font-medium text-green-600">
          {hours}h {minutes}m
        </div>
        <div className="text-gray-500 text-xs">
          {seconds}s
        </div>
      </div>
    );
  }

  // If less than 1 hour, show minutes and seconds
  if (minutes > 0) {
    return (
      <div className="text-sm">
        <div className="font-medium text-orange-600">
          {minutes}m {seconds}s
        </div>
      </div>
    );
  }

  // If less than 1 minute, show only seconds
  return (
    <div className="text-sm">
      <div className="font-medium text-red-600 animate-pulse">
        {seconds}s
      </div>
    </div>
  );
};

export default CountdownTimer;
