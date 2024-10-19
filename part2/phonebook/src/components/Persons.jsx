const Persons = ({personsToShow, toggleDelete}) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <li key={person.id}>
          {person.name} {person.number} <button onClick={() => toggleDelete(person)}>delete</button>
        </li>
      )}
    </ul>
  )
}

export default Persons