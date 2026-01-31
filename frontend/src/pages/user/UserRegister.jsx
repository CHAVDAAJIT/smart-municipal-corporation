import { useState } from "react";
import API from "../../services/api";

function UserRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    captcha: ""
  });

  const [captchaText] = useState("AB12"); // demo
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register/user", {
        ...form,
        captchaText
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <p>Captcha: <b>{captchaText}</b></p>
        <input name="captcha" placeholder="Enter Captcha" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default UserRegister;
