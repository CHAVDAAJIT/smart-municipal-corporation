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
import MyCertificates from "./pages/user/dashboard/MyCertificates";

import WaterManagement from "./pages/user/dashboard/WaterManagement";
import AdminWaterManagement from "./pages/admin/WaterManagement";

import AdminAnnouncements from "./pages/admin/Announcements";
import Announcements from "./pages/user/dashboard/Announcements";
import Notifications from "./pages/user/dashboard/Notifications";
import AboutCorporation from "./pages/user/dashboard/AboutCorporation";
import Points from "./pages/user/dashboard/Points";
import AdminManage from "./pages/admin/AdminManage";
import UserSettings from "./pages/user/Settings";
import AdminLiveChat from "./pages/admin/LiveChat";
import GarbageTracking from "./pages/user/dashboard/GarbageTracking";
import GarbageMonitoring from "./pages/admin/GarbageMonitoring";
import Settings from "./pages/admin/Settings";
import PropertyTax from "./pages/user/dashboard/PropertyTax";
import AdminPropertyTax from "./pages/admin/PropertyTax";
import Reports from "./pages/admin/Reports";
import CitizensManagement from "./pages/admin/CitizensManagement";
import CityUpdates from "./pages/user/dashboard/CityUpdates";
import AdminCityUpdates from "./pages/admin/CityUpdates";
function AppContent() {
  const location = useLocation();

  // 🔥 NAVBAR HIDE RULE (FINAL)
  const hideNavbar =
    location.pathname.startsWith("/user/dashboard") ||
    location.pathname.startsWith("/user/complaint") ||
    location.pathname.startsWith("/user/my-certificates") ||
    location.pathname.startsWith("/user/complaints") ||
    location.pathname.startsWith("/user/documents") ||
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/admin/complaints") ||
    location.pathname.startsWith("/user/water") ||
    location.pathname.startsWith("/admin/water") ||
    location.pathname.startsWith("/admin/announcements") ||
    location.pathname.startsWith("/user/events") ||
    location.pathname.startsWith("/user/garbage") ||
    location.pathname.startsWith("/admin/garbage") ||
    location.pathname.startsWith("/user/property-tax") ||
    location.pathname.startsWith("/admin/property-tax") ||
    location.pathname.startsWith("/admin/citizens") ||
    location.pathname.startsWith("/admin/reports") ||
    location.pathname.startsWith("/admin/settings") ||
    location.pathname.startsWith("/user/updates") ||
location.pathname.startsWith("/admin/city-updates") ||
location.pathname.startsWith("/user/notifications") ||
location.pathname.startsWith("/user/about") ||
location.pathname.startsWith("/user/points") ||
location.pathname.startsWith("/admin/manage") ||
location.pathname.startsWith("/user/settings") ||
location.pathname.startsWith("/admin/chat") ||
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
  path="/user/my-certificates"
  element={
    <UserProtectedRoute>
      <MyCertificates />
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

<Route
  path="/user/water"
  element={
    <UserProtectedRoute>
      <WaterManagement />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/events"
  element={
    <UserProtectedRoute>
      <Announcements />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/garbage"
  element={
    <UserProtectedRoute>
      <GarbageTracking />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/property-tax"
  element={
    <UserProtectedRoute>
      <PropertyTax />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/updates"
  element={
    <UserProtectedRoute>
      <CityUpdates />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/notifications"
  element={
    <UserProtectedRoute>
      <Notifications />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/about"
  element={
    <UserProtectedRoute>
      <AboutCorporation />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/points"
  element={
    <UserProtectedRoute>
      <Points />
    </UserProtectedRoute>
  }
/>

<Route
  path="/user/settings"
  element={
    <UserProtectedRoute>
      <UserSettings />
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

<Route
  path="/admin/water"
  element={
    <AdminProtectedRoute>
      <AdminWaterManagement />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/announcements"
  element={
    <AdminProtectedRoute>
      <AdminAnnouncements />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/garbage"
  element={
    <AdminProtectedRoute>
      <GarbageMonitoring />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/property-tax"
  element={
    <AdminProtectedRoute>
      <AdminPropertyTax />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/citizens"
  element={
    <AdminProtectedRoute>
      <CitizensManagement />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/reports"
  element={
    <AdminProtectedRoute>
      <Reports />
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/settings"
  element={
    <AdminProtectedRoute>
      <Settings />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/city-updates"
  element={
    <AdminProtectedRoute>
      <AdminCityUpdates />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/manage"
  element={
    <AdminProtectedRoute>
      <AdminManage />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/chat"
  element={
    <AdminProtectedRoute>
      <AdminLiveChat />
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
