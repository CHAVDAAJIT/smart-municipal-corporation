const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

function isStrongPassword(password) {
  const regex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
  return regex.test(password);
}

//User ragistration
exports.userRegister = async (req, res) => {
  const { name, email, mobile, password, captcha, captchaText } = req.body;

  if (!email || !mobile)
    return res.status(400).json({ message: "Email & Mobile required" });

  if (captcha !== captchaText)
    return res.status(400).json({ message: "Invalid captcha" });

  if (!isStrongPassword(password))
    return res.status(400).json({ message: "Weak password" });

  const existing = await User.findOne({ $or: [{ email }, { mobile }] });
  if (existing)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ name, email, mobile, password: hashed });

  res.json({ message: "User registered successfully" });
};


//User login
exports.userLogin = async (req, res) => {
  const { email, password, captcha, captchaText } = req.body;

  if (captcha !== captchaText)
    return res.status(400).json({ message: "Invalid captcha" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Wrong password" });

  res.json({ message: "User login success", user });
};


//admin login
// exports.adminLogin = async (req, res) => {
//   const { email, password, captcha, captchaText } = req.body;

//   if (captcha !== captchaText)
//     return res.status(400).json({ message: "Invalid captcha" });

//   const admin = await Admin.findOne({ email });
//   if (!admin)
//     return res.status(404).json({ message: "Admin not found" });

//   const match = await bcrypt.compare(password, admin.password);
//   if (!match)
//     return res.status(401).json({ message: "Wrong password" });

//   res.json({ message: "Admin login success", admin });
// };


// //