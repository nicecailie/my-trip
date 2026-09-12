// src/components/chat/MessageInput.jsx
import React, { useState } from "react";

const MessageInput = ({ onSend, theme }) => {
  const [text, setText] = useState("");

  const sendNow = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNow();
    }
  };

  return (
    <div style={{ ...styles.wrap, borderTopColor: theme.medium }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
        style={styles.input}
        rows={2}
      />
      <button
        onClick={sendNow}
        disabled={!text.trim()}
        style={{
          ...styles.button,
          backgroundColor: theme.primary,
          opacity: text.trim() ? 1 : 0.55,
        }}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;

const styles = {
  wrap: {
    padding: 12,
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: 10,
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    resize: "none",
    minHeight: 44,
    lineHeight: 1.35,
    backgroundColor: "white",
  },
  button: {
    border: "none",
    color: "white",
    fontWeight: 800,
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    minWidth: 84,
  },
};
