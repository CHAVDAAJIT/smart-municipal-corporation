import { useState } from "react";
import API from "../../services/api";

function AdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    captcha: ""
  });

  const [captchaText] = useState("ADMIN9"); // demo captcha
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login/admin", {
        ...form,
        captchaText
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <p>Captcha: <b>{captchaText}</b></p>

        <input
          name="captcha"
          placeholder="Enter Captcha"
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default AdminLogin;
