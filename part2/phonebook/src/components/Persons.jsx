import Person from './Person'

const Persons = ({persons, deletPerson }) => {
    return (
        <div>
            {persons.map(person => <Person key={person.id} person={person} deletePerson={() => deletPerson(person.id)} />)}
        </div>
    )
}

export default Persons