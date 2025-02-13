import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_YEAR, ALL_AUTHORS } from '../queries'
import { useEffect } from 'react'

const YearForm = ({ authors }) => {
  const [year, setYear] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')


  const [ changeYear, result ] = useMutation(EDIT_YEAR,{
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = (event) => {
    event.preventDefault()

    changeYear({ variables: { name: selectedAuthor, setBornTo: Number(year) } })

    setYear('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log('person not found')
    } 
  }, [result.data])

  return (
    <div>
      <h2>Set birthyear</h2>
      <label>
        Pick an author:
        <select
          value={selectedAuthor}
          onChange={e => setSelectedAuthor(e.target.value)}
        >
        {authors.map((a) => (
          <option key={a.name} value={a.name}>{a.name}</option>
        ))}
        </select>
      </label>
      <form onSubmit={submit}>
        <div>
          born <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}


export default YearForm