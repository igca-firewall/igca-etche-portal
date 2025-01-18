"use client"
import { useEffect, useState } from 'react';

function CountdownClock() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const now = new Date();
    const nextTwoMonths = now.getMonth() + 2;
    let nextYear = now.getFullYear();
    
    // Adjust nextYear if the next two months overflow into the next calendar year
    if (nextTwoMonths > 11) {
      nextYear++;
    }

    const nextTwoMonthsDate = new Date(nextYear, nextTwoMonths % 12, 1);
    const difference = nextTwoMonthsDate.getTime() - now.getTime();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
        days: Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }

    return timeLeft;
  }

  return (
    <div className="flex flex-1 h-screen">
      {/* Ensure full height */}
      <div className="common-container flex flex-col justify-center items-center h-full w-full">
        {/* Center content vertically and ensure full height and width */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Under Construction</h1>
          <p className="text-lg mt-4">
            Time left:
          </p>
          <div className="text-3xl font-bold mt-2">
           {/* @ts-ignore */}
            {timeLeft.months} months, {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountdownClock;
