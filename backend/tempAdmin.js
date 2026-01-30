const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/admin");

mongoose.connect("mongodb://127.0.0.1:27017/smartMunicipal");

async function createAdmin() {
  const hashed = await bcrypt.hash("Admin@123", 10);

  await Admin.create({
    name: "Main Admin",
    email: "admin@test.com",
    mobile: "9999999999",
    password: hashed
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();
