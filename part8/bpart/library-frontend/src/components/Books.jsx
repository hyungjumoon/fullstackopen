import { useState } from 'react' 
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }
  if (result.loading || !result.data || !result.data.allBooks) {
    return <div>books are loading</div>
  }

  const books = result.data.allBooks
  let genreset = new Set()
  books.map(b => {b.genres.map(genre => genreset.add(genre))})
  const genres = [...genreset]
  // console.log(genres)
  const filterBooks = books.filter(b => (genre === '' || b.genres.includes(genre)))
  return (
    <div>
      <h2>books</h2>
      <div>in genre <b>{genre}</b></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>born</th>
            <th>published</th>
          </tr>
          {filterBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.author.born}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
