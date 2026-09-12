
// src/components/feed/TravelerCard.jsx
import React, { useMemo, useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { useAuth } from "../../hooks/useAuth";
import { ITEM_TYPE_LABELS, SIZE_LABELS, ITEM_TYPES } from "../../utils/constants";

const TravelerCard = ({ trip, onSendRequest }) => {
  const { getUserById, createMatchRequest, getOutgoingMatchRequests } = useStorage();
  const { currentUser, getTheme, isSender } = useAuth();
  const theme = getTheme();

  const traveler = getUserById(trip.travelerId);

  const [requestSentFlash, setRequestSentFlash] = useState(false);

  // Outgoing pending match requests (sender perspective)
  const outgoing = useMemo(() => {
    if (!currentUser?.id || !isSender?.() || !getOutgoingMatchRequests) return [];
    return getOutgoingMatchRequests(currentUser.id, "sender") || [];
  }, [currentUser?.id, getOutgoingMatchRequests, isSender]);

  const alreadySent = outgoing.some((mr) => mr.tripId === trip.id && mr.status === "pending");

  const handleSend = () => {
    // If parent passed a handler (FeedView), use it.
    // Otherwise, handle here (recommended).
    if (onSendRequest) {
      onSendRequest(trip);
      return;
    }

    if (!currentUser?.id) {
      alert("Please log in first.");
      return;
    }

    const defaultItemType =
      (trip.acceptedItems && trip.acceptedItems[0]) || ITEM_TYPES.DOCUMENTS;

    const result = createMatchRequest({
      senderId: currentUser.id,
      travelerId: trip.travelerId,
      tripId: trip.id,
      from: trip.from,
      to: trip.to,
      itemType: defaultItemType,

      // Optional metadata (harmless if unused)
      senderName: currentUser.name,
      travelerName: traveler?.name,
      type: "sender_to_traveler",
    });

    if (!result?.success) {
      alert(result?.error || "Could not send request.");
      return;
    }

    setRequestSentFlash(true);
    setTimeout(() => setRequestSentFlash(false), 2500);
  };

  const buttonText = requestSentFlash
    ? "✓ Request Sent!"
    : alreadySent
    ? "Request Pending"
    : "Send Request";

  const buttonStyle = requestSentFlash
    ? { ...styles.button, backgroundColor: "#10b981", color: "white" }
    : alreadySent
    ? { ...styles.button, backgroundColor: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" }
    : { ...styles.button, backgroundColor: theme.primary, color: "white" };

  return (
    <div
  style={styles.card}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
  }}
>

      <div style={styles.header}>
        <div style={styles.userInfo}>
          <h3 style={styles.name}>🧳 {traveler?.name || "Traveler"}</h3>

          <div style={styles.ratingRow}>
            <span>⭐</span>
            <span>{traveler?.rating?.toFixed(1) || "5.0"}</span>
            <span style={styles.dot}>•</span>
            <span>{traveler?.completedDeliveries || 0} deliveries</span>
          </div>
        </div>

        <div style={{ ...styles.datePill, color: theme.primary, backgroundColor: theme.light }}>
          {new Date(trip.travelDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      <div style={styles.route}>
        <span>{(trip.from || "").split(",")[0]}</span>
        <span style={styles.arrow}>→</span>
        <span>{(trip.to || "").split(",")[0]}</span>
      </div>

      <div style={styles.details}>
        <div style={styles.detailRow}>
          <span style={styles.label}>Available Space:</span>
          <span style={styles.value}>{SIZE_LABELS[trip.availableSpace]}</span>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.label}>Can Carry:</span>
          <span style={styles.value}>
            {(trip.acceptedItems || [])
              .map((item) => (ITEM_TYPE_LABELS[item] || item).split(" ")[0])
              .join(", ")}
          </span>
        </div>

        {trip.deliveryArea && (
          <div style={styles.detailRow}>
            <span style={styles.label}>Delivery Area:</span>
            <span style={styles.value}>{trip.deliveryArea}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSend}
        disabled={alreadySent || requestSentFlash}
        style={buttonStyle}
      >
        {buttonText}
      </button>
    </div>
  );
};


export default TravelerCard;

const styles = {

  
  card: {
    animation: "fadeIn 0.3s ease-in-out",
    backgroundColor: "white",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  userInfo: { flex: 1 },
  name: { margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" },
  ratingRow: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  dot: { color: "#d1d5db" },
  datePill: {
    fontSize: 13,
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: 8,
    whiteSpace: "nowrap",
  },
  route: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 14,
    color: "#111827",
    padding: "10px 12px",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #f1f5f9",
  },
  arrow: { color: "#9ca3af", fontWeight: 800 },
  details: { display: "flex", flexDirection: "column", gap: 8 },
  detailRow: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 },
  label: { color: "#6b7280", fontWeight: 600, minWidth: 110 },
  value: { color: "#111827", fontWeight: 600, textAlign: "right" },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s",
  },

};
