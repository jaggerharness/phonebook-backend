const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const randomInt = Math.floor(Math.random() * 500000);

  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "person name and number are required",
    });
  }

  const newPersonData = req.body;
  const newPerson = { randomInt, ...newPersonData };

  if (
    persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
    )
  ) {
    return res.status(400).json({
      error: "person name must be unique",
    });
  }
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.get("/info", (req, res) => {
  res.send(`<div>Phonebook has info for ${persons.length} people
    <p>${Date()}</p></div>`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
