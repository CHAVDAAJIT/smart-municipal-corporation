const mongoose = require("mongoose");

const garbageComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  area: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Assigned", "Resolved"],
    default: "Pending"
  },
}, { timestamps: true });

const truckSchema = new mongoose.Schema({
  truckId: { type: String, required: true },
  driverName: { type: String, required: true },
  area: { type: String, required: true },
  status: {
    type: String,
    enum: ["Active", "Inactive", "On Route"],
    default: "Active"
  },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { timestamps: true });

module.exports = {
  GarbageComplaint: mongoose.model("GarbageComplaint", garbageComplaintSchema),
  GarbageTruck: mongoose.model("GarbageTruck", truckSchema),
};