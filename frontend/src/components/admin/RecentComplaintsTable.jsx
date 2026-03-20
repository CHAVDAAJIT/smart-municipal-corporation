import { useEffect, useState } from "react";
import API from "../../services/apiAdmin";
import "../../styles/AdminDashboard.css";

function RecentComplaintsTable() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchRecentComplaints();
  }, []);

  const fetchRecentComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      // latest 5 complaints only
      setComplaints(res.data.slice(0, 5));
    } catch (err) {
      console.log("Admin recent complaints error:", err);
    }
  };

  return (
    <div className="recent-complaints">
      <h3>Recent Complaints</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Citizen</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No complaints found
              </td>
            </tr>
          ) : (
            complaints.map((c) => (
              <tr key={c._id}>
                <td>#{c._id.slice(-6)}</td>
                <td>{c.user?.name || "Citizen"}</td>
                <td>{c.type}</td>
                <td className={`status ${c.status.toLowerCase()}`}>
                  {c.status}
                </td>
                <td>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentComplaintsTable;
