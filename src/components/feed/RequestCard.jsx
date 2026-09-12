// src/components/feed/RequestCard.jsx
import React, { useMemo, useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { useAuth } from "../../hooks/useAuth";
import { ITEM_TYPE_LABELS, SIZE_LABELS } from "../../utils/constants";

const RequestCard = ({ request, onHelp }) => {
  const { getUserById, createMatchRequest, getOutgoingMatchRequests } = useStorage();
  const { currentUser, getTheme, isTraveler } = useAuth();
  const theme = getTheme();

  const sender = getUserById(request.senderId);
  const [offerSentFlash, setOfferSentFlash] = useState(false);

  // Outgoing pending match requests (traveler perspective)
  const outgoing = useMemo(() => {
    if (!currentUser?.id || !isTraveler?.() || !getOutgoingMatchRequests) return [];
    return getOutgoingMatchRequests(currentUser.id, "traveler") || [];
  }, [currentUser?.id, getOutgoingMatchRequests, isTraveler]);

  const alreadySent = outgoing.some((mr) => mr.requestId === request.id && mr.status === "pending");

  const handleOfferHelp = () => {
    // If parent passed a handler (FeedView), use it.
    // Otherwise, handle here (recommended).
    if (onHelp) {
      onHelp(request);
      return;
    }

    if (!currentUser?.id) {
      alert("Please log in first.");
      return;
    }

    const result = createMatchRequest({
      senderId: request.senderId,
      travelerId: currentUser.id,
      requestId: request.id,
      from: request.from,
      to: request.to,
      itemType: request.itemType,

      // Optional metadata
      senderName: sender?.name,
      travelerName: currentUser.name,
      type: "traveler_to_sender",
    });

    if (!result?.success) {
      alert(result?.error || "Could not send offer.");
      return;
    }

    setOfferSentFlash(true);
    setTimeout(() => setOfferSentFlash(false), 2500);
  };

  const buttonText = offerSentFlash
    ? "✓ Offer Sent!"
    : alreadySent
    ? "Offer Pending"
    : "I Can Help";

  const buttonStyle = offerSentFlash
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
        <div style={styles.itemInfo}>
          <h3 style={styles.itemType}>
            📦 {ITEM_TYPE_LABELS[request.itemType]}
          </h3>

          <div style={styles.senderInfo}>
            <span>{sender?.name || "Sender"}</span>
            <span style={styles.dot}>•</span>
            <span>⭐ {sender?.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>

        <div style={{ ...styles.sizeBadge, color: theme.primary, backgroundColor: theme.light }}>
          {SIZE_LABELS[request.size]}
        </div>
      </div>

      <div style={styles.route}>
        <span>{(request.from || "").split(",")[0]}</span>
        <span style={styles.arrow}>→</span>
        <span>{(request.to || "").split(",")[0]}</span>
      </div>

      <div style={styles.details}>
        <div style={styles.detailRow}>
          <span style={styles.label}>Needed By:</span>
          <span style={styles.value}>
            {new Date(request.neededBy).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {request.description && (
          <div style={styles.description}>
            “{request.description}”
          </div>
        )}
      </div>

      <button
        onClick={handleOfferHelp}
        disabled={alreadySent || offerSentFlash}
        style={buttonStyle}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default RequestCard;

const styles = {
  card: {
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
  itemInfo: { flex: 1 },
  itemType: { margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" },
  senderInfo: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  dot: { color: "#d1d5db" },

  sizeBadge: {
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

  details: { display: "flex", flexDirection: "column", gap: 10 },
  detailRow: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 },
  label: { color: "#6b7280", fontWeight: 700, minWidth: 110 },
  value: { color: "#111827", fontWeight: 700, textAlign: "right" },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.5,
    paddingTop: 6,
  },

  button: {
    width: "100%",
    padding: "12px",
    fontSize: 15,
    fontWeight: 800,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
