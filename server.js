
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
//middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/groceryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Define Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// Handle Registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, date, password } = req.body;
        const user = new User({ name, email, date, password });
        await user.save();
        res.json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});
// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in MongoDB
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Check password
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        res.json({ success: true, message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
