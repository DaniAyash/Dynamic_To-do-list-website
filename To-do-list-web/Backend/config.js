const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://020696:020696@cluster0.i3kuv.mongodb.net/todoDB")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  tasks: [{
    taskText: { type: String, required: true },  // The task description
    completed: { type: Boolean, default: false }  // Completion status (default is false)
  }] // Store tasks as an array of objects
});

const collection = mongoose.model("users", UserSchema);

module.exports = collection;
