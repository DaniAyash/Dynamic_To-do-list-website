const express = require("express");
const router = express.Router();
const collection = require("./config"); // Import the schema

// Signup Route
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) return res.status(400).send("User already exists");

        // Save user with plain text password (NOT SECURE, just for learning)
        const newUser = new collection({ username, password });
        await newUser.save();
        res.status(201).send("User registered successfully!");
    } catch (error) {
        res.status(500).send("Error registering user");
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await collection.findOne({ username });
        if (!user) return res.status(400).send("User not found");

        // Check if passwords match
        if (user.password !== password) return res.status(400).send("Invalid credentials");

        res.status(200).send("Login successful");
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});

module.exports = router;
