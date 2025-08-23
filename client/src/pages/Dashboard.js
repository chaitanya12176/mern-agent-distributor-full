import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const load = async () => {
      try {
        if (user.role === "admin") {
          const [a, l] = await Promise.all([
            api.get("/agents"),
            api.get("/leads"),
          ]);
          setAgents(a.data);
          setLeads(l.data);
        } else {
          const mine = await api.get("/leads/mine");
          setLeads(mine.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.role]);

  // Helper to get agent name
  const getAgentName = (agent) => {
    if (!agent) return "Unassigned";
    if (typeof agent === "object" && agent.name) return agent.name;
    const found = agents.find(
      (a) => a._id === agent || (agent._id && a._id === agent._id)
    );
    return found ? found.name : "Unassigned";
  };

  // Delete handler
  const handleDelete = async (leadId) => {
  if (!window.confirm("Are you sure you want to delete this lead?")) return;
  setDeleting(leadId);
  try {
    await api.delete(`/leads/${leadId}`);
    setLeads((prev) => prev.filter((l) => l._id !== leadId));
    window.alert(" Lead deleted successfully!");
  } catch (e) {
    window.alert("❌ Failed to delete lead.");
  } finally {
    setDeleting(null);
  }
};


  if (loading) {
    return (
      <div style={styles.loaderWrapper}>
        <div style={styles.loader}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👋 Welcome, {user.name || "User"}</h1>

      {/* Toast message */}
      {message && <div style={styles.toast}>{message}</div>}

      {user.role === "admin" ? (
        <>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Agents</h3>
              <div style={styles.cardValue}>{agents.length}</div>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Leads</h3>
              <div style={styles.cardValue}>{leads.length}</div>
            </div>
          </div>

          {/* Admin Leads Table */}
          <div style={{ ...styles.tableWrapper, marginTop: 32 }}>
            <h3 style={styles.subtitle}>📋 All Leads</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>First Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Agent</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: 12, textAlign: "center" }}>
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l._id} style={styles.tr}>
                      <td style={styles.td}>{l.firstName}</td>
                      <td style={styles.td}>{l.phone}</td>
                      <td style={styles.td}>{l.notes}</td>
                      <td style={styles.td}>{getAgentName(l.agent)}</td>
                      <td style={styles.td}>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(l._id)}
                          disabled={deleting === l._id}
                        >
                          {deleting === l._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={styles.tableWrapper}>
          <h3 style={styles.subtitle}>📋 Your Assigned Leads</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>First Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: 12, textAlign: "center" }}>
                    No leads assigned.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l._id} style={styles.tr}>
                    <td style={styles.td}>{l.firstName}</td>
                    <td style={styles.td}>{l.phone}</td>
                    <td style={styles.td}>{l.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ✅ Styles
const styles = {
  container: {
    padding: "20px",
    background: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: "20px",
    marginBottom: "12px",
    fontWeight: "600",
    color: "#1e40af",
  },
  grid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "16px",
    marginBottom: "8px",
    color: "#64748b",
  },
  cardValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#2563eb",
  },
  tableWrapper: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
  },
  tr: {
    borderTop: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    fontSize: "15px",
    color: "#1e293b",
  },
  tableHeadRow: {
    borderBottom: "2px solid #1e3a8a",
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontSize: "18px",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "10px",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 16px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.2s",
  },
  toast: {
    marginBottom: "16px",
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#e0f2fe",
    border: "1px solid #38bdf8",
    color: "#0369a1",
    fontSize: "14px",
    maxWidth: "400px",
  },
};
