import { useState } from "react";
import API from "../../services/api";

function UserLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    captcha: ""
  });

  
  const [captchaText] = useState(Math.random().toString(36).substring(2, 8));
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login/user", {
        ...form,
        captchaText
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>User Login</h2>

      <form onSubmit={handleLogin}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <p>Captcha: <b>{captchaText}</b></p>
        <input name="captcha" placeholder="Enter Captcha" onChange={handleChange} />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default UserLogin;
