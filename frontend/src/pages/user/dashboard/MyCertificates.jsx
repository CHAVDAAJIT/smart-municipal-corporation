import { useEffect, useState } from "react";
import { getDocuments } from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/MyCertificates.css";
import "../../../styles/UserDashboard.css";

function MyCertificates() {
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState("All");

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const data = await getDocuments(token);
      setDocs(data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = filter === "All"
    ? docs
    : docs.filter(d => d.status === filter);

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="dashboard-home">
          <h2>🏅 My Certificates</h2>
          <p className="sub-text">Track your certificate requests</p>

          {/* Filter Tabs */}
          <div className="mycert-filter-tabs">
            {["All", "Pending", "Approved", "Rejected"].map(tab => (
              <button
                key={tab}
                className={`mycert-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="mycert-tab-count">
                  {tab === "All"
                    ? docs.length
                    : docs.filter(d => d.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="mycert-empty">
              No certificate requests found
            </div>
          ) : (
            <div className="mycert-list">
              {filtered.map((doc, index) => (
                <div key={doc._id} className="mycert-card">

                  {/* Left */}
                  <div className="mycert-card-left">
                    <div className="mycert-icon">
                      {doc.type === "birth" && "🍼"}
                      {doc.type === "death" && "🕊️"}
                      {doc.type === "income" && "💼"}
                    </div>
                    <div>
                      <h4 className="mycert-title">
                        {doc.type === "birth" && "Birth Certificate"}
                        {doc.type === "death" && "Death Certificate"}
                        {doc.type === "income" && "Income Certificate"}
                      </h4>
                      <p className="mycert-date">
                        📅 Applied: {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <span className={`mycert-status ${doc.status.toLowerCase()}`}>
                    {doc.status === "Pending" && "⏳ Pending"}
                    {doc.status === "Approved" && "✅ Approved"}
                    {doc.status === "Rejected" && "❌ Rejected"}
                  </span>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCertificates;