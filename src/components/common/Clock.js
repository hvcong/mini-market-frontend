import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function getTime() {
  let date = new Date();

  const hh = `0${date.getHours()}`.slice(-2);
  const mm = `0${date.getMinutes()}`.slice(-2);
  const ss = `0${date.getSeconds()}`.slice(-2);

  const DD = `0${date.getDate()}`.slice(-2);
  const MM = `0${date.getMonth() + 1}`.slice(-2);
  const YY = `${date.getFullYear()}`;

  return {
    time: `${hh}:${mm}:${ss}`,
    date: ` ${DD}/${MM}/${YY}`,
  };
}

const Clock = () => {
  const [timeString, setTimeString] = useState({});

  useEffect(() => {
    let id = setInterval(() => {
      setTimeString(getTime());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="clock_container">
      <div className="time">{timeString.time}</div>
      <div className="date">{timeString.date}</div>
    </div>
  );
};

export default Clock;
