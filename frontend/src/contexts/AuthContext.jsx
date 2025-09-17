// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ketika token ada, set header dan coba ambil profile
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      (async () => {
        try {
          const res = await api.get("/api/profile");
          setUser(res.data);
        } catch (err) {
          console.error("fetch profile error:", err);
          // token mungkin invalid -> logout
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          setAuthToken(null);
        }
      })();
    } else {
      setUser(null);
      setAuthToken(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/login", { email, password });
      const t = res.data.token;
      if (!t) throw new Error("No token returned");
      setToken(t);
      localStorage.setItem("token", t);
      setAuthToken(t);

      // ambil profile
      const profileRes = await api.get("/api/profile");
      setUser(profileRes.data);

      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // lempar error supaya UI bisa menampilkan
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
