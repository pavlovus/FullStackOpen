import Contact from './Contact'

const Contacts = ({contacts, deleteContact }) => {
    return (
        <div>
            {contacts.map(contact => <Contact key={contact.id} contact={contact} deleteContact={() => deleteContact(contact.id)} />)}
        </div>
    )
}

export default Contacts