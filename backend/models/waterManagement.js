const mongoose = require("mongoose");

// Citizen requests (complaint + tanker)
const waterRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: ["complaint", "tanker"],
  },
  description: String,
  address: String,
  area: String,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Resolved"],
    default: "Pending",
  },
}, { timestamps: true });

// Water supply schedule
const scheduleSchema = new mongoose.Schema({
  area: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

// Water outage alerts
const outageSchema = new mongoose.Schema({
  area: { type: String, required: true },
  reason: { type: String, required: true },
  time: { type: String, required: true },
  resolved: { type: Boolean, default: false },
}, { timestamps: true });

// Water bill info (global)
const billInfoSchema = new mongoose.Schema({
  consumerId: String,
  month: String,
  unitsUsed: Number,
  rate: Number,
  dueDate: String,
}, { timestamps: true });

module.exports = {
  Water: mongoose.model("Water", waterRequestSchema),
  Schedule: mongoose.model("Schedule", scheduleSchema),
  Outage: mongoose.model("Outage", outageSchema),
  BillInfo: mongoose.model("BillInfo", billInfoSchema),
};