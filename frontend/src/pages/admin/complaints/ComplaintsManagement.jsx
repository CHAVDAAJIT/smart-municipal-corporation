import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/apiAdmin";
import "../../../styles/AdminDashboard.css";

function ComplaintsManagement() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate(); // ✅ STEP 5

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 🔹 Get all complaints (ADMIN)
  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/all");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Assign department
  const assignDepartment = async (id, department) => {
    try {
      await API.put(`/complaints/assign/${id}`, { department });
      fetchComplaints();
    } catch (err) {
      alert("Failed to assign department");
    }
  };

  // 🔹 Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/complaints/status/${id}`, { status });
      fetchComplaints();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-dashboard-home">
      <h2>Complaint Management</h2>
      <p className="sub-text">All citizen complaints</p>

      <div className="recent-complaints">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Citizen</th>
              <th>Type</th>
              <th>Area</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                {/* ✅ CLICKABLE ID → DETAIL PAGE */}
                <td
                  style={{
                    cursor: "pointer",
                    color: "#0f4c75",
                    fontWeight: "600"
                  }}
                  onClick={() =>
                    navigate(`/admin/complaints/${c._id}`)
                  }
                >
                  {c._id.slice(-6)}
                </td>

                <td>{c.user?.name}</td>
                <td>{c.type}</td>
                <td>{c.area}</td>

                {/* Assign department */}
                <td>
                  <select
                    value={c.department || ""}
                    onChange={(e) =>
                      assignDepartment(c._id, e.target.value)
                    }
                  >
                    <option value="">Assign</option>
                    <option value="Garbage Dept">Garbage Dept</option>
                    <option value="Water Dept">Water Dept</option>
                    <option value="Electric Dept">Electric Dept</option>
                    <option value="Road Dept">Road Dept</option>
                  </select>
                </td>

                {/* Update status */}
                <td>
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateStatus(c._id, e.target.value)
                    }
                    className={`status ${c.status.toLowerCase()}`}
                  >
                    <option>Pending</option>
                    <option>Assigned</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComplaintsManagement;
