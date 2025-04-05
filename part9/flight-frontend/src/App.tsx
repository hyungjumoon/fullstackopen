import { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import { getAllDiaryEntries, createDiaryEntry } from "./diaryService";

const App = () => {
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  // const [newDiary, setNewDiary] = useState('');

  useEffect(() => {
    getAllDiaryEntries().then(data => {
      setDiary(data)
    })
  }, [])

  // const noteCreation = (event: React.SyntheticEvent) => {
  //   event.preventDefault()
  //   createNote({ content: newNote }).then(data => {
  //     setNotes(notes.concat(data))
  //   })

  //   setNewNote('')
  // };

  return (
    <div>
      {/* <form onSubmit={noteCreation}>
        <input value={newNote} onChange={(event) => setNewNote(event.target.value)} />
        <button type='submit'>add</button>
      </form> */}
      <h2>Diary Entries</h2>
      {diary.map(entry =>
        <div>
          <h3>{entry.date}</h3>
          visibility: {entry.visibility} <br />
          weather: {entry.weather}
        </div>
      )}
    </div>
  )
}

export default App;