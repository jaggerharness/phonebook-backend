require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const Person = require("./models/persons");

morgan.token("req-data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens["req-data"](req, res),
    ].join(" ");
  })
);

let persons = [];

app.get("/api/persons", (req, res) => {
  Person.find({}).then((personsDB) => {
    persons = personsDB;
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => {
      return res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "person name and number are required",
    });
  }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  newPerson.save().then((savedPerson) => {
    persons = persons.concat(savedPerson);
    res.json(savedPerson);
  });

  // Commenting until later
  // if (
  //   persons.find(
  //     (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
  //   )
  // ) {
  //   return res.status(400).json({
  //     error: "person name must be unique",
  //   });
  // }
});

app.get("/info", (req, res) => {
  res.send(`<div>Phonebook has info for ${persons.length} people
    <p>${Date()}</p></div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
