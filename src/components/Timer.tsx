import React from "react";
import { formatTime } from "../utils";

type TimerProps = {
  initTime?: number;
};

const Timer = ({ initTime = 1650875864405 }: TimerProps) => {
  const [elapsedTime, setElapsedTime] = React.useState(0);

  //   const calculateTimeDifference = () => {
  //     let now = new Date().getTime();
  //     const difference = now - initTime;
  //     console.log(difference);
  //     return difference;
  //   };

  //   //   React.useEffect(() => {
  //   //     setTimeout(() => {
  //   //       setElapsedTime(calculateTimeDifference());
  //   //     }, 1000);
  //   //   });

  //   React.useEffect(() => {
  //     let myInterval = setInterval(() => {
  //       setElapsedTime(el);
  //     }, 1000);
  //     return () => {
  //       clearInterval(myInterval);
  //     };
  //   });

  //   return <div>{formatTime(elapsedTime)}</div>;
  const [minutes, setMinutes] = React.useState(1);
  const [seconds, setSeconds] = React.useState(5);
  React.useEffect(() => {
    let myInterval = setInterval(() => {
      //   if (seconds > 0) {
      //     setSeconds(seconds + 1);
      //   }
      //   if (seconds === 0) {
      //     if (minutes === 0) {
      //       clearInterval(myInterval);
      //     } else {
      //       setMinutes(minutes + 1);
      //       setSeconds(59);
      //     }
      //   }

      setElapsedTime(new Date().getTime() - initTime);
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return <div>{formatTime(elapsedTime)}</div>;
};

export default Timer;
