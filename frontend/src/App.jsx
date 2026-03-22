import useAuthUser from "./hooks/useAuthUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./public/PublicLayout";
import Home from "./public/pages/Home";
import About from "./public/pages/About";
import Courses from "./public/pages/Courses";
import Pricing from "./public/pages/Pricing";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDetail from "./pages/EmployeeDetail";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import CourseViewer from "./pages/CourseViewer";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";

function defaultRouteForRole(role) {
  if (role === "admin") return "/dashboard";
  if (role === "employee") return "/profile";
  return "/login";
}

function AppRoutes() {
  const { user, setUser, loading } = useAuthUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        element={user ? <Navigate to={defaultRouteForRole(user.role)} replace /> : <PublicLayout />}
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} allowedRoles={["admin"]}>
            <Dashboard user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees/:employeeId"
        element={
          <ProtectedRoute user={user} allowedRoles={["admin"]}>
            <EmployeeDetail user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute user={user} allowedRoles={["admin"]}>
            <Analytics user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user} allowedRoles={["employee"]}>
            <Profile user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute user={user} allowedRoles={["employee"]}>
            <MyCourses user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-courses/:courseId"
        element={
          <ProtectedRoute user={user} allowedRoles={["employee"]}>
            <CourseViewer user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute user={user} allowedRoles={["admin", "employee"]}>
            <Leaderboard user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute user={user} allowedRoles={["admin", "employee"]}>
            <Notifications user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          user ? (
            <Navigate to={defaultRouteForRole(user.role)} replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}