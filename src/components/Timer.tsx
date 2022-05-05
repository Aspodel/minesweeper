import React from "react";
import { formatTime } from "../utils";

type TimerProps = {
  initTime?: number;
};

const Timer = ({ initTime = Date.now() }: TimerProps) => {
  const [elapsedTime, setElapsedTime] = React.useState(initTime);
  React.useEffect(() => {
    let myInterval = setInterval(() => {
      setElapsedTime(Date.now() - initTime);
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div>
      <span style={{ fontSize: 24 }}>⏱</span> {formatTime(elapsedTime)}
    </div>
  );
};

export default React.memo(Timer);
