const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jaggerdev:${password}@phonebook-cluster.n5ko5np.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

const person = new Person({
  name: "Test User",
  number: "123-123-1234",
});

person.save().then((result) => {
  console.log("person saved!");
  mongoose.connection.close();
});
