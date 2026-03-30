const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  mobile: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  isBlocked: { type: Boolean, default: false },
});

// module.exports = mongoose.model("User", userSchema);
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema)
