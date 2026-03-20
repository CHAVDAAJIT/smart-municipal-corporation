import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/apiAdmin";
import "../../../styles/AdminDashboard.css";

function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);

  const fetchComplaint = useCallback(async () => {
    try {
      const res = await API.get(`/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      alert("Failed to load complaint");
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const assignDepartment = async (dept) => {
    await API.put(`/complaints/assign/${id}`, { department: dept });
    fetchComplaint();
  };

  const updateStatus = async (status) => {
    await API.put(`/complaints/status/${id}`, { status });
    fetchComplaint();
  };

  if (!complaint) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard-home">
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2>Complaint Detail</h2>

      <div className="complaint-detail-card">
        <p><b>Citizen:</b> {complaint.user?.name}</p>
        <p><b>Email:</b> {complaint.user?.email}</p>
        <p><b>Type:</b> {complaint.type}</p>
        <p><b>Area:</b> {complaint.area}</p>
        <p><b>Description:</b> {complaint.description}</p>

        <hr />

        <label>Assign Department</label>
        <select
          value={complaint.department || ""}
          onChange={(e) => assignDepartment(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Garbage Dept">Garbage Dept</option>
          <option value="Water Dept">Water Dept</option>
          <option value="Electric Dept">Electric Dept</option>
        </select>

        <label>Status</label>
        <select
          value={complaint.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>Assigned</option>
          <option>Resolved</option>
        </select>
      </div>
    </div>
  );
}

export default ComplaintDetail;
