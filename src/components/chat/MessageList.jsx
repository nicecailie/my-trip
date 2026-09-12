// src/components/chat/MessageList.jsx
import React, { useEffect, useMemo, useRef } from "react";

const MessageList = ({ messages, currentUserId, getUserById, theme }) => {
  const endRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const enriched = useMemo(() => {
    return messages.map((m, idx) => {
      const isMine = m.senderId === currentUserId;
      const sender = getUserById(m.senderId);
      const prev = messages[idx - 1];
      const showMeta = !prev || prev.senderId !== m.senderId; // new sender block
      return { ...m, isMine, senderName: sender?.name || "User", showMeta };
    });
  }, [messages, currentUserId, getUserById]);

  if (!messages || messages.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: 40 }}>✨</div>
        <div style={styles.emptyTitle}>Say hi</div>
        <div style={styles.emptyText}>Start the conversation with a quick message.</div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      {enriched.map((m) => (
        <div
          key={m.id}
          style={{
            ...styles.row,
            justifyContent: m.isMine ? "flex-end" : "flex-start",
          }}
        >
          <div style={{ maxWidth: "74%" }}>
            {m.showMeta && (
              <div
                style={{
                  ...styles.meta,
                  textAlign: m.isMine ? "right" : "left",
                }}
              >
                <span style={{ fontWeight: 800, color: "#111827" }}>
                  {m.isMine ? "You" : m.senderName}
                </span>
                <span style={{ margin: "0 8px", color: "#d1d5db" }}>•</span>
                <span>{formatTime(m.createdAt)}</span>
              </div>
            )}

            <div
              style={{
                ...styles.bubble,
                backgroundColor: m.isMine ? theme.primary : "#f3f4f6",
                color: m.isMine ? "white" : "#111827",
                borderTopRightRadius: m.isMine ? 6 : 14,
                borderTopLeftRadius: m.isMine ? 14 : 6,
              }}
            >
              {m.text}
            </div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const styles = {
  wrap: {
    flex: 1,
    overflowY: "auto",
    padding: "18px 16px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  row: { display: "flex" },
  meta: { fontSize: 11, color: "#6b7280", marginBottom: 6 },
  bubble: {
    padding: "12px 14px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    color: "#6b7280",
  },
  emptyTitle: { fontWeight: 900, color: "#111827", marginTop: 10 },
  emptyText: { marginTop: 6, fontSize: 13 },
};
