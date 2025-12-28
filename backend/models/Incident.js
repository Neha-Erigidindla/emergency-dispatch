const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  address: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "en-route", "resolved"],
    default: "pending",
  },
  assignedUnit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
  createdAt: { type: Date, default: Date.now },
  respondedAt: Date,
  resolvedAt: Date,
  responseTime: Number, // in seconds
  aiAnalysis: {
    severity: String,
    reasoning: String,
    urgency: Number,
  },
});

// Geospatial index for location queries
incidentSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Incident", incidentSchema);
