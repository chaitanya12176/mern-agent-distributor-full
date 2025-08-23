import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const res = await api.get("/agents");
    setAgents(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/agents", form);
      setSuccess("✅ Agent created successfully");
      setForm({ name: "", email: "", mobile: "", password: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to create agent");
    }
  };

  const deleteAgent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await api.delete(`/agents/${id}`);
      setAgents((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("❌ Failed to delete agent");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#1e3a8a", marginBottom: "20px" }}>Agents</h2>

      {/* Agent Form */}
      <form
        onSubmit={submit}
        style={{
          display: "grid",
          gap: "14px",
          maxWidth: "500px",
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <div>
          <label style={{ fontWeight: "600", fontSize: "14px" }}>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Agent Name"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", fontSize: "14px" }}>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            required
            placeholder="email@example.com"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", fontSize: "14px" }}>
            Mobile (+country code)
          </label>
          <input
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            placeholder="+1XXXXXXXXXX"
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", fontSize: "14px" }}>
            Password
          </label>
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
            required
            placeholder="********"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "160px",
            padding: "12px",
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            color: "white",
            border: 0,
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg,#15803d,#166534)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg,#16a34a,#15803d)")
          }
        >
          Add Agent
        </button>
      </form>

      {/* Agent Table */}
      <h3 style={{ marginTop: "32px", color: "#1f2937" }}>Agent List</h3>
      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th style={{ textAlign: "left", padding: "12px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Mobile</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Created</th>
            <th style={{ textAlign: "left", padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.length > 0 ? (
            agents.map((a) => (
              <tr
                key={a._id}
                style={{ borderTop: "1px solid #e5e7eb", fontSize: "14px" }}
              >
                <td style={{ padding: "12px" }}>{a.name}</td>
                <td style={{ padding: "12px" }}>{a.email}</td>
                <td style={{ padding: "12px" }}>{a.mobile}</td>
                <td style={{ padding: "12px" }}>
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => deleteAgent(a._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No agents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
