const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  amount: Number,
  paidOn: { type: Date, default: Date.now },
  method: { type: String, default: "Online" },
  receiptNo: String,
});

const propertySchema = new mongoose.Schema({
  propertyId: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  address: { type: String, required: true },
  area: { type: String },
  propertyType: {
    type: String,
    enum: ["Residential", "Commercial", "Industrial"],
    default: "Residential"
  },
  sizeSqft: { type: Number },
  taxAmount: { type: Number, required: true },
  dueDate: { type: String },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Partial"],
    default: "Unpaid"
  },
  paymentHistory: [paymentHistorySchema],
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);