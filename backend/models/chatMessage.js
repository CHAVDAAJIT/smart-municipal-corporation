const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin", "bot"],
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "senderModel"
  },
  senderModel: {
    type: String,
    enum: ["User", "Admin"]
  },
  senderName: { type: String },
  message: { type: String, required: true },
  roomId: { type: String, required: true }, // userId based room
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);