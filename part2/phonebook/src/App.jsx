import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import Contacts from './components/Contacts'
import ContactForm from './components/ContactForm'
import Filter from './components/Filter'
import Notification from './components/Notifications'

const App = () => {
  const [contacts, setContacts] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const contactsToShow = contacts.filter(contact => contact.name.toLowerCase().includes(newFilter.toLowerCase()))
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)

  useEffect(() => {
    contactService
    .getAll()
    .then(initialContacts => {
      setContacts(initialContacts)
    })
  }, [])

  const handleNameChange = (event) => {setNewName(event.target.value)}
  const handleNumberChange = (event) => {setNewNumber(event.target.value)}
  const handleFilterChange = (event) => {setNewFilter(event.target.value)}

  const addContact = (event) => {
    event.preventDefault()

    if(newName === '' || newNumber === '') {
      setSuccess(false)
      setMessage(`Name or number cannot be empty`)
      setTimeout(() => {setMessage(null)}, 5000)
    }else if(contacts.map(contact => contact.number).includes(newNumber)) {
      setSuccess(false)
      setMessage(`${newNumber} is already added to phonebook`)
      setTimeout(() => {setMessage(null)}, 5000)
    } else if(contacts.map(contact => contact.name).includes(newName)) {
      const contact = contacts.find(c => c.name === newName)
      if(window.confirm(`${contact.name} is already added to phonebook, replace the old number with the new one?`)){
        const changedContact = { ...contact, number: newNumber }

        contactService
        .update(contact.id, changedContact)
        .then(newContact => {
          setContacts(contacts.map(contact => contact.name === newName ? newContact : contact))
          setNewName('')
          setNewNumber('')
          
          setSuccess(true)
          setMessage(`Changed ${changedContact.name}`)
          setTimeout(() => {setMessage(null)}, 5000)
        })
      }
    } else {
      const contactObject = {name: newName, number: newNumber}

      contactService
      .create(contactObject)
      .then(returnedContact => {
        setContacts(contacts.concat(returnedContact))
        setNewName('')
        setNewNumber('')

        setSuccess(true)
        setMessage(`Added ${contactObject.name}`)
        setTimeout(() => {setMessage(null)}, 5000)
      })
    }
  }

  const deleteContact = id => {
    const contact = contacts.find(c => c.id === id)
    if(window.confirm(`Delete ${contact.name}?`)) {
      contactService
      .deleteContact(id)
      .then(() => {
        setContacts(contacts.filter(c => c.id !== id))
      })
      .catch(error => {
        setSuccess(false)
        setMessage(`Information of '${contact.name}' has already been removed from server`)
        setTimeout(() => {setMessage(null)}, 5000)

        setContacts(contacts.filter(c => c.id !== contact.id))
    })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} success={success} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>Add new contact</h2>
      <ContactForm addContact={addContact} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Contacts contacts={contactsToShow} deleteContact={deleteContact} />
    </div>
  )
}

export default App