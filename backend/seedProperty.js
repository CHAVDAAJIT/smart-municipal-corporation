require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/property");

mongoose.connect("mongodb://127.0.0.1:27017/smartMunicipal");

async function seed() {
  await Property.deleteMany();
  await Property.create([
    {
      propertyId: "PROP-001",
      owner: "Amit Patel",
      email: "amit@gmail.com",
      mobile: "9876543210",
      address: "B-12, Shyamal Row Houses, Satellite, Ahmedabad",
      area: "Satellite",
      propertyType: "Residential",
      sizeSqft: 1200,
      taxAmount: 4800,
      dueDate: "31 March 2026",
      paymentStatus: "Unpaid",
      paymentHistory: []
    },
    {
      propertyId: "PROP-002",
      owner: "Sunita Shah",
      email: "sunita@gmail.com",
      mobile: "9988776655",
      address: "C-45, Bopal Avenue, Bopal, Ahmedabad",
      area: "Bopal",
      propertyType: "Residential",
      sizeSqft: 900,
      taxAmount: 3600,
      dueDate: "31 March 2026",
      paymentStatus: "Paid",
      paymentHistory: [
        {
          amount: 3600,
          method: "Online",
          receiptNo: "RCP-12345678",
          paidOn: new Date("2026-03-10")
        }
      ]
    },
    {
      propertyId: "PROP-003",
      owner: "Rajesh Kumar",
      email: "rajesh@gmail.com",
      mobile: "9123456789",
      address: "Shop 5, Commercial Complex, Maninagar, Ahmedabad",
      area: "Maninagar",
      propertyType: "Commercial",
      sizeSqft: 500,
      taxAmount: 8500,
      dueDate: "31 March 2026",
      paymentStatus: "Unpaid",
      paymentHistory: []
    },
  ]);
  console.log("✅ Properties seeded!");
  process.exit();
}
seed();