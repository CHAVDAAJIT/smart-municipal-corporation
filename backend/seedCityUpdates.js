require("dotenv").config();
const mongoose = require("mongoose");
const CityUpdate = require("./models/cityUpdate");

mongoose.connect("mongodb://127.0.0.1:27017/smartMunicipal");

async function seed() {
  await CityUpdate.deleteMany();
  await CityUpdate.create([
    {
      title: "New Flyover Construction Begins at Maninagar",
      description: "The Smart Municipal Corporation has begun construction of a new flyover at Maninagar junction. The project is expected to reduce traffic congestion by 40%. Work will be completed by December 2026. Citizens are requested to use alternate routes during construction.",
      category: "Road",
      isActive: true
    },
    {
      title: "Sabarmati Riverfront Park Extension Inaugurated",
      description: "A 2km extension of the Sabarmati Riverfront Park has been inaugurated by the Mayor. The new section includes jogging tracks, children's play areas, and open-air seating. The park is open from 5 AM to 10 PM daily for citizens.",
      category: "Park",
      isActive: true
    },
    {
      title: "Smart Water Meters Installed in Satellite Zone",
      description: "As part of the Smart City initiative, digital water meters have been installed across 5000 households in the Satellite zone. Citizens can now track their water usage online through the Smart Municipal portal.",
      category: "Water",
      isActive: true
    },
    {
      title: "Annual City Marathon - Register Now!",
      description: "The Smart Municipal Corporation is organizing the Annual City Marathon on 15th April 2026. Categories include 5KM, 10KM, and 21KM runs. Registration is open on the portal. Winners will receive cash prizes and certificates.",
      category: "Event",
      isActive: true
    },
    {
      title: "New Solar Street Lights Installed in 12 Wards",
      description: "Over 500 solar-powered LED street lights have been installed across 12 municipal wards as part of the green energy initiative. This is expected to save ₹15 lakh annually in electricity costs.",
      category: "Infrastructure",
      isActive: true
    },
  ]);
  console.log("✅ City Updates seeded!");
  process.exit();
}
seed();