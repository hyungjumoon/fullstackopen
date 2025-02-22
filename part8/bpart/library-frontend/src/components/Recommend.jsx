import { useQuery } from '@apollo/client'
import { FIND_GENRE } from '../queries'

const Recommend = ({show, favorite}) => {

  const result = useQuery(FIND_GENRE, {
    variables: { genreToSearch: favorite },
    skip: !favorite,
  })

  if (!show) {
    return null
  }
  if (result.loading || !result.data || !result.data.allBooks) {
    console.log(result)
    return <div>books are loading</div>
  }

  const books = result.data.allBooks
  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genres <b>{favorite}</b></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>born</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.author.born}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend