const express = require('express')
const app = express()

app.use(express.json())

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(c => c.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).send({ error: 'Contact not found' })
    }
})

app.get('/api/info', (request, response) => {
  const info = `
    Phonebook has info for ${contacts.length} people\n
    ${new Date()}
  `
  response.send(info)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(c => c.id !== id)
    response.status(204).end()
})

const generateId = () =>  Math.floor(Math.random() * 1000000).toString()

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: 'Name and number are required' })
    }

    if (contacts.find(c => c.name === name)) {
        return response.status(400).json({ error: 'Name must be unique' })
    }

    const newContact = {
        id: generateId(),
        name,
        number
    }

    contacts = contacts.concat(newContact)
    response.status(201).json(newContact)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})