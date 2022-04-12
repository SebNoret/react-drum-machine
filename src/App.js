import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import soundBanks from "./SoundBanks";
import Select from "react-select";

const App = () => {
  const [sound, setSound] = useState("sound played");
  const [soundBank, setSoundBank] = useState(soundBanks[0].value);
  const [volume, setVolume] = useState(0.2);
  const handleSound = (soundName) => {
    setSound(soundName);
  };
  const onChangeSoundBank = (optionsValue) => {
    setSoundBank(optionsValue.value);
  };
  const adjustVolume = (e) => {
    const volume = e.target.value;
    setVolume(volume);
  };

  return (
    <div id="drum-machine" className="App">
      <header className="App-header">Drum machine</header>
      <div className="container">
        <DrumPad
          soundBank={soundBank}
          handleSound={handleSound}
          volume={volume}
        />
        <ControlPanel
          text={sound}
          onChangeSoundBank={onChangeSoundBank}
          adjustVolume={adjustVolume}
          volume={volume}
        />
      </div>
    </div>
  );
};

/**drum pad */
const DrumPad = ({ soundBank, handleSound, volume }) => {
  return (
    <div className="drum-pad-container">
      <ul>
        {soundBank.map((sound) => {
          return (
            <Pad
              key={sound.id}
              {...sound}
              change={handleSound}
              volume={volume}
            />
          );
        })}
      </ul>
    </div>
  );
};

const Pad = ({ keyCode, keyTrigger, id, url, change, volume }) => {
  const [active, setActive] = useState(false);

  const playSound = () => {
    const sound = document.getElementById(keyTrigger);
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play();
    change(id);
  };

  const toggleActive = () => {
    setActive((prev) => {
      return !prev;
    });

    setTimeout(() => {
      setActive((prev) => {
        return !prev;
      });
    }, 100);
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode === keyCode) {
        playSound();
        toggleActive();
      }
    });
  }, [volume, change]);
  return (
    <li
      onClick={() => {
        playSound();
        toggleActive();
      }}
      id={id}
      className={active ? "active" : "drum-pad"}
    >
      <audio id={keyTrigger} src={url} className="clip" />
      {keyTrigger}
    </li>
  );
};

/********control panel****************** */
const ControlPanel = ({ text, onChangeSoundBank, adjustVolume, volume }) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#182d5e" : "white",
      color: state.isSelected ? "yellow" : "black",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "#182d5e",
      backgroundColor: "black",
    }),
  };
  return (
    <div className="control-panel">
      <div className="panel">
        <DisplayScreen text={text} isSearchable={() => false} />
        <Select
          onChange={onChangeSoundBank}
          options={soundBanks}
          defaultValue={soundBanks[0]}
          isSearchable={false}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "#182d5e",
              neutral80: "yellow",
              neutral20: "yellow",
            },
          })}
        />
      </div>
      <VolumeTrigger adjustVolume={adjustVolume} volume={volume} />
    </div>
  );
};
const DisplayScreen = ({ text }) => {
  return (
    <div id="display" className="screen">
      {text}
    </div>
  );
};
const VolumeTrigger = ({ adjustVolume, volume }) => {
  const readableVolume = Math.round(volume * 100);
  return (
    <>
      <div className="panel">
        <div className="screen">Volume: {readableVolume}</div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={adjustVolume}
          name="volume"
          value={volume}
          className="slider"
        />
      </div>
    </>
  );
};

export default App;
