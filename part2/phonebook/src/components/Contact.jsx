const Contact = ({ contact, deleteContact }) => {
  return (
    <div>
      <span>{contact.name} {contact.number}</span>
      <button onClick={deleteContact}>delete</button>
    </div>
  )
}

export default Contact