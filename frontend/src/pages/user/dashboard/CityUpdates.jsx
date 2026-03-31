import { useEffect, useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/CityUpdates.css";
import "../../../styles/UserDashboard.css";

const categories = ["All", "General", "Road", "Water", "Park", "Event", "Infrastructure"];

function CityUpdates() {
  const [updates, setUpdates] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await API.get("/city-updates");
      setUpdates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoryClass = (cat) => cat.toLowerCase();

  // Filter + Search + Sort
  let filtered = updates;

  if (filter !== "All") {
    filtered = filtered.filter(u => u.category === filter);
  }

  if (search.trim()) {
    filtered = filtered.filter(u =>
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sort === "newest") {
    filtered = [...filtered].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else {
    filtered = [...filtered].sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="cityupdate-page">
          <h2>🏙️ City Updates</h2>
          <p className="sub-text" style={{ marginBottom: "20px" }}>
            Latest news and updates from Smart Municipal Corporation
          </p>

          {/* Search + Sort */}
          <div className="cityupdate-toolbar">
            <input
              className="cityupdate-search"
              placeholder="🔍 Search updates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="cityupdate-sort"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">📅 Newest First</option>
              <option value="oldest">📅 Oldest First</option>
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="cityupdate-filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cityupdate-tab ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="cityupdate-grid">
            {filtered.length === 0 ? (
              <div className="cityupdate-empty">
                No updates found
              </div>
            ) : (
              filtered.map(u => (
                <div key={u._id} className="cityupdate-card">
                  <div className={`cityupdate-card-banner ${getCategoryClass(u.category)}`} />
                  <div className="cityupdate-card-body">
                    <div className="cityupdate-card-top">
                      <span className={`cityupdate-category ${getCategoryClass(u.category)}`}>
                        {u.category}
                      </span>
                      <span className="cityupdate-date">
                        📅 {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <h4 className="cityupdate-card-title">{u.title}</h4>
                    <p className="cityupdate-card-desc">{u.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityUpdates;