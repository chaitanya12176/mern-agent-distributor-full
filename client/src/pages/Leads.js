import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");

  // Load leads
  const load = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Error loading leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Delete lead
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      setDeleting(id);
      await api.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to delete lead");
    } finally {
      setDeleting("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#1e3a8a", marginBottom: "20px" }}>Dashboard</h2>

      {loading ? (
        <p>Loading leads...</p>
      ) : leads.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No leads available</p>
      ) : (
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
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Agent</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id} style={{ borderTop: "1px solid #e5e7eb", fontSize: "14px" }}>
                <td style={styles.td}>{l.name}</td>
                <td style={styles.td}>{l.email}</td>
                <td style={styles.td}>{l.phone}</td>
                <td style={styles.td}>{l.agent?.name || "-"}</td>
                <td style={styles.td}>
                  {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "-"}
                </td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  th: { textAlign: "left", padding: "12px" },
  td: { padding: "12px" },
  deleteBtn: {
    padding: "6px 12px",
    background: "#dc2626",
    color: "white",
    border: 0,
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
};
