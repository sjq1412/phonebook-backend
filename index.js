require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

morgan.token('body', request => {
    return JSON.stringify(request.body)
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get("/info", (request, response) => {
    Person.find({}).then(people => {
        const personsCount = people.length
        const dateToday = new Date()

        response.send(`<div><p>Phonebook has info for ${personsCount} people</p><p>${dateToday}</p></div>`)
    })
})

app.get("/api/persons", (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch(error => {
        return response.sendStatus(404).end()
    })
})

// app.delete("/api/persons/:id", (request, response) => {
//     const id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)

//     response.sendStatus(204).end()
// })

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: "missing name or number"
        })
    }

    // const personExists = persons.some(person => person.name === body.name)
    // if (personExists) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT;
app.listen(PORT) 
console.log(`Server running on port ${PORT}`)