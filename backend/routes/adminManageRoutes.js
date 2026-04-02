const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  addAdmin,
  deleteAdmin,
  resetPassword,
} = require("../controllers/adminManageController");

const adminAuth = require("../middleware/adminAuth");

router.get("/", adminAuth, getAllAdmins);
router.post("/", adminAuth, addAdmin);
router.delete("/:id", adminAuth, deleteAdmin);
router.put("/:id/reset-password", adminAuth, resetPassword);

module.exports = router;