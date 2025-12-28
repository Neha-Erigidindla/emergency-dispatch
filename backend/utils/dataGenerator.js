const mongoose = require("mongoose");
const Incident = require("../models/Incident");
const Unit = require("../models/Unit");
require("dotenv").config();

const incidents = [
  {
    desc: "Car accident with injuries",
    lat: 40.7589,
    lng: -73.9851,
    severity: "high",
  },
  {
    desc: "Suspicious person reported",
    lat: 40.7614,
    lng: -73.9776,
    severity: "medium",
  },
  {
    desc: "Fire alarm activated in building",
    lat: 40.7549,
    lng: -73.984,
    severity: "high",
  },
  {
    desc: "Medical emergency - chest pain",
    lat: 40.758,
    lng: -73.9855,
    severity: "critical",
  },
  {
    desc: "Noise complaint from neighbors",
    lat: 40.76,
    lng: -73.98,
    severity: "low",
  },
];

const units = [
  { id: "POLICE-01", type: "police", lat: 40.7589, lng: -73.9851 },
  { id: "POLICE-02", type: "police", lat: 40.7614, lng: -73.9776 },
  { id: "FIRE-01", type: "fire", lat: 40.7549, lng: -73.984 },
  { id: "AMBULANCE-01", type: "ambulance", lat: 40.758, lng: -73.9855 },
  { id: "AMBULANCE-02", type: "ambulance", lat: 40.76, lng: -73.98 },
];

async function generateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Incident.deleteMany({});
    await Unit.deleteMany({});
    console.log("Cleared existing data");

    // Create units
    for (const unit of units) {
      await Unit.create({
        unitId: unit.id,
        type: unit.type,
        status: "available",
        location: {
          type: "Point",
          coordinates: [unit.lng, unit.lat],
        },
      });
    }
    console.log(`Created ${units.length} units`);

    // Create incidents (without AI classification for seeding)
    for (const inc of incidents) {
      await Incident.create({
        description: inc.desc,
        location: {
          type: "Point",
          coordinates: [inc.lng, inc.lat],
        },
        address: "New York, NY",
        severity: inc.severity,
        status: "pending",
      });
    }
    console.log(`Created ${incidents.length} incidents`);

    console.log("Sample data generated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error generating data:", error);
    process.exit(1);
  }
}

generateData();
