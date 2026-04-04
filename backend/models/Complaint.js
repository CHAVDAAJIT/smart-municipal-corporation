const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: { type: String, required: true },
    description: { type: String, required: true },
    area: { type: String, required: true },
    department: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Resolved", "Cancelled"],
      default: "Pending"
    },
    // ✅ Priority
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    // ✅ Timeline
    timeline: [timelineSchema],
    // ✅ Photos
    photos: [{ type: String }],
    // ✅ Points
    pointsAwarded: { type: Number, default: 0 },
    pointsReason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);