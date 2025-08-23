import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState(""); // empty by default
  const [password, setPassword] = useState(""); // empty by default
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          width: "380px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          animation: "fadeIn 0.5s ease-in-out",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            textAlign: "center",
            color: "#1e3a8a",
            fontWeight: "700",
          }}
        >
          Admin Login
        </h2>

        <label style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Enter email"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            transition: "0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #2563eb")}
          onBlur={(e) => (e.target.style.border = "1px solid #d1d5db")}
        />

        <label style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            marginBottom: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            transition: "0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #2563eb")}
          onBlur={(e) => (e.target.style.border = "1px solid #d1d5db")}
        />

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            color: "white",
            border: 0,
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #1e40af, #1e3a8a)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg, #2563eb, #1e40af)")
          }
        >
          Login
        </button>
      </form>
    </div>
  );
}
