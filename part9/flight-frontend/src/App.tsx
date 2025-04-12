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
  const [noti, setNoti] = useState("hi");

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
        date <input value={date} onChange={(event) => setDate(event.target.value)} /> <br />
        visibility <input value={visibility} onChange={(event) => setVisibility(event.target.value)} /> <br />
        weather <input value={weather} onChange={(event) => setWeather(event.target.value)} /> <br />
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