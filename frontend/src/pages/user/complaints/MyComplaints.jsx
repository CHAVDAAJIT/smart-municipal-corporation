import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/Complaint.css";
import "../../../styles/UserDashboard.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="dashboard-home">
          <h2>My Complaints</h2>
          <p className="sub-text">Track your complaint status</p>

          <div className="complaint-card wide">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Area</th>
                  <th>Description</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  complaints.map((c, index) => (
                    <tr key={c._id}>
                      <td>{index + 1}</td>
                      <td>{c.type}</td>
                      <td>{c.area}</td>
                      <td>{c.description}</td>
                      <td>{c.department || "-"}</td>
                      <td>
                        <span className={`status ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyComplaints;