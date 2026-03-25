import React, { useState } from "react";
import { createDocument } from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Documents.css";
import "../../../styles/UserDashboard.css";

const Documents = () => {
  const [type, setType] = useState("");
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);

  const token = localStorage.getItem("userToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!type) {
      alert("Please select certificate type");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("data", JSON.stringify(form));
    formData.append("address", form.address || "");

    files.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const result = await createDocument(formData, token);
      if (result && result._id) {
        alert("✅ Submitted Successfully!");
        setType("");
        setForm({});
        setFiles([]);
      } else {
        alert("❌ " + (result?.message || "Submission failed"));
      }
    } catch (err) {
      alert("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="dashboard-home">
          <div className="doc-center">
            <div className="doc-card">
              <h2>📄 Apply for Certificate</h2>
              <p className="subtitle">Select a certificate type to begin</p>

              {/* ✅ Card Selection */}
              {!type && (
                <div className="cert-type-grid">
                  <div className="cert-type-card" onClick={() => setType("birth")}>
                    <span className="cert-type-icon">🍼</span>
                    <div>
                      <h4>Birth Certificate</h4>
                      <p>Apply for newborn registration</p>
                    </div>
                  </div>
                  <div className="cert-type-card" onClick={() => setType("death")}>
                    <span className="cert-type-icon">🕊️</span>
                    <div>
                      <h4>Death Certificate</h4>
                      <p>Register death of a person</p>
                    </div>
                  </div>
                  <div className="cert-type-card" onClick={() => setType("income")}>
                    <span className="cert-type-icon">💼</span>
                    <div>
                      <h4>Income Certificate</h4>
                      <p>Apply for income proof</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Selected Type Badge */}
              {type && (
                <div className="cert-selected-type">
                  <span>
                    {type === "birth" && "🍼 Birth Certificate"}
                    {type === "death" && "🕊️ Death Certificate"}
                    {type === "income" && "💼 Income Certificate"}
                  </span>
                  <button className="cert-change-btn" onClick={() => { setType(""); setForm({}); }}>
                    Change
                  </button>
                </div>
              )}

              {/* Birth */}
              {type === "birth" && (
                <>
                  <p className="doc-section-title">👶 Child Details</p>
                  <input name="childName" placeholder="Child Name" onChange={handleChange} />
                  <input type="date" name="dob" onChange={handleChange} />
                  <input name="timeOfBirth" placeholder="Time of Birth" onChange={handleChange} />
                  <p className="doc-section-title">👨‍👩‍👧 Parent Details</p>
                  <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
                  <input name="motherName" placeholder="Mother Name" onChange={handleChange} />
                  <p className="doc-section-title">🏥 Hospital Details</p>
                  <input name="hospitalName" placeholder="Hospital Name" onChange={handleChange} />
                  <input name="hospitalAddress" placeholder="Hospital Address" onChange={handleChange} />
                  <input name="address" placeholder="Home Address" onChange={handleChange} />
                </>
              )}

              {/* Death */}
              {type === "death" && (
                <>
                  <p className="doc-section-title">💐 Deceased Details</p>
                  <input name="personName" placeholder="Person Name" onChange={handleChange} />
                  <input type="date" name="dateOfDeath" onChange={handleChange} />
                  <input name="causeOfDeath" placeholder="Cause of Death" onChange={handleChange} />
                  <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
                  <input name="address" placeholder="Address" onChange={handleChange} />
                </>
              )}

              {/* Income */}
              {type === "income" && (
                <>
                  <p className="doc-section-title">👤 Personal Details</p>
                  <input name="fullName" placeholder="Full Name" onChange={handleChange} />
                  <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
                  <p className="doc-section-title">💼 Income Details</p>
                  <input name="occupation" placeholder="Occupation" onChange={handleChange} />
                  <input name="income" placeholder="Annual Income" onChange={handleChange} />
                  <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} />
                  <input name="address" placeholder="Address" onChange={handleChange} />
                </>
              )}

              {/* Upload & Submit */}
              {type && (
                <>
                  <p className="doc-section-title">📎 Upload Documents</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles([...e.target.files])}
                  />
                  <button onClick={handleSubmit}>Submit Request</button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;