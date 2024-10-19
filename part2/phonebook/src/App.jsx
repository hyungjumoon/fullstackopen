import { useState, useEffect } from 'react'
// import './index.css'

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
  const [info, setInfo] = useState({ message: null})
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  // console.log('render', persons.length, 'persons')

  const notify = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null} )
    }, 3000)
  }

  const clean = () => {
    setNewName('')
    setNewNumber('')
  }

  const updatePerson = (person) => {
    const check = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
    if(check) {
      const changedPerson = { ...person, number: newNumber }
      personService
        .update(changedPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          notify(`phone number of ${person.name} updated!`)
        })
        .catch(() => {
          notify(`${person.name} has already been removed`, 'error')
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
    clean()
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(p => p.name === newName)

    if (person) {
      updatePerson(person)
      return
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          notify(`${returnedPerson.name} added!`)
        })
        .catch(error => {
          notify(error.response.data.error, 'error')
        })
      clean()
    }
  }

  const toggleDelete = (person) => {
    const check = confirm(`Delete ${person.name}?`)
    if(check) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          notify(
            `'${person.name}' has been deleted`
          )
        })
        .catch(() => {
          notify(
            `'${person.name}' was already deleted from server`, 'error'
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification info={info} />
      <Filter search={search} setSearch={setSearch} />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        setNewName={setNewName} 
        newNumber={newNumber} 
        setNewNumber={setNewNumber} 
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} toggleDelete={toggleDelete} />
    </div>
  )
}

export default App