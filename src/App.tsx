import "./App.css";
import { useEffect, useState, useRef } from "react";
import { BiSolidUpArrowAlt } from "react-icons/bi";
import { BiSolidDownArrowAlt } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { BsFillPauseFill } from "react-icons/bs";
import AlarmSound from "./assets/AlarmSound.mp3";

function App() {
  const [breaktime, setBreakTime] = useState(5 * 60);
  const [breakLength, setbreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [displayTime, setdisplayTime] = useState(25 * 60);
  const [playPauseFlag, setplayPauseFlag] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handlePlayPause() {
    setplayPauseFlag(!playPauseFlag);
  }

  useEffect(() => {
    if (playPauseFlag) {
      setTimeout(() => {
        if (displayTime !== 0) {
          setdisplayTime((pre) => pre - 1);
        } else {
          if (audioRef.current) audioRef.current.play();
          if (breaktime !== 0) {
            setBreakTime((pre) => pre - 1);
          } else {
            setBreakTime(breakLength * 60);
            setdisplayTime(sessionLength * 60);
          }
        }
      }, 1000);
    }
  }, [playPauseFlag, displayTime, breaktime]);

  useEffect(() => {
    setdisplayTime(sessionLength * 60);
    setBreakTime(breakLength * 60);
  }, [sessionLength, breakLength]);

  // function for Modifying display time
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes.toString() : minutes}:${
      seconds < 10 ? "0" + seconds.toString() : seconds
    }`;
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="break">
            <h1 id="break-label">BreakLength</h1>
            <div className="subcon">
              <button
                id="break-decrement"
                disabled={displayTime === 0}
                onClick={() => {
                  if (breakLength == 1) {
                    setbreakLength(1);
                  } else {
                    setbreakLength(breakLength - 1);
                  }
                }}
              >
                <BiSolidDownArrowAlt />
              </button>
              <div id="break-length" className="text">
                {breakLength}
              </div>
              <button
                id="break-increment"
                disabled={displayTime === 0}
                onClick={() => {
                  if (breakLength == 60) setbreakLength(60);
                  else setbreakLength(breakLength + 1);
                }}
              >
                <BiSolidUpArrowAlt />
              </button>
            </div>
          </div>
          <div className="session break">
            <h1 id="session-label">SessionLength</h1>
            <div className="subcon">
              <button
                id="session-decrement"
                disabled={playPauseFlag}
                onClick={() => {
                  if (sessionLength == 1) setSessionLength(1);
                  else setSessionLength((pre) => pre - 1);
                }}
              >
                <BiSolidDownArrowAlt />
              </button>
              <div id="session-length" className="text">
                {sessionLength}
              </div>
              <button
                id="session-increment"
                disabled={playPauseFlag}
                onClick={() => {
                  if (sessionLength == 60) setSessionLength(60);
                  else setSessionLength((pre) => pre + 1);
                }}
              >
                <BiSolidUpArrowAlt />
              </button>
            </div>
          </div>
        </div>
        <div className="rest">
          <h1 id="timer-label">
            {displayTime && "Session"}
            {!displayTime && "break"}
            {!displayTime && !breaktime && "session has begun"}
          </h1>
          <div
            id="time-left"
            className="text"
            style={{ color: playPauseFlag ? "red" : "" }}
          >
            {displayTime ? formatTime(displayTime) : formatTime(breaktime)}
          </div>
          <div className="controlbutton">
            <button id="start_stop" onClick={handlePlayPause}>
              {!playPauseFlag && <FaPlay />}
              {playPauseFlag && <BsFillPauseFill />}
            </button>
            <button
              id="reset"
              onClick={() => {
                setBreakTime(5);
                setSessionLength(25);
                setdisplayTime(25 * 60);
                setplayPauseFlag(false);
                if (audioRef.current?.play()) audioRef.current.pause();
              }}
            >
              <GrPowerReset />
            </button>
          </div>
          <audio id="beep" src={AlarmSound} ref={audioRef} />
        </div>
      </div>
    </>
  );
}

export default App;
