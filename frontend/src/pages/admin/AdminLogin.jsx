import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AdminLogin.css";



function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

function AdminLogin() {
  // ✅ STATES (IMPORTANT)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (captchaInput !== captcha) {
    alert("Invalid Captcha");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/admin/login",
      {
        email: email,
        password: password,
      }
    );

    localStorage.setItem("adminToken", res.data.token);
    alert("Admin Login Successful");

    // ✅ PROPER REDIRECT
    navigate("/admin/dashboard");

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p className="sub-text">Authorized access only</p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* CAPTCHA */}
          <div className="captcha-row">
            <div className="captcha-box">{captcha}</div>
            <input
              type="text"
              placeholder="Enter Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login as Admin</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
