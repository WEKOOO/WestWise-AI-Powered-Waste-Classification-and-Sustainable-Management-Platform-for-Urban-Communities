const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/predictionController");
const upload = require("../utils/fileUpload");

// Prediction route
router.post("/predict", upload.single("image"), predictionController.predictWaste);

// Route to get prediction history (Placeholder)
router.get("/predictions", predictionController.getPredictions);

module.exports = router;

