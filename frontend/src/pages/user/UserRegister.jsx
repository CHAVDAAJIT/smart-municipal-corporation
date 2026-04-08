import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/UserAuth.css";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
//const BASE_URL = import.meta.env.BACKEND_URI;

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
  const [step, setStep] = useState(1); // 1=register, 2=otp
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "",
  });
  const [captcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 min
  const [, setTimerActive] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startTimer = () => {
    setTimer(600);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      setMessage("Invalid captcha");
      return;
    }
    setLoading(true);
    try {
       await axios.post(`${BASE_URL}/auth/register/user`, form);
      setRegisteredEmail(form.email);
      setStep(2);
      startTimer();
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpMsg("Please enter complete OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        email: registeredEmail,
        otp: otpValue
      });
      localStorage.setItem("userToken", res.data.token);
      navigate("/user/dashboard");
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/resend-otp`, { email: registeredEmail });
      setOtpMsg("✅ OTP resent successfully!");
      startTimer();
    } catch (err) {
      setOtpMsg("Failed to resend OTP");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
          <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
        </div>

        {/* ===== STEP 1 — REGISTER ===== */}
        {step === 1 && (
          <>
            <h2>Citizen Registration</h2>

            <form onSubmit={handleRegister}>
              <input name="name" placeholder="Full Name" onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              <input name="mobile" placeholder="Mobile" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

              <div className="captcha-row">
                <div className="captcha-box">{captcha}</div>
                <input
                  placeholder="Enter Captcha"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Register & Get OTP"}
              </button>
            </form>

            {message && <p className="message" style={{ color: "#e63946" }}>{message}</p>}

            <p className="link-text">
              Already registered? <Link to="/user/login">Login</Link>
            </p>
          </>
        )}

        {/* ===== STEP 2 — OTP VERIFICATION ===== */}
        {step === 2 && (
          <>
            <button className="back-btn" onClick={() => setStep(1)}>
              ← Back
            </button>

            <h2>Verify Email</h2>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
              OTP sent to <strong>{registeredEmail}</strong>
            </p>

            {/* OTP Inputs */}
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="otp-input"
                />
              ))}
            </div>

            {/* Timer */}
            <p className="otp-timer">
              {timer > 0
                ? <>OTP expires in <span>{formatTimer(timer)}</span></>
                : "OTP expired!"}
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: "#0f4c75", color: "white",
                border: "none", borderRadius: "8px",
                fontSize: "15px", fontWeight: "600",
                cursor: "pointer", marginBottom: "12px"
              }}
            >
              {loading ? "Verifying..." : "✅ Verify OTP"}
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                className="resend-btn"
                onClick={handleResendOtp}
                disabled={timer > 0}
              >
                {timer > 0 ? `Resend in ${formatTimer(timer)}` : "Resend OTP"}
              </button>
            </div>

            {otpMsg && (
              <p className="message" style={{
                color: otpMsg.includes("✅") ? "#059669" : "#e63946",
                textAlign: "center", marginTop: "10px"
              }}>
                {otpMsg}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserRegister;