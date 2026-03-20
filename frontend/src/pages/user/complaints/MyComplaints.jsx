import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import "../../../styles/Complaint.css";

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
    <div className="complaint-page">
      <div className="complaint-card wide">
        <h2>My Complaints</h2>
        <p className="sub-text">Track your complaint status</p>

        <table className="complaint-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Area</th>
              <th>Status</th>
              <th>Department</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.type}</td>
                <td>{c.area}</td>
                <td>
                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>{c.department || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyComplaints;
