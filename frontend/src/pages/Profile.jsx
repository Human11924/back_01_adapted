import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { removeToken } from "../utils/auth";

export default function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/me");
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Employee Profile</h1>
      <button onClick={handleLogout}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Name:</strong> {profile?.full_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Position:</strong> {profile?.position}</p>
        <p><strong>Department:</strong> {profile?.department}</p>
        <p><strong>CEFR Level:</strong> {profile?.cefr_level}</p>
      </div>
    </div>
  );
}