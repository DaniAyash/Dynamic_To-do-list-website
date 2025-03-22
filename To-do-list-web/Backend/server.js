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
  const { username, email, password } = req.body;

  if (!username.trim() || !email.trim() || !password.trim()) {
    return res.json({ error: "All fields are required" });
  }

  try {
    // Check if the username already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.json({ error: "Username already exists. Choose another one." });
    }

    // Insert the new user
    await collection.insertOne({
      username,
      email,
      password,
      connected: false,
      tasks: [],
    });

    res.json({ redirect: "/" }); // Send response to frontend for redirection
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
    if (user.connected){
      return res.json({ conn: "User already connected" });
    }

    // Update the connected field to true
    await collection.updateOne(
      { email },
      { $set: { connected: true } }
    );

    console.log(user.email);

    res.cookie("username", user.username, { httpOnly: false }); // Allow JS access
    res.json({ redirect: "/todo" }); // Fix: return redirect in JSON instead of res.redirect()
  } catch (error) {
    console.error(error);
    res.json({ error: "Something went wrong. Try again." });
  }
});

app.post("/logout", async (req, res) => {
  const username = req.cookies?.username;

  if (!username) {
    return res.json({ error: "Not authenticated" });
  }

  try {
    const user = await collection.findOneAndUpdate(
      { username },
      { $set: { connected: false } }
    );  
    if (!user) {
      return res.json({ error: "User not found" });
    }
  } catch (error) { 
    console.error(error);
    return res.json({ error: "Something went wrong" });
  }

  // Clear the username cookie
  res.clearCookie("username"); 

  // Send a success response
  res.json({ success: true, message: "Logged out successfully" });
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

// Example: Adding a new task
app.post("/add-task", async (req, res) => {
  const { task } = req.body; // Get task text from request body
  const username = req.cookies?.username;

  if (!username || !task || !task.trim()) {
    return res.json({ error: "Not authenticated or task is empty" });
  }

  try {
    const user = await collection.findOneAndUpdate(
      { username },
      { $push: { tasks: { taskText: task, completed: false } } }, // Add task with completed as false
      { new: true }
    );

    res.json({ success: true, tasks: user.tasks });
  } catch (error) {
    console.error(error);
    res.json({ error: "Failed to add task" });
  }
});


app.post("/remove-task", async (req, res) => {
  const { taskIndex } = req.body; // Get index from request
  const username = req.cookies.username; // Assuming the username is stored in cookies

  try {
      // Step 1: Unset the specific index (set it to `null`)
      await collection.updateOne(
          { username },
          { $unset: { [`tasks.${taskIndex}`]: 1 } }
      );

      // Step 2: Remove `null` values from the array
      await collection.updateOne(
          { username },
          { $pull: { tasks: null } }
      );

      // Fetch updated tasks
      const user = await collection.findOne({ username });

      res.json({ success: true, tasks: user.tasks }); // Send updated task list
  } catch (error) {
      console.error("Error removing task:", error);
      res.json({ error: "An error occurred. Please try again." });
  }
});

app.post("/update-task", async (req, res) => {
  const { taskIndex, completed } = req.body; // Get task index and completed status
  const username = req.cookies?.username;

  if (!username || taskIndex == undefined) {
    return res.json({ error: "Not authenticated or invalid task index" });
  }

  try {
    // Update the completed status of the task at the given index
    const user = await collection.findOneAndUpdate(
      { username },
      { $set: { [`tasks.${taskIndex}.completed`]: completed } }, // goes to tasks gets the task with index passed from the loop of each task and within it gets the completed field
      { new: true }
    );

    res.json({ success: true, tasks: user.tasks });
  } catch (error) {
    console.error(error);
    res.json({ error: "Failed to update task" });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
