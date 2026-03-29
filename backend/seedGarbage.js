require("dotenv").config();
const mongoose = require("mongoose");
const { GarbageTruck } = require("./models/garbage");

mongoose.connect("mongodb://127.0.0.1:27017/smartMunicipal");

async function seed() {
  await GarbageTruck.deleteMany();
  await GarbageTruck.create([
    { truckId: "GRB-001", driverName: "Ramesh Patel", area: "Sector 1 - Maninagar", status: "On Route", lat: 23.0009, lng: 72.6011 },
    { truckId: "GRB-002", driverName: "Suresh Shah", area: "Sector 2 - Satellite", status: "Active", lat: 23.0258, lng: 72.5100 },
    { truckId: "GRB-003", driverName: "Mahesh Kumar", area: "Sector 3 - Bopal", status: "Active", lat: 23.0354, lng: 72.4700 },
    { truckId: "GRB-004", driverName: "Dinesh Verma", area: "Sector 4 - Gota", status: "Inactive", lat: 23.1100, lng: 72.5800 },
    { truckId: "GRB-005", driverName: "Rakesh Joshi", area: "Sector 5 - Nikol", status: "On Route", lat: 23.0300, lng: 72.6500 },
  ]);
  console.log("✅ Trucks seeded!");
  process.exit();
}
seed();