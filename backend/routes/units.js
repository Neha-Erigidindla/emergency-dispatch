const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");

// Create/Update unit location
router.post("/", async (req, res) => {
  try {
    const { unitId, type, latitude, longitude, status } = req.body;

    let unit = await Unit.findOne({ unitId });

    if (unit) {
      unit.location.coordinates = [longitude, latitude];
      unit.status = status || unit.status;
      unit.lastUpdated = Date.now();
    } else {
      unit = new Unit({
        unitId,
        type,
        status: status || "available",
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });
    }

    await unit.save();
    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all units
router.get("/", async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const units = await Unit.find(filter);
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find nearest available unit
router.get("/nearest", async (req, res) => {
  try {
    const { longitude, latitude, type } = req.query;

    const filter = { status: "available" };
    if (type) filter.type = type;

    const units = await Unit.find({
      ...filter,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    }).limit(5);

    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
