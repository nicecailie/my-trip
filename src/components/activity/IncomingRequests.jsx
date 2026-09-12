// src/components/activity/IncomingRequests.jsx
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS } from "../../utils/constants";

const IncomingRequests = () => {
  const { currentUser, isSender, getTheme } = useAuth();
  const {
    getIncomingMatchRequests,
    acceptMatchRequest,
    declineMatchRequest,
    getUserById,
    getRequestById,
    getTripById,
  } = useStorage();

  const t = getTheme();

  const incomingRequests = currentUser
    ? getIncomingMatchRequests(currentUser.id, currentUser.role)
    : [];

  const handleAccept = (matchRequestId) => {
    const result = acceptMatchRequest(matchRequestId);
    if (result?.success) {
      alert("Match accepted! Check your Messages to coordinate.");
    } else {
      alert(result?.error || result?.message || "Could not accept request.");
    }
  };

  const handleDecline = (matchRequestId) => {
    if (window.confirm("Are you sure you want to decline this request?")) {
      declineMatchRequest(matchRequestId);
    }
  };

  const styles = {
    container: { maxWidth: "900px", margin: "0 auto" },
    header: { marginBottom: "24px" },
    title: { fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#111827" },
    subtitle: { fontSize: "15px", color: "#6b7280", margin: 0 },
    list: { display: "flex", flexDirection: "column", gap: "16px" },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: `2px solid ${t.medium || "#e5e7eb"}`,
      padding: "24px",
      transition: "all 0.2s",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
      marginBottom: "16px",
    },
    userInfo: { flex: 1 },
    userName: { fontSize: "18px", fontWeight: "600", margin: "0 0 4px 0", color: "#111827" },
    userMeta: { fontSize: "13px", color: "#6b7280" },
    badge: {
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: "600",
      backgroundColor: t.light,
      color: t.primary,
      borderRadius: "6px",
    },
    requestDetails: {
      padding: "16px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
      marginBottom: "16px",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
      fontSize: "14px",
    },
    route: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "15px",
      fontWeight: "500",
      marginTop: "12px",
    },
    label: { color: "#6b7280", fontWeight: "500" },
    value: { color: "#111827", fontWeight: "600" },
    actions: { display: "flex", gap: "12px" },
    button: {
      flex: 1,
      padding: "12px",
      fontSize: "15px",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    border: '2px solid ' + t.border,
    acceptButton: { backgroundColor: t.primary, color: "white" },
    declineButton: { backgroundColor: "#f3f4f6", color: "#374151" },
    emptyState: { textAlign: "center", padding: "60px 20px" },
    emptyIcon: { fontSize: "64px", marginBottom: "16px" },
    emptyTitle: { fontSize: "20px", fontWeight: "600", margin: "0 0 8px 0", color: "#111827" },
    emptyText: { fontSize: "15px", color: "#6b7280", margin: 0 },
    timestamp: { fontSize: "12px", color: "#9ca3af", marginTop: "8px" },
  };

  if (incomingRequests.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>📬 Incoming Requests</h2>
          <p style={styles.subtitle}>
            {isSender()
              ? "Travelers who want to help with your deliveries"
              : "Senders who want you to carry their items"}
          </p>
        </div>

        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>No incoming requests</h3>
          <p style={styles.emptyText}>
            When {isSender() ? "travelers offer to help" : "senders request your help"}, they'll appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📬 Incoming Requests ({incomingRequests.length})</h2>
        <p style={styles.subtitle}>
          {isSender()
            ? "Travelers who want to help with your deliveries"
            : "Senders who want you to carry their items"}
        </p>
      </div>

      <div style={styles.list}>
        {incomingRequests.map((matchReq) => {
          const otherUserId = isSender() ? matchReq.travelerId : matchReq.senderId;
          const otherUser = getUserById(otherUserId);

          const originalRequest = matchReq.requestId ? getRequestById(matchReq.requestId) : null;
          const originalTrip = matchReq.tripId ? getTripById(matchReq.tripId) : null;

          return (
            <div key={matchReq.id} style={styles.card}>
              
              <div style={styles.cardHeader}>
                <div style={styles.userInfo}>
                  <h3 style={styles.userName}>
                    {isSender() ? "🧳" : "📦"} {otherUser?.name || "User"}
                  </h3>
                  <div style={styles.userMeta}>
                    ⭐ {otherUser?.rating?.toFixed(1) || "5.0"} • {otherUser?.completedDeliveries || 0} deliveries
                  </div>
                </div>
                <div style={styles.badge}>{isSender() ? "Wants to Help" : "Needs Delivery"}</div>
              </div>

              <div style={styles.requestDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.label}>Item:</span>
                  <span style={styles.value}>{ITEM_TYPE_LABELS[matchReq.itemType]}</span>
                </div>

                <div style={styles.route}>
                  <span>{matchReq.from.split(",")[0]}</span>
                  <span style={{ color: "#9ca3af" }}>→</span>
                  <span>{matchReq.to.split(",")[0]}</span>
                </div>

                {originalRequest && (
                  <div style={{ ...styles.detailRow, marginTop: "12px", marginBottom: 0 }}>
                    <span style={styles.label}>Your Request:</span>
                    <span style={styles.value}>
                      Needed by{" "}
                      {new Date(originalRequest.neededBy).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {originalTrip && (
                  <div style={{ ...styles.detailRow, marginTop: "12px", marginBottom: 0 }}>
                    <span style={styles.label}>Your Trip:</span>
                    <span style={styles.value}>
                      {new Date(originalTrip.travelDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div style={styles.actions}>
                <button onClick={() => handleAccept(matchReq.id)} style={{ ...styles.button, ...styles.acceptButton }}>
                  ✓ Accept
                </button>
                <button onClick={() => handleDecline(matchReq.id)} style={{ ...styles.button, ...styles.declineButton }}>
                  ✕ Decline
                </button>
              </div>

              <div style={styles.timestamp}>
                Received{" "}
                {new Date(matchReq.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomingRequests;
