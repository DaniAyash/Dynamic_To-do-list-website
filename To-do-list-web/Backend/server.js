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
      username: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
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
    // Find user in MongoDB
    const user = await collection.findOne({ email });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.json({ error: "Invalid credentials" });
    }

    res.cookie("username", user.username, { httpOnly: false }); // httpOnly: false allows JS access
    res.redirect("/todo"); // If login is successful, redirect to /todo

  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong. Try again." });
  }
});

app.get("/todo", async (req, res) => {
  const username = req.cookies.username; // Get username from cookie
  if (!username) return res.json({ error: "Not authenticated" });

  try {
    const user = await collection.findOne({ username });
    if (!user) return res.json({ error: "User not found" });

    res.json(user.tasks); // Send the tasks array
  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong" });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
