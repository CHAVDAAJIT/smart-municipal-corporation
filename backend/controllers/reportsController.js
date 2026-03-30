const Complaint = require("../models/Complaint");
const User = require("../models/user");
const { Water } = require("../models/waterManagement");
const { GarbageComplaint } = require("../models/garbage");
const Property = require("../models/property");
const Document = require("../models/document");

exports.getReports = async (req, res) => {
  try {
    // ===== COMPLAINTS =====
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const assignedComplaints = await Complaint.countDocuments({ status: "Assigned" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });

    // Complaint by type
    const complaintTypes = await Complaint.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    // ===== WATER =====
    const totalWater = await Water.countDocuments();
    const pendingWater = await Water.countDocuments({ status: "Pending" });
    const resolvedWater = await Water.countDocuments({ status: "Resolved" });
    const tankerRequests = await Water.countDocuments({ type: "tanker" });
    const waterComplaints = await Water.countDocuments({ type: "complaint" });

    // ===== GARBAGE =====
    const totalGarbage = await GarbageComplaint.countDocuments();
    const pendingGarbage = await GarbageComplaint.countDocuments({ status: "Pending" });
    const resolvedGarbage = await GarbageComplaint.countDocuments({ status: "Resolved" });

    // ===== PROPERTY TAX =====
    const totalProperties = await Property.countDocuments();
    const paidProperties = await Property.countDocuments({ paymentStatus: "Paid" });
    const unpaidProperties = await Property.countDocuments({ paymentStatus: "Unpaid" });
    const allProperties = await Property.find();
    const totalTaxAmount = allProperties.reduce((sum, p) => sum + p.taxAmount, 0);
    const collectedAmount = allProperties
      .filter(p => p.paymentStatus === "Paid")
      .reduce((sum, p) => sum + p.taxAmount, 0);

    // ===== CERTIFICATES =====
    const totalCerts = await Document.countDocuments();
    const pendingCerts = await Document.countDocuments({ status: "Pending" });
    const approvedCerts = await Document.countDocuments({ status: "Approved" });
    const rejectedCerts = await Document.countDocuments({ status: "Rejected" });

    // Cert by type
    const certTypes = await Document.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    // ===== CITIZENS =====
    const totalCitizens = await User.countDocuments();
    const blockedCitizens = await User.countDocuments({ isBlocked: true });

    // ===== MONTHLY TREND (last 6 months) =====
const months = [];
for (let i = 5; i >= 0; i--) {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  const [complaints, water, garbage] = await Promise.all([
    Complaint.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Water.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    GarbageComplaint.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    // ✅ User wali line HATA DI — _id pe date filter nahi hota
  ]);

  months.push({
    month: date.toLocaleString("en-IN", { month: "short" }),
    complaints,
    water,
    garbage,
  });
}

    res.json({
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        assigned: assignedComplaints,
        resolved: resolvedComplaints,
        byType: complaintTypes
      },
      water: {
        total: totalWater,
        pending: pendingWater,
        resolved: resolvedWater,
        tanker: tankerRequests,
        complaint: waterComplaints
      },
      garbage: {
        total: totalGarbage,
        pending: pendingGarbage,
        resolved: resolvedGarbage
      },
      property: {
        total: totalProperties,
        paid: paidProperties,
        unpaid: unpaidProperties,
        totalTaxAmount,
        collectedAmount
      },
      certificates: {
        total: totalCerts,
        pending: pendingCerts,
        approved: approvedCerts,
        rejected: rejectedCerts,
        byType: certTypes
      },
      citizens: {
        total: totalCitizens,
        blocked: blockedCitizens,
        active: totalCitizens - blockedCitizens
      },
      monthlyTrend: months
    });
  } catch (err) {
    console.error("Reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};