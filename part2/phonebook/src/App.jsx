import { useState, useEffect } from 'react'
import './index.css'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isError, setIsError] = useState(true)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  // console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const contains = persons.map(person => person.name === newName).reduce((a,b) => a||b)

    if (contains) {
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          })
          .catch(error => {
            setIsError(true)
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.name !== newName))
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setIsError(false)
          setErrorMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)

          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }
  
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  const toggleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if(confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== returnedPerson.id))
        })
        .catch(error => {
          alert(
            `the note '${person.name}' was already deleted from server`
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} error={isError} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} toggleDelete={toggleDelete} />
    </div>
  )
}

export default App