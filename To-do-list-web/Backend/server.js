const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const collection = require("./config");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Enable cookie parsing

// Serve static files (CSS, JS, images) from the Frontend folder
app.use(express.static(path.join(__dirname, "../Frontend")));

// Route to serve the login page as the default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/pages/login.html"));
});

// Route to serve the signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/pages/signup.html"));
});

app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/pages/todo.html"));
});

app.post("/signup", async (req, res) => {
  const data = {
      username: req.formData.firstname,
      email: req.formData.email,
      password: req.formData.password,
      tasks: [],
  };

  if (!data.username.trim() || !data.email.trim() || !data.password.trim()) {
    return res.json({ missingFields: "All fields are required" });
  }

  try {
    await collection.insertMany([data]); // Insert user data
    res.redirect("/"); // Redirect to the login page
  } catch (error) {
    console.error(error);
    res.json({ error: "An error occurred. Please try again." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "All fields are required" });
  }

  try {
    const user = await collection.findOne({ email });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ error: "Invalid credentials" });
    }

    console.log(user.email);
    res.cookie("username", user.username, { httpOnly: false }); // Allow JS access
    res.json({ redirect: "/todo" }); // Fix: return redirect in JSON instead of res.redirect()
  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong. Try again." });
  }
});


app.post("/todo", async (req, res) => { 
  console.log("Received request at /todo"); // Debug

  const username = req.cookies?.username; // Get username from cookie
  console.log("Username from cookies:", username); // Debug

  if (!username) {
      console.log("User not authenticated");
      return res.json({ error: "Not authenticated" });
  }

  try {
      const user = await collection.findOne({ username });
      console.log("DB Query Result:", user); // Debug

      if (!user) {
          console.log("User not found");
          return res.json({ error: "User not found" });
      }

      console.log("User tasks:", user.tasks); // Debug
      res.json({ tasks: user.tasks }); // Send tasks
  } catch (error) {
      console.error("Database error:", error);
      res.json({ error: "Something went wrong" });
  }
});

app.post("/add-task", async (req, res) => {
  const username = req.cookies?.username; // Get the username from cookies
  const { task } = req.body; // Get task from request body

  console.log("Adding task for user:", username, "Task:", task); // Debug log

  if (!username) {
      return res.json({ error: "Not authenticated" });
  }

  if (!task || !task.trim()) {
      return res.json({ error: "Task cannot be empty" });
  }

  try {
      // Find user and update their tasks array
      const user = await collection.findOneAndUpdate(
          { username }, // Find user by username
          { $push: { tasks: task } }, // Push new task into tasks array
          { new: true } // Return updated document
      );

      if (!user) {
          return res.json({ error: "User not found" });
      }

      res.json({ success: true, tasks: user.tasks }); // Send updated tasks list
  } catch (error) {
      console.error("Database error:", error);
      res.json({ error: "Failed to add task" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
