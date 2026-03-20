import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/apiUser";
import "../../../styles/Complaint.css";

function RegisterComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    description: "",
    area: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/complaints", form);
      setMessage(res.data.message);

      // ⏳ Small delay for UX
      setTimeout(() => {
        navigate("/user/complaints");
      }, 1200);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting complaint");
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-card">
        <h2>Register Complaint</h2>
        <p className="sub-text">Submit your issue</p>

        <form onSubmit={handleSubmit}>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Complaint Type</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
            <option value="Street Light">Street Light</option>
            <option value="Road">Road</option>
          </select>

          <input
            name="area"
            placeholder="Area / Ward"
            value={form.area}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Describe your complaint"
            value={form.description}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit Complaint</button>
        </form>

        {message && <p className="success-text">{message}</p>}
      </div>
    </div>
  );
}

export default RegisterComplaint;
