const express = require("express");
const router = express.Router();

const {
  userRegister,
  userLogin,
  adminLogin
} = require("../controllers/authController");

router.post("/register/user", userRegister);
router.post("/login/user", userLogin);
router.post("/login/admin", adminLogin);

module.exports = router;
