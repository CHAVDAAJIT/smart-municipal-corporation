const ChatMessage = require("../models/chatMessage");
const User = require("../models/user");

// Get live chat history only
exports.getChatHistory = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await ChatMessage.find({
      roomId,
      chatType: "live" // ✅ sirf live chat
    }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all chat rooms (admin) — only live chats
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await ChatMessage.aggregate([
      { $match: { chatType: "live" } }, // ✅ sirf live
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $last: "$message" },
          lastTime: { $last: "$createdAt" },
          unread: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$isRead", false] }, { $eq: ["$sender", "user"] }] },
                1, 0
              ]
            }
          }
        }
      },
      { $sort: { lastTime: -1 } }
    ]);

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

// ✅ Delete old sessions (called on new session start)
exports.clearOldSession = async (req, res) => {
  try {
    const { roomId, chatType } = req.body;
    await ChatMessage.deleteMany({ roomId, chatType });
    res.json({ message: "Session cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};