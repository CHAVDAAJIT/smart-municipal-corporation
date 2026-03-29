import { useState } from "react";
import API from "../../../services/apiUser";
import DashboardSidebar from "../../../components/user/DashboardSidebar";
import DashboardHeader from "../../../components/user/DashboardHeader";
import "../../../styles/PropertyTax.css";
import "../../../styles/UserDashboard.css";

function PropertyTax() {
  const [propertyId, setPropertyId] = useState("");
  const [property, setProperty] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const searchProperty = async () => {
    if (!propertyId.trim()) return;
    setNotFound(false);
    setProperty(null);
    setReceipt(null);
    try {
      const res = await API.get(`/property/search/${propertyId.trim()}`);
      setProperty(res.data);
    } catch (err) {
      setNotFound(true);
    }
  };

  const handlePay = async () => {
    if (!property) return;
    setPaying(true);
    try {
      const res = await API.post("/property/pay", {
        propertyId: property.propertyId,
        amount: property.taxAmount,
        method: "Online"
      });
      setReceipt(res.data.receiptNo);
      setProperty(res.data.property);
      alert(`✅ Payment Successful!\nReceipt No: ${res.data.receiptNo}`);
    } catch (err) {
      alert("❌ Payment failed");
    }
    setPaying(false);
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardHeader />

        <div className="property-page">
          <h2>🏠 Property Tax</h2>
          <p className="sub-text" style={{ marginBottom: "20px" }}>
            Search your property and pay tax online
          </p>

          {/* Search */}
          <div className="property-search-card">
            <h3>🔍 Search Property by ID</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
              Enter your Property ID (e.g. PROP-001) to view details and pay tax
            </p>
            <div className="property-search-row">
              <input
                placeholder="Enter Property ID (e.g. PROP-001)"
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchProperty()}
              />
              <button
                className="property-search-btn"
                onClick={searchProperty}
              >
                🔍 Search
              </button>
            </div>
            {notFound && (
              <div className="property-not-found">
                ❌ Property not found. Please check the ID and try again.
              </div>
            )}
          </div>

          {/* Property Details */}
          {property && (
            <>
              <div className="property-detail-card">
                <div className="property-detail-header">
                  <div>
                    <h3>{property.owner}</h3>
                    <p>Property ID: {property.propertyId}</p>
                  </div>
                  <span className={`property-status-badge ${property.paymentStatus.toLowerCase()}`}>
                    {property.paymentStatus === "Paid" ? "✅ Paid" :
                     property.paymentStatus === "Unpaid" ? "❌ Unpaid" : "⚠️ Partial"}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="property-info-grid">
                  <div className="property-info-item">
                    <p className="property-info-label">Address</p>
                    <p className="property-info-value">{property.address}</p>
                  </div>
                  <div className="property-info-item">
                    <p className="property-info-label">Area</p>
                    <p className="property-info-value">{property.area}</p>
                  </div>
                  <div className="property-info-item">
                    <p className="property-info-label">Property Type</p>
                    <p className="property-info-value">{property.propertyType}</p>
                  </div>
                  <div className="property-info-item">
                    <p className="property-info-label">Size</p>
                    <p className="property-info-value">{property.sizeSqft} sq.ft</p>
                  </div>
                  <div className="property-info-item">
                    <p className="property-info-label">Due Date</p>
                    <p className="property-info-value">{property.dueDate}</p>
                  </div>
                  <div className="property-info-item">
                    <p className="property-info-label">Mobile</p>
                    <p className="property-info-value">{property.mobile}</p>
                  </div>
                </div>

                {/* Tax Amount */}
                <div className="property-tax-amount">
                  <h4>💰 Total Tax Amount</h4>
                  <span>₹{property.taxAmount.toLocaleString()}</span>
                </div>

                {/* Pay Button */}
                <button
                  className="property-pay-btn"
                  onClick={handlePay}
                  disabled={property.paymentStatus === "Paid" || paying}
                >
                  {property.paymentStatus === "Paid"
                    ? "✅ Already Paid"
                    : paying
                    ? "Processing..."
                    : `💳 Pay ₹${property.taxAmount.toLocaleString()} Now`}
                </button>

                {receipt && (
                  <div style={{
                    marginTop: "12px",
                    background: "#d1fae5",
                    padding: "12px",
                    borderRadius: "8px",
                    textAlign: "center",
                    color: "#059669",
                    fontWeight: "600"
                  }}>
                    ✅ Payment Successful! Receipt No: {receipt}
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="property-history-card">
                <h3>📋 Payment History</h3>
                {property.paymentHistory.length === 0 ? (
                  <div className="property-empty">No payments made yet</div>
                ) : (
                  property.paymentHistory.map((h, i) => (
                    <div key={i} className="property-history-item">
                      <div className="property-history-left">
                        <p className="property-history-amount">
                          ₹{h.amount.toLocaleString()}
                        </p>
                        <p className="property-history-receipt">
                          Receipt: {h.receiptNo} • {h.method}
                        </p>
                      </div>
                      <p className="property-history-date">
                        📅 {new Date(h.paidOn).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyTax;