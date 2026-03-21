import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { removeToken } from "../utils/auth";

export default function Dashboard({ setUser }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/fnb");
        setData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Stats</h2>
      <pre>{JSON.stringify(data?.stats, null, 2)}</pre>

      <h2>CEFR Distribution</h2>
      <pre>{JSON.stringify(data?.cefr_distribution, null, 2)}</pre>

      <h2>Employees</h2>
      <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>CEFR</th>
          </tr>
        </thead>
        <tbody>
          {data?.employees?.map((employee, index) => (
            <tr key={index}>
              <td>{employee.full_name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>{employee.cefr_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}