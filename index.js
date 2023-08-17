const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', request => {
    return JSON.stringify(request.body)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/info", (request, response) => {
    const personsCount = persons.length;
    const dateToday = new Date()

    response.send(`<div><p>Phonebook has info for ${personsCount} people</p><p>${dateToday}</p></div>`)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (!person) {
        return response.sendStatus(404).end()
    }

    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.sendStatus(204).end()
})

const generateId = () => {
    const int = Math.floor(Math.random() * 1000000)
    return int
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "missing name or number"
        })
    }

    const personExists = persons.some(person => person.name === body.name)
    if (personExists) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3002;
app.listen(PORT) 
console.log(`Server running on port ${PORT}`)