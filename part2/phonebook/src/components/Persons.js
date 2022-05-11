import Person from "./Person"

const Persons = ({persons, newFilter, handleDelete}) => {
  const displayedPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  return (
    <div>
      {displayedPersons.map((person) =>
        <Person
          key={person.name}
          person={person}
          handleDelete={() => handleDelete(person.id)}/>
      )}
    </div>
  )
}

export default Persons