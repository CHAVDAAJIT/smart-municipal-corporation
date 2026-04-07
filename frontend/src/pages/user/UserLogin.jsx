import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/UserAuth.css";

const BASE_URL = "http://localhost:5000/api";

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
  const [mode, setMode] = useState("login"); // login | forgot | otp | reset
  const [form, setForm] = useState({ email: "", password: "" });
  const [captcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(600);
  const [, setTimerActive] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");

  // OTP verification for unverified users
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyOtp, setVerifyOtp] = useState(["", "", "", "", "", ""]);

  const startTimer = () => {
    setTimer(600);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setTimerActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      setMessage("Invalid captcha");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login/user`, {
        email: form.email,
        password: form.password,
        captcha: captchaInput,
        captchaText: captcha,
      });
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/user/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.requiresVerification) {
        setVerifyEmail(data.email);
        setMode("verify");
        startTimer();
      } else {
        setMessage(data?.message || "Login failed");
      }
    }
    setLoading(false);
  };

  // Forgot password — send OTP
  const handleForgotOtp = async () => {
    if (!forgotEmail) { setOtpMsg("Please enter email"); return; }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, { email: forgotEmail });
      setMode("otp");
      startTimer();
      setOtpMsg("");
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Failed");
    }
    setLoading(false);
  };

  // OTP input handler
  const handleOtpChange = (otpArr, setOtpArr, index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otpArr];
    newOtp[index] = value;
    setOtpArr(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-forgot-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (prefix, otpArr, index, e) => {
    if (e.key === "Backspace" && !otpArr[index] && index > 0) {
      document.getElementById(`${prefix}-${index - 1}`)?.focus();
    }
  };

  // Verify forgot OTP
  const handleVerifyForgotOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) { setOtpMsg("Enter complete OTP"); return; }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/verify-forgot-otp`, {
        email: forgotEmail, otp: otpValue
      });
      setMode("reset");
      setOtpMsg("");
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // Reset password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setOtpMsg("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setOtpMsg("Min 6 characters required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/reset-password`, {
        email: forgotEmail,
        otp: otp.join(""),
        newPassword
      });
      setMode("login");
      setMessage("✅ Password reset! Please login.");
      setOtpMsg("");
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Reset failed");
    }
    setLoading(false);
  };

  // Verify unverified user OTP
  const handleVerifyUserOtp = async () => {
    const otpValue = verifyOtp.join("");
    if (otpValue.length !== 6) return;
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        email: verifyEmail, otp: otpValue
      });
      localStorage.setItem("userToken", res.data.token);
      navigate("/user/dashboard");
    } catch (err) {
      setOtpMsg(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">

        {/* ===== LOGIN ===== */}
        {mode === "login" && (
          <>
            <h2>Citizen Login</h2>

            {message && (
              <p style={{
                color: message.includes("✅") ? "#059669" : "#e63946",
                fontSize: "13px", textAlign: "center", marginBottom: "12px"
              }}>
                {message}
              </p>
            )}

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />

              {/* Forgot Password Link */}
              <div className="forgot-link">
                <button type="button" onClick={() => setMode("forgot")}>
                  Forgot Password?
                </button>
              </div>

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
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="link-text">
              New user? <Link to="/user/register">Register</Link>
            </p>
          </>
        )}

        {/* ===== FORGOT PASSWORD ===== */}
        {mode === "forgot" && (
          <>
            <button className="back-btn" onClick={() => { setMode("login"); setOtpMsg(""); }}>
              ← Back to Login
            </button>
            <h2>Forgot Password</h2>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              Enter your registered email to receive OTP
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "12px" }}
            />
            {otpMsg && <p style={{ color: "#e63946", fontSize: "13px", marginBottom: "10px" }}>{otpMsg}</p>}
            <button
              onClick={handleForgotOtp}
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#0f4c75", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              {loading ? "Sending..." : "📧 Send OTP"}
            </button>
          </>
        )}

        {/* ===== OTP VERIFY (FORGOT) ===== */}
        {mode === "otp" && (
          <>
            <button className="back-btn" onClick={() => { setMode("forgot"); setOtpMsg(""); }}>
              ← Back
            </button>
            <h2>Enter OTP</h2>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
              OTP sent to <strong>{forgotEmail}</strong>
            </p>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-forgot-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(otp, setOtp, index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown("otp-forgot", otp, index, e)}
                  className="otp-input"
                />
              ))}
            </div>

            <p className="otp-timer">
              {timer > 0 ? <>Expires in <span>{formatTimer(timer)}</span></> : "OTP expired!"}
            </p>

            {otpMsg && <p style={{ color: otpMsg.includes("✅") ? "#059669" : "#e63946", fontSize: "13px", textAlign: "center" }}>{otpMsg}</p>}

            <button
              onClick={handleVerifyForgotOtp}
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#0f4c75", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "10px" }}
            >
              {loading ? "Verifying..." : "✅ Verify OTP"}
            </button>

            <div style={{ textAlign: "center" }}>
              <button className="resend-btn" onClick={handleForgotOtp} disabled={timer > 0}>
                {timer > 0 ? `Resend in ${formatTimer(timer)}` : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {/* ===== RESET PASSWORD ===== */}
        {mode === "reset" && (
          <>
            <h2>Reset Password</h2>
            <div className="success-box">
              <p>✅ OTP Verified! Set your new password.</p>
            </div>

            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "10px" }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", outline: "none", marginBottom: "12px" }}
            />

            {otpMsg && <p style={{ color: "#e63946", fontSize: "13px", marginBottom: "10px" }}>{otpMsg}</p>}

            <button
              onClick={handleResetPassword}
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#059669", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              {loading ? "Resetting..." : "🔐 Reset Password"}
            </button>
          </>
        )}

        {/* ===== VERIFY EMAIL (Unverified user) ===== */}
        {mode === "verify" && (
          <>
            <h2>Verify Email</h2>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
              OTP sent to <strong>{verifyEmail}</strong>
            </p>

            <div className="otp-inputs">
              {verifyOtp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-verify-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(verifyOtp, setVerifyOtp, index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown("otp-verify", verifyOtp, index, e)}
                  className="otp-input"
                />
              ))}
            </div>

            <p className="otp-timer">
              {timer > 0 ? <>Expires in <span>{formatTimer(timer)}</span></> : "OTP expired!"}
            </p>

            {otpMsg && <p style={{ color: "#e63946", fontSize: "13px", textAlign: "center" }}>{otpMsg}</p>}

            <button
              onClick={handleVerifyUserOtp}
              style={{ width: "100%", padding: "12px", background: "#0f4c75", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
            >
              ✅ Verify & Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default UserLogin;