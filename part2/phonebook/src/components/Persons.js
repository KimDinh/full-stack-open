import Person from "./Person"

const Persons = ({persons, newFilter}) => {
  const displayedPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  return (
    <div>
      {displayedPersons.map((person) =>
        <Person key={person.name} name={person.name} number={person.number}/>
      )}
    </div>
  )
}

export default Persons