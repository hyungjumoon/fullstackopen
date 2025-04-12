import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import { getAllDiaryEntries, createDiaryEntry } from "./diaryService";
import toNewDiaryEntry from "./utils";
import { isAxiosError } from "axios";

const App = () => {
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");
  const [noti, setNoti] = useState("");

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiary(data)
    })
  }, [])

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    try {
      const response = await createDiaryEntry(toNewDiaryEntry({
        date: date,
        weather: weather,
        visibility: visibility,
        comment: comment
      }))
      setDiary(diary.concat(response))
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
      } else {
        console.error(error);
        setNoti(`${error}`);
        setTimeout(() => {
          setNoti("")
        }, 5000);
      }
    }

    setDate("");
    setVisibility("");
    setWeather("");
    setComment("");
  };

  return (
    <div>
      <h2>Add new Entry</h2>
      <div style={{color:"red"}}>{noti}</div> <br />
      <form onSubmit={diaryCreation}>
        date <input value={date} onChange={(event) => setDate(event.target.value)} type="date"/> <br />
        <div>
          visibility 
          great <input type="radio" name="visibility" onChange={() => setVisibility("great")} />
          good <input type="radio" name="visibility" onChange={() => setVisibility("good")} />
          ok <input type="radio" name="visibility" onChange={() => setVisibility("ok")} />
          poor <input type="radio" name="visibility" onChange={() => setVisibility("poor")} />
        </div>
        <div>
          weather
          sunny <input type="radio" name="weather" onChange={() => setWeather("sunny")} />
          rainy <input type="radio" name="weather" onChange={() => setWeather("rainy")} />
          cloudy <input type="radio" name="weather" onChange={() => setWeather("cloudy")} />
          stormy <input type="radio" name="weather" onChange={() => setWeather("stormy")} />
          windy <input type="radio" name="weather" onChange={() => setWeather("windy")} />
        </div>
        comment <input value={comment} onChange={(event) => setComment(event.target.value)} /> <br />
        <button type='submit'>add</button>
      </form>
      <h2>Diary Entries</h2>
      {diary.map(entry =>
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          visibility: {entry.visibility} <br />
          weather: {entry.weather}
        </div>
      )}
    </div>
  )
}

export default App;