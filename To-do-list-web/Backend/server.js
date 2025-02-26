const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const collection = require("./config");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

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

app.post("/signup", async (req, res) => {
  const data = {
      username: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
