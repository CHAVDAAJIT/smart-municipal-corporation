require("dotenv").config();
const mongoose = require("mongoose");
const Notification = require("./models/notification");
const User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/smartMunicipal");

async function seed() {
  const user = await User.findOne();
  if (!user) {
    console.log("No user found!");
    process.exit();
  }

  await Notification.deleteMany({ user: user._id });
  await Notification.create([
    {
      user: user._id,
      title: "Complaint Status Updated",
      message: "Your Road complaint (#f95820) status changed to \"Resolved\"",
      type: "complaint",
      isRead: false,
      link: "/user/complaints"
    },
    {
      user: user._id,
      title: "Certificate Request Approved",
      message: "Your Birth certificate request has been \"Approved\"",
      type: "certificate",
      isRead: false,
      link: "/user/my-certificates"
    },
    {
      user: user._id,
      title: "Water Request Updated",
      message: "Your tanker request status changed to \"Approved\"",
      type: "water",
      isRead: true,
      link: "/user/water"
    },
    {
      user: user._id,
      title: "Garbage Complaint Resolved",
      message: "Your garbage complaint status changed to \"Resolved\"",
      type: "garbage",
      isRead: true,
      link: "/user/garbage"
    },
    {
      user: user._id,
      title: "New Announcement",
      message: "Water Supply Disruption - Sector 3. Please store water in advance.",
      type: "announcement",
      isRead: false,
      link: "/user/events"
    },
  ]);

  console.log("✅ Notifications seeded!");
  process.exit();
}
seed();