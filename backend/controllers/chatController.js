const ChatMessage = require("../models/chatMessage");
const User = require("../models/user");

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await ChatMessage.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all chat rooms (admin)
exports.getAllRooms = async (req, res) => {
  try {
    // Distinct roomIds
    const rooms = await ChatMessage.aggregate([
      { $group: { _id: "$roomId", lastMessage: { $last: "$message" }, lastTime: { $last: "$createdAt" }, unread: { $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] } } } },
      { $sort: { lastTime: -1 } }
    ]);

    // User details fetch karo
    const roomsWithUser = await Promise.all(
      rooms.map(async (room) => {
        const user = await User.findById(room._id).select("name email");
        return { ...room, user };
      })
    );

    res.json(roomsWithUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark messages as read
exports.markRead = async (req, res) => {
  try {
    await ChatMessage.updateMany(
      { roomId: req.params.roomId, sender: "user", isRead: false },
      { isRead: true }
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};