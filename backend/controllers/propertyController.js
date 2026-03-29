const Property = require("../models/property");

/* ===== USER ===== */
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({
      propertyId: req.params.propertyId
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.payTax = async (req, res) => {
  try {
    const { propertyId, amount, method } = req.body;

    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Receipt number generate karo
    const receiptNo = "RCP-" + Date.now().toString().slice(-8);

    property.paymentHistory.push({
      amount,
      method: method || "Online",
      receiptNo,
      paidOn: new Date()
    });

    property.paymentStatus = "Paid";
    await property.save();

    res.json({
      message: "Payment successful",
      receiptNo,
      property
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===== ADMIN ===== */
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProperty = async (req, res) => {
  try {
    const {
      propertyId, owner, email, mobile,
      address, area, propertyType,
      sizeSqft, taxAmount, dueDate
    } = req.body;

    const existing = await Property.findOne({ propertyId });
    if (existing) {
      return res.status(400).json({ message: "Property ID already exists" });
    }

    const property = await Property.create({
      propertyId, owner, email, mobile,
      address, area, propertyType,
      sizeSqft, taxAmount, dueDate
    });

    res.status(201).json({ message: "Property added", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Updated", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    res.json({ message: "Payment status updated", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};