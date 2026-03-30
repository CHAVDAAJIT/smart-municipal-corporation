const express = require("express");
const router = express.Router();
const {
  getAllCitizens,
  getCitizenById,
  toggleBlock,
  deleteCitizen,
} = require("../controllers/citizenController");

const adminAuth = require("../middleware/adminAuth");

router.get("/", adminAuth, getAllCitizens);
router.get("/:id", adminAuth, getCitizenById);
router.put("/:id/toggle-block", adminAuth, toggleBlock);
router.delete("/:id", adminAuth, deleteCitizen);

module.exports = router;