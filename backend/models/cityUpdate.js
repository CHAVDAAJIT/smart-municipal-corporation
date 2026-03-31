const mongoose = require("mongoose");

const cityUpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["General", "Road", "Water", "Park", "Event", "Infrastructure"],
    default: "General"
  },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("CityUpdate", cityUpdateSchema);