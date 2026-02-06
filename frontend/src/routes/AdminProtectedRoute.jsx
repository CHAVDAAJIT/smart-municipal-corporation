import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AdminProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setAllowed(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => setAllowed(true))
      .catch(() => {
        localStorage.removeItem("adminToken");
        setAllowed(false);
      });
  }, []);

  if (allowed === null) {
    return <div>Checking authorization...</div>;
  }

  return allowed ? children : <Navigate to="/admin/login" />;
}

export default AdminProtectedRoute;
