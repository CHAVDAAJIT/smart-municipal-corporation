import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";

import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import RegisterComplaint from "./pages/user/complaints/RegisterComplaint";
import MyComplaints from "./pages/user/complaints/MyComplaints";

import ComplaintsManagement from "./pages/admin/complaints/ComplaintsManagement";
import ComplaintDetail from "./pages/admin/complaints/ComplaintDetail";

import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import UserProtectedRoute from "./routes/UserProtectedRoute";

import Documents from "./pages/user/dashboard/Documents";
import CertificatesManagement from "./pages/admin/CertificatesManagement";
function AppContent() {
  const location = useLocation();

  // 🔥 NAVBAR HIDE RULE (FINAL)
  const hideNavbar =
    location.pathname.startsWith("/user/dashboard") ||
    location.pathname.startsWith("/user/complaint") ||
    location.pathname.startsWith("/user/complaints") ||
    location.pathname.startsWith("/user/documents") ||
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/admin/complaints") ||
    location.pathname.startsWith("/admin/certificates");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* USER */}
        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/user/complaint/register"
          element={
            <UserProtectedRoute>
              <RegisterComplaint />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/user/complaints"
          element={
            <UserProtectedRoute>
              <MyComplaints />
            </UserProtectedRoute>
          }
        />

        <Route
  path="/user/documents"
  element={
    <UserProtectedRoute>
      <Documents />
    </UserProtectedRoute>
  }
/>

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <AdminProtectedRoute>
              <ComplaintsManagement />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints/:id"
          element={
            <AdminProtectedRoute>
              <ComplaintDetail />
            </AdminProtectedRoute>
          }
        />

          <Route
  path="/admin/certificates"
  element={
    <AdminProtectedRoute>
      <CertificatesManagement />
    </AdminProtectedRoute>
  }
/>

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
