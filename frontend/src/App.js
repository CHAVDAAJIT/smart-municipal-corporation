import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserRegister from "./pages/user/UserRegister";
import UserLogin from "./pages/user/UserLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
