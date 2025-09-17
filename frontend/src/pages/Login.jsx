// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // login() akan redirect ke /dashboard
    } catch (err) {
      // tampilkan pesan error dari server bila ada
      const msg =
        err?.response?.data?.message || err?.message || "Login gagal";
      setError(msg);
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 10 }}>Admin Login</h2>

        {error && (
          <div style={{ color: "white", background: "#f43f5e", padding: 8, borderRadius: 6, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px 10px", marginBottom: 12 }}
        />

        <label style={{ display: "block", marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px 10px", marginBottom: 16 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
