const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  predictedClass: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  handling: {
    type: [String], // Array of handling steps
    required: true,
  },
  // Optional: Store image information if needed
  // imagePath: {
  //   type: String,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prediction", PredictionSchema);

