const User = require("../models/user");

// Get user points
exports.getMyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name points totalPointsEarned pointsUsed");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Redeem points for tax payment
exports.redeemPoints = async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    const user = await User.findById(req.user.id);

    if (pointsToRedeem > user.points) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    const moneyValue = Math.floor(pointsToRedeem / 100); // 100 points = ₹1

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        points: -pointsToRedeem,
        pointsUsed: pointsToRedeem
      }
    });

    res.json({
      message: "Points redeemed successfully",
      pointsRedeemed: pointsToRedeem,
      moneyValue,
      remainingPoints: user.points - pointsToRedeem
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};