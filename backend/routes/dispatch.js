const express = require("express");
const router = express.Router();
const Incident = require("../models/Incident");
const Unit = require("../models/Unit");

// Assign unit to incident
router.post("/assign", async (req, res) => {
  try {
    const { incidentId, unitId } = req.body;

    const incident = await Incident.findById(incidentId);
    const unit = await Unit.findOne({ unitId });

    if (!incident || !unit) {
      return res.status(404).json({ error: "Incident or Unit not found" });
    }

    if (unit.status !== "available") {
      return res.status(400).json({ error: "Unit not available" });
    }

    incident.assignedUnit = unit._id;
    incident.status = "assigned";
    incident.respondedAt = Date.now();

    unit.status = "busy";
    unit.currentIncident = incident._id;

    await incident.save();
    await unit.save();

    res.json({ incident, unit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve incident
router.post("/resolve", async (req, res) => {
  try {
    const { incidentId } = req.body;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    incident.status = "resolved";
    incident.resolvedAt = Date.now();

    if (incident.respondedAt) {
      incident.responseTime = Math.floor(
        (incident.resolvedAt - incident.respondedAt) / 1000
      );
    }

    if (incident.assignedUnit) {
      const unit = await Unit.findById(incident.assignedUnit);
      if (unit) {
        unit.status = "available";
        unit.currentIncident = null;
        await unit.save();
      }
    }

    await incident.save();
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get metrics
router.get("/metrics", async (req, res) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const resolvedIncidents = await Incident.countDocuments({
      status: "resolved",
    });
    const pendingIncidents = await Incident.countDocuments({
      status: "pending",
    });

    const avgResponseTime = await Incident.aggregate([
      { $match: { responseTime: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: "$responseTime" } } },
    ]);

    const severityBreakdown = await Incident.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    res.json({
      totalIncidents,
      resolvedIncidents,
      pendingIncidents,
      averageResponseTime: avgResponseTime[0]?.avg || 0,
      severityBreakdown,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
