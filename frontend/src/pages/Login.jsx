// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // login() akan redirect ke /dashboard
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Login gagal";
      setError(msg);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #2563eb, #F6FF99, #708993)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 380,
          padding: 28,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
            color: "#1e3a8a",
            fontWeight: "600",
          }}
        >
          Admin Login
        </h2>

        {error && (
          <div
            style={{
              color: "white",
              background: "#ef4444",
              padding: 10,
              borderRadius: 6,
              marginBottom: 14,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 14,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
          }}
        />

        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 20,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: 10,
            background: "#f3f4f6",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ← Kembali ke Home
        </button>
      </form>
    </div>
  );
}
