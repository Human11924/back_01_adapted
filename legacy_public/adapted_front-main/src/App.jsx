import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/footer.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import StaffAccess from "./pages/StaffAccess";
import BusinessLogin from "./pages/BusinessLogin";
import BusinessDashboard from "./pages/BusinessDashboard";

import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/staff" element={<StaffAccess />} />
          <Route path="/login/business" element={<BusinessLogin />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}