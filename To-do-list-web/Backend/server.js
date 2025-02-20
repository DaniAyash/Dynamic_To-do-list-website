const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./authRoutes"); 

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON data
app.use(cors()); // Handles cross-origin requests

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://020696:020696@cluster0.i3kuv.mongodb.net/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
