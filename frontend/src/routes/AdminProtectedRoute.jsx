import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function AdminProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setAuthorized(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => setAuthorized(true))
      .catch(() => {
        localStorage.removeItem("adminToken");
        setAuthorized(false);
      });
  }, []);

  if (authorized === null) {
    return <div>Checking admin access...</div>;
  }

  return authorized ? children : <Navigate to="/admin/login" />;
}

export default AdminProtectedRoute;
