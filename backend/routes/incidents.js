const express = require("express");
const router = express.Router();
const Incident = require("../models/Incident");
const { classifyIncident } = require("../services/aiClassifier");

// Create new incident with AI classification
router.post("/", async (req, res) => {
  try {
    const { description, latitude, longitude, address } = req.body;

    // Get AI classification
    const aiAnalysis = await classifyIncident(description, address);

    const incident = new Incident({
      description,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      address,
      severity: aiAnalysis.severity,
      aiAnalysis,
    });

    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all incidents
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const incidents = await Incident.find(filter)
      .populate("assignedUnit")
      .sort("-createdAt");
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby incidents
router.get("/nearby", async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    const incidents = await Incident.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
