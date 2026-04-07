import { useState } from "react";
import API from "../../services/apiUser";
import "../../styles/Feedback.css";

const ratingLabels = {
  1: "😞 Very Poor",
  2: "😐 Poor",
  3: "🙂 Average",
  4: "😊 Good",
  5: "🤩 Excellent!"
};

function FeedbackModal({ complaint, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { setMsg("Please select a rating"); return; }
    setLoading(true);
    try {
      await API.post("/feedback", {
        rating,
        comment,
        complaintId: complaint._id,
        serviceType: "complaint"
      });
      setMsg("✅ Thank you for your feedback!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed"));
    }
    setLoading(false);
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        <h3>⭐ Rate this Service</h3>
        <p>How was your experience with complaint #{complaint._id.slice(-6)}?</p>

        {/* Stars */}
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={`star-btn ${star <= (hover || rating) ? "selected" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ⭐
            </button>
          ))}
        </div>

        <p className="rating-label">
          {ratingLabels[hover || rating] || "Select your rating"}
        </p>

        <textarea
          placeholder="Share your experience (optional)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        {msg && (
          <p style={{
            color: msg.includes("✅") ? "#059669" : "#e63946",
            fontSize: "13px", marginBottom: "10px", textAlign: "center"
          }}>
            {msg}
          </p>
        )}

        <button
          className="feedback-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
        <button className="feedback-cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default FeedbackModal;