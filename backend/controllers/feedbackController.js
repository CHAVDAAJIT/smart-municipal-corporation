const Feedback = require("../models/feedback");
const Complaint = require("../models/Complaint");

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment, complaintId, serviceType } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    // Check if already submitted
    if (complaintId) {
      const existing = await Feedback.findOne({
        user: req.user.id,
        complaint: complaintId
      });
      if (existing) {
        return res.status(400).json({ message: "Feedback already submitted" });
      }
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      complaint: complaintId || null,
      rating,
      comment,
      serviceType: serviceType || "general"
    });

    res.status(201).json({ message: "Feedback submitted!", feedback });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all feedback (admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .populate("complaint", "type area")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedback stats (admin)
exports.getFeedbackStats = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const total = feedbacks.length;
    const avgRating = total > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
      : 0;

    const distribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: feedbacks.filter(f => f.rating === star).length
    }));

    res.json({ total, avgRating, distribution });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get my feedback
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};