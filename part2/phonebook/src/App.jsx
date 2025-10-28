import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(() => {
    contactService
    .getAll()
    .then(initialContacts => {
      setPersons(initialContacts)
    })
  }, [])

  const handleNameChange = (event) => {setNewName(event.target.value)}
  const handleNumberChange = (event) => {setNewNumber(event.target.value)}
  const handleFilterChange = (event) => {setNewFilter(event.target.value)}

  const addPerson = (event) => {
    event.preventDefault()

    if(persons.map(person => person.number).includes(newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
    } else if(persons.map(person => person.name).includes(newName)) {
      const person = persons.find(p => p.name === newName)
      if(window.confirm(`${person.name} is already added to phonebook, replace the old number with the new one?`)){
        const changedPerson = { ...person, number: newNumber }

        contactService
        .update(person.id, changedPerson)
        .then(newPerson => {
          setPersons(persons.map(person => person.name === newName ? newPerson : person))
          setNewName('')
          setNewNumber('')
        })
      }
    } else if(newName === '' || newNumber === '') {
      alert(`Name or number cannot be empty`)
    } else {
      const personObject = {name: newName, number: newNumber}

      contactService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if(window.confirm(`Delete ${person.name}?`)) {
      contactService
      .deleteContact(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>Add new contact</h2>
      <PersonForm addPerson = {addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletPerson={deletePerson} />
    </div>
  )
}

export default App