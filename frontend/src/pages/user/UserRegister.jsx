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

function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [captcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      setMessage("Invalid captcha");
      return;
    }

    try {
      await API.post("/auth/register/user", form);
      navigate("/user/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>Citizen Registration</h2>

        <form onSubmit={handleRegister}>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <div className="captcha-row">
            <div className="captcha-box">{captcha}</div>
            <input
              placeholder="Enter Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>

        <p className="message">{message}</p>

        <p className="link-text">
          Already registered? <Link to="/user/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default UserRegister;
