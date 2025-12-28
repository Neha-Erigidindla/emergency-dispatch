const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  unitId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["police", "fire", "ambulance"],
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "busy", "offline"],
    default: "available",
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  currentIncident: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
  lastUpdated: { type: Date, default: Date.now },
});

unitSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Unit", unitSchema);
