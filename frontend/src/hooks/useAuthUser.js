import { useEffect, useState } from "react";
import api from "../services/api";
import {
  getCurrentUser,
  getToken,
  removeCurrentUser,
  removeToken,
  saveCurrentUser,
} from "../utils/auth";

export default function useAuthUser() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) {
        removeCurrentUser();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        saveCurrentUser(res.data);
      } catch {
        removeToken();
        removeCurrentUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return { user, setUser, loading };
}
