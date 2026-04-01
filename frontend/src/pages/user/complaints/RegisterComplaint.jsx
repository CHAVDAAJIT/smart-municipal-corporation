import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Complaint.css";
import "../../../styles/UserDashboard.css";

function RegisterComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: "", description: "", area: "" });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotos = (e) => {
    const files = [...e.target.files];
    setPhotos(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("description", form.description);
      formData.append("area", form.area);
      photos.forEach(p => formData.append("photos", p));

      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessage("✅ " + data.message + " (+10 points earned!)");
      setTimeout(() => navigate("/user/complaints"), 1500);
    } catch (err) {
      setMessage("❌ Error submitting complaint");
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="dashboard-home">
          <div className="complaint-center">
            <div className="complaint-card">
              <h2>Register Complaint</h2>
              <p className="sub-text">Submit your issue • Earn 10 points! ⭐</p>

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

                {/* ✅ Photo Upload */}
                <div className="complaint-photo-upload">
                  <label>📸 Add Photos (max 3)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotos}
                  />
                </div>

                {/* Photo Previews */}
                {previews.length > 0 && (
                  <div className="complaint-photo-previews">
                    {previews.map((p, i) => (
                      <img key={i} src={p} alt={`preview-${i}`} />
                    ))}
                  </div>
                )}

                <button type="submit">Submit Complaint</button>
              </form>

              {message && <p className="success-text">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterComplaint;