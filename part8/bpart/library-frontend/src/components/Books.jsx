import { useEffect, useState } from 'react' 
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, FIND_GENRE } from '../queries'

const Genres = ({ setGenre, refetch }) => {
  const result = useQuery(ALL_BOOKS) 
  if (result.loading || !result.data || !result.data.allBooks) {
    return <div>genres are loading</div>
  }
  const books = result.data.allBooks
  
  let genreset = new Set()
  books.map(b => {b.genres.map(genre => genreset.add(genre))})
  const genres = [...genreset]
  const click = (g) => {
    setGenre(g)
    console.log(g)
    refetch({ genre: g })
  }
  return (
    <div>
      {genres.map((g) => (
        <button key={g} onClick={() => click(g)}>{g}</button>
      ))}
      <button onClick={() => click('')}>all genres</button>
    </div>
  )
}

const Books = (props) => {
  const [genre, setGenre] = useState('')
  // const [books, setBooks] = useState([])
  
  const result = useQuery(FIND_GENRE, {
    variables: { genreToSearch: genre }
  }) 
  if (!props.show) {
    return null
  }
  if (result.loading || !result.data || !result.data.allBooks) {
    return <div>books are loading</div>
  }
  console.log(result.data)
  const filterBooks = result.data.allBooks

  // const filterBooks = books.filter(b => (genre === '' || b.genres.includes(genre)))

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
      <Genres setGenre={setGenre} refetch={result.refetch} />
    </div>
  )
}

export default Books
