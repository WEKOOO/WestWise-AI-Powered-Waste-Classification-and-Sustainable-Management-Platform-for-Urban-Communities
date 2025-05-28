const { PythonShell } = require("python-shell");
const path = require("path");
const Prediction = require("../models/Prediction"); // Mongoose model
const fs = require("fs");

// Handle waste prediction
exports.predictWaste = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded." });
  }

  const imagePath = req.file.path;
  const pythonScriptPath = path.join(__dirname, "../ml/");

  console.log(`Image received: ${imagePath}. Running prediction...`);

  let options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: pythonScriptPath,
    args: [imagePath]
  };

  PythonShell.run("predict.py", options).then(results => {
    console.log("Raw prediction results:", results);
    try {
      if (results && results.length > 0) {
        const predictionData = JSON.parse(results[0]);

        if (predictionData.error) {
          console.error("Prediction script error:", predictionData.error);
          fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
          return res.status(500).json({ message: "Error during prediction.", error: predictionData.error });
        }

        console.log("Parsed prediction:", predictionData);

        // Save prediction to MongoDB
        const newPrediction = new Prediction({
          predictedClass: predictionData.predicted_class,
          confidence: predictionData.confidence,
          handling: predictionData.handling
          // Optionally add imagePath if needed in the schema
        });

        newPrediction.save()
          .then(savedPrediction => {
            console.log("Prediction saved to DB:", savedPrediction._id);
            // Clean up uploaded file after successful prediction and DB save
            fs.unlink(imagePath, (err) => {
              if (err) console.error("Error deleting temp file:", err);
              else console.log(`Deleted temp file: ${imagePath}`);
            });
            // Send prediction result back to client
            res.status(200).json({ 
              message: "Prediction successful", 
              prediction: predictionData // Send the data from python script
            });
          })
          .catch(dbError => {
            console.error("Error saving prediction to DB:", dbError);
            // Still try to clean up the file
            fs.unlink(imagePath, (err) => {
              if (err) console.error("Error deleting temp file after DB error:", err);
            });
            res.status(500).json({ message: "Error saving prediction result.", error: dbError.message });
          });

      } else {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
        throw new Error("Prediction script returned no output.");
      }
    } catch (parseError) {
      console.error("Error processing prediction result:", parseError);
      console.error("Raw output from script:", results);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
      res.status(500).json({ message: "Error processing prediction result.", error: parseError.message });
    }
  }).catch(err => {
     console.error("PythonShell execution error:", err);
     fs.unlink(imagePath, (unlinkErr) => {
       if (unlinkErr) console.error("Error deleting temp file after PythonShell error:", unlinkErr);
     });
     // Try to parse stderr if available
     let errMsg = err.message;
     if (err.stderr) {
       try {
         const stderrJson = JSON.parse(err.stderr);
         if (stderrJson.error) {
           errMsg = stderrJson.error;
         }
       } catch (e) { /* Ignore parsing error, use original stderr */ }
     }
     res.status(500).json({ message: "Error executing prediction script.", error: errMsg });
  });
};

// Get prediction history
exports.getPredictions = async (req, res) => {
  console.log("Fetching prediction history...");
  try {
    // Fetch predictions sorted by creation date descending
    const predictions = await Prediction.find().sort({ createdAt: -1 }); 
    res.status(200).json({ 
      message: "Prediction history fetched successfully", 
      predictions: predictions 
    });
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    res.status(500).json({ message: "Error fetching prediction history.", error: error.message });
  }
};

