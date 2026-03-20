const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    area: {
      type: String,
      required: true
    },

    department: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "Assigned", "Resolved"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
