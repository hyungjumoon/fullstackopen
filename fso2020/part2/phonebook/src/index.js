import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Filter = ({val, handle}) => {
  return (
    <div>
      filter shown with <input value={val} onChange={handle} />
    </div>
  )
}

const PersonForm = ({name, handleName, number, handleNumber, nameAdd}) => {
  return (
    <div>
      <form onSubmit={nameAdd}>
        <div>
          name: <input value={name} onChange={handleName} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>    
    </div>
  )
}

const Persons = ({persons, filter}) => {
  return (
    <div>
      {(persons.filter(person => person.name.toUpperCase().startsWith(filter.toUpperCase()))).map(person =>
        <p key={person.number}>{person.name} {person.number}</p>
      )}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  const hook = () => { 
    console.log('effect')    
    axios.get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
    }) 
  }

  useEffect(hook, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.map(a => a.name).find(a => a === newName)) {
      window.alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson))
    }
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter val={filter} handle={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm name={newName} handleName={handleNameChange} number={newNumber} handleNumber={handleNumberChange} nameAdd={addName} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);