import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [agents, setAgents] = useState([]);
  const [agentLeads, setAgentLeads] = useState({});
  const [error, setError] = useState("");

  // ✅ Load all agents
  const loadAgents = async () => {
    const res = await api.get("/agents");
    setAgents(res.data);
  };

  // ✅ Load leads for one agent
  const loadLeadsForAgent = async (agentId) => {
    const res = await api.get(`/leads/agent/${agentId}`);
    setAgentLeads((prev) => ({ ...prev, [agentId]: res.data }));
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // ✅ Handle CSV/XLSX upload
  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await api.post("/uploads", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setError("");
      // Load leads for each agent after distribution
      res.data.distribution.forEach((d) => loadLeadsForAgent(d.agentId));
    } catch (err) {
      setError(err.response?.data?.message || "❌ Upload failed");
    }
  };

  // ✅ Delete a lead
  const deleteLead = async (id, agentId) => {
    try {
      await api.delete(`/leads/${id}`);
      // Refresh leads after deletion
      loadLeadsForAgent(agentId);
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, Arial, sans-serif" }}>
      <h2
        style={{
          background: "linear-gradient(90deg,#2563eb,#1e40af)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Upload CSV/XLSX and Distribute
      </h2>

      {/* Upload Form */}
      <form
        onSubmit={submit}
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "16px",
          display: "grid",
          gap: "14px",
          maxWidth: "540px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <label
          style={{
            border: "2px dashed #d1d5db",
            padding: "14px",
            borderRadius: "10px",
            background: "#f9fafb",
            cursor: "pointer",
            textAlign: "center",
            color: "#374151",
            fontWeight: 500,
            transition: "0.2s",
          }}
        >
          {file ? file.name : "📂 Choose a CSV/XLSX file"}
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{ display: "none" }}
          />
        </label>

        <small style={{ color: "#6b7280" }}>
          Headers required: <code>FirstName, Phone, Notes</code>
        </small>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "white",
            border: 0,
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg,#1d4ed8,#1e40af)")
          }
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(135deg,#2563eb,#1d4ed8)")
          }
        >
          🚀 Upload
        </button>
      </form>

      {/* Results Section */}
      {result && (
        <div style={{ marginTop: "32px" }}>
          <div
            style={{
              background: "white",
              padding: "22px",
              borderRadius: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              maxWidth: "600px",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#111827" }}>
              📊 Distribution Summary
            </h3>
            <p style={{ color: "#4b5563" }}>
              ✅ <b>{result.totalValid}</b> valid rows | ❌{" "}
              <b>{result.totalInvalid}</b> invalid rows
            </p>
            <ul style={{ marginTop: "12px", color: "#1f2937", fontSize: "15px" }}>
              {result.distribution.map((d) => {
                const agent = agents.find((a) => a._id === d.agentId);
                return (
                  <li key={d.agentId}>
                    <b>{agent ? agent.name : d.agentId}</b> → {d.count} leads
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Leads per Agent */}
          <div
            style={{
              display: "grid",
              gap: "18px",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              marginTop: "24px",
            }}
          >
            {result.distribution.map((d) => {
              const agent = agents.find((a) => a._id === d.agentId);
              const leads = agentLeads[d.agentId] || [];
              return (
                <div
                  key={d.agentId}
                  style={{
                    background: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <h4
                    style={{
                      marginBottom: "12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1e3a8a",
                    }}
                  >
                    👤 {agent ? agent.name : d.agentId}
                  </h4>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "14px",
                    }}
                  >
                    <thead style={{ background: "#f3f4f6" }}>
                      <tr>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          First Name
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          Phone
                        </th>
                        <th style={{ textAlign: "center", padding: "8px" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l, idx) => (
                        <tr
                          key={l._id}
                          style={{
                            background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                            borderTop: "1px solid #e5e7eb",
                          }}
                        >
                          <td style={{ padding: "8px" }}>{l.firstName}</td>
                          <td style={{ padding: "8px" }}>{l.phone}</td>
                          <td style={{ textAlign: "center", padding: "8px" }}>
                            <button
                              onClick={() => deleteLead(l._id, d.agentId)}
                              style={{
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                cursor: "pointer",
                              }}
                            >
                              ❌ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              color: "#6b7280",
                            }}
                          >
                            No leads found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
