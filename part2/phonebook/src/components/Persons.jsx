const Persons = ({personsToShow, toggleDelete}) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <li key={person.id}>
          {person.name} {person.number} <button onClick={() => toggleDelete(person.id)}>delete</button>
        </li>
      )}
    </ul>
  )
}

export default Persons