import React, { useState, useEffect } from 'react';

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ days: initialDays, hours: initialHours, minutes: initialMinutes, seconds: initialSeconds }) => {
  const [days, setDays] = useState<number>(initialDays);
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      } else if (days > 0) {
        setDays(days - 1);
        setHours(23);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [days, hours, minutes, seconds]);
  
  return (
    <div className="flex space-x-4">
  <div className="flex flex-col items-center">
    <div className="bg-white text-black rounded-full w-20 h-20 flex items-center justify-center">
      <span className="text-xl font-bold">{days.toString().padStart(2, '0')}</span>
    </div>
    <span className="text-xs mt-2 text-white">Days</span>
  </div>
  <div className="flex flex-col items-center">
    <div className="bg-white text-black rounded-full w-20 h-20 flex items-center justify-center">
      <span className="text-xl font-bold">{hours.toString().padStart(2, '0')}</span>
    </div>
    <span className="text-xs mt-2 text-white">Hours</span>
  </div>
  <div className="flex flex-col items-center">
    <div className="bg-white text-black rounded-full w-20 h-20 flex items-center justify-center">
      <span className="text-xl font-bold">{minutes.toString().padStart(2, '0')}</span>
    </div>
    <span className="text-xs mt-2 text-white">Minutes</span>
  </div>
  <div className="flex flex-col items-center">
    <div className="bg-white text-black rounded-full w-20 h-20 flex items-center justify-center">
      <span className="text-xl font-bold">{seconds.toString().padStart(2, '0')}</span>
    </div>
    <span className="text-xs mt-2 text-white">Seconds</span>
  </div>
</div>

  );
};

export default Countdown;