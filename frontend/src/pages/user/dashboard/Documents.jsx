import React, { useState } from "react";
import { createDocument } from "../../../services/apiUser";
import "../../../styles/Documents.css";

const Documents = () => {
  const [type, setType] = useState("");
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);

 const token = localStorage.getItem("userToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  // Validation
  if (!type) {
    alert("Please select certificate type");
    return;
  }

  const formData = new FormData();
  formData.append("type", type);
  formData.append("data", JSON.stringify(form));
  formData.append("address", form.address || ""); // ✅ address fix

  files.forEach((file) => {
    formData.append("documents", file);
  });

  try {
    const result = await createDocument(formData, token);
    
    if (result && result._id) {
      alert("✅ Submitted Successfully!");
      // Form reset
      setType("");
      setForm({});
      setFiles([]);
    } else {
      alert("❌ Submission failed: " + (result?.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("❌ Server error. Please try again.");
  }
};

  return (
    <div className="doc-page">
      <div className="doc-card">
        <h2>📄 Apply for Certificate</h2>
        <p className="subtitle">Fill details to request certificate</p>

        {/* Select Type */}
        <select onChange={(e) => setType(e.target.value)}>
          <option value="">Select Certificate Type</option>
          <option value="birth">Birth Certificate</option>
          <option value="death">Death Certificate</option>
          <option value="income">Income Certificate</option>
        </select>

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

        {/* Upload */}
        {type && (
          <>
            <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
            <button onClick={handleSubmit}>Submit Request</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Documents;