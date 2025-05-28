require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
  console.error("Error: MONGODB_URI is not defined in .env file");
  process.exit(1); // Exit the application if DB URI is not set
}

mongoose.connect(dbURI)
  .then(() => console.log("MongoDB Connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit on connection error
  });

// Routes
app.use("/api", apiRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Waste Classification Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

