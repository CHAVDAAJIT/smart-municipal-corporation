import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/apiUser";
import "../../styles/GlobalSearch.css";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults(null); return; }
    const timer = setTimeout(() => search(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const search = async (q) => {
    setLoading(true);
    try {
      const [complaintsRes, certsRes, waterRes] = await Promise.all([
        API.get("/complaints/my"),
        API.get("/documents"),
        API.get("/water/my"),
      ]);

      const lower = q.toLowerCase();

      const complaints = complaintsRes.data.filter(c =>
        c.type?.toLowerCase().includes(lower) ||
        c.area?.toLowerCase().includes(lower) ||
        c.description?.toLowerCase().includes(lower)
      ).slice(0, 3);

      const certs = (certsRes.data || []).filter(d =>
        d.type?.toLowerCase().includes(lower)
      ).slice(0, 3);

      const water = (waterRes.data || []).filter(w =>
        w.area?.toLowerCase().includes(lower) ||
        w.type?.toLowerCase().includes(lower)
      ).slice(0, 3);

      setResults({ complaints, certs, water });
      setIsOpen(true);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const totalResults = results
    ? (results.complaints.length + results.certs.length + results.water.length)
    : 0;

  return (
    <div className="global-search" ref={ref}>
      <div className="global-search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="global-search-input"
          placeholder="Search complaints, certificates..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {loading && <span className="search-loading">⏳</span>}
        {query && (
          <button
            className="search-clear"
            onClick={() => { setQuery(""); setResults(null); }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results && (
        <div className="search-results">
          {totalResults === 0 ? (
            <div className="search-empty">No results for "{query}"</div>
          ) : (
            <>
              {/* Complaints */}
              {results.complaints.length > 0 && (
                <div className="search-section">
                  <p className="search-section-title">📋 Complaints</p>
                  {results.complaints.map(c => (
                    <div
                      key={c._id}
                      className="search-result-item"
                      onClick={() => { navigate("/user/complaints"); setIsOpen(false); setQuery(""); }}
                    >
                      <span className="search-result-icon">📋</span>
                      <div>
                        <p className="search-result-title">{c.type} — {c.area}</p>
                        <p className="search-result-sub">{c.status} • {new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certificates */}
              {results.certs.length > 0 && (
                <div className="search-section">
                  <p className="search-section-title">📄 Certificates</p>
                  {results.certs.map(d => (
                    <div
                      key={d._id}
                      className="search-result-item"
                      onClick={() => { navigate("/user/my-certificates"); setIsOpen(false); setQuery(""); }}
                    >
                      <span className="search-result-icon">📄</span>
                      <div>
                        <p className="search-result-title">{d.type} Certificate</p>
                        <p className="search-result-sub">{d.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Water */}
              {results.water.length > 0 && (
                <div className="search-section">
                  <p className="search-section-title">💧 Water Requests</p>
                  {results.water.map(w => (
                    <div
                      key={w._id}
                      className="search-result-item"
                      onClick={() => { navigate("/user/water"); setIsOpen(false); setQuery(""); }}
                    >
                      <span className="search-result-icon">💧</span>
                      <div>
                        <p className="search-result-title">{w.type} — {w.area}</p>
                        <p className="search-result-sub">{w.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;