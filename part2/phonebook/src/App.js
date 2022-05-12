import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons.js'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)

  useEffect(() => {
    //console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  //console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const notify = (message, type) => {
    setNotificationMsg({ [type]: message })
    setTimeout(() => setNotificationMsg(null), 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber}

    setNewName('')
    setNewNumber('')

    if (newName === "" || newNumber === "") {
      setNotificationMsg({ error: "You must enter a name and a number" })
      return
    }

    const alreadyExisted = persons.some(person => person.name === newName)
    if (alreadyExisted) {
      const oldPerson = persons.find(person => person.name === newName)
      const updatedPerson = { ...oldPerson, number: newNumber}
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (confirmUpdate) {
        personService
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
            notify(`Updated number for ${returnedPerson.name}`, "notification")
          })
          .catch((err) => {
            notify(`Information of ${newName} has already been removed from server`, "error")
            setPersons(persons.filter(person => person.id !== oldPerson.id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          notify(`Added ${returnedPerson.name}`, "notification")
        })
        .catch((err) => {
          notify(err.response.data, "error")
        })
    }
  }

  const deletePerson = (id) => {
    const personToDel = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDel.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMsg({ notification: `Deleted ${personToDel.name}` })
          setTimeout(() => setNotificationMsg(null), 3000)
        })
        .catch((err) => {
          notify(`Information of ${newName} has already been removed from server`, "error")
          setPersons(persons.filter(person => person.id === id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMsg} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} newFilter={newFilter} handleDelete={deletePerson}/>
    </div>
  )
}

export default App