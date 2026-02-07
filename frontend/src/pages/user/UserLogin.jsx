import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import "../../styles/UserAuth.css";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 5; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text;
}

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaText] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // ❌ CAPTCHA FRONTEND CHECK
    if (captchaInput !== captchaText) {
      setMessage("Invalid captcha");
      return;
    }

    try {
      const res = await API.post("/auth/login/user", {
        email,
        password,
      });

      // ✅ SAVE JWT
      localStorage.setItem("userToken", res.data.token);
      navigate("/user/dashboard");

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>Citizen Login</h2>
        <p className="sub-text">Access city services</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* CAPTCHA */}
          <div className="captcha-row">
            <div className="captcha-box">{captchaText}</div>
            <input
              placeholder="Enter Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="message">{message}</p>

        <p className="link-text">
          New Citizen? <Link to="/user/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
