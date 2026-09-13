import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS } from "../../utils/constants";
import Icon from "../common/Icon";

const shortCity = (location = "") => location.split(",")[0] || location;

const ChatView = () => {
  const { currentUser } = useAuth();
  const {
    getDeliveriesByUser, getUserById, getMessagesByDelivery,
    sendMessage, deleteMessage, markMessagesRead,
  } = useStorage();
  const deliveries = getDeliveriesByUser(currentUser.id);
  const [selectedId, setSelectedId] = useState(deliveries[0]?.id || null);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const selectedDelivery = deliveries.find((delivery) => delivery.id === selectedId) || deliveries[0];
  const selectedMessages = selectedDelivery ? getMessagesByDelivery(selectedDelivery.id) : [];
  const selectedUnreadCount = selectedMessages.filter((message) => message.recipientId === currentUser.id && !message.readAt).length;

  useEffect(() => {
    if (!selectedId && deliveries[0]) setSelectedId(deliveries[0].id);
  }, [deliveries, selectedId]);

  useEffect(() => {
    if (selectedDelivery && selectedUnreadCount > 0) markMessagesRead(selectedDelivery.id);
  }, [selectedDelivery?.id, selectedUnreadCount]);

  const conversations = useMemo(() => deliveries.map((delivery) => {
    const conversationMessages = getMessagesByDelivery(delivery.id);
    return {
      delivery,
      otherUser: getUserById(delivery.senderId === currentUser.id ? delivery.travelerId : delivery.senderId),
      lastMessage: conversationMessages[conversationMessages.length - 1],
      unread: conversationMessages.filter((message) => message.recipientId === currentUser.id && !message.readAt).length,
    };
  }), [deliveries, currentUser.id, getMessagesByDelivery, getUserById]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!messageText.trim() || !selectedDelivery || sending) return;
    setSending(true); setError("");
    try {
      await sendMessage(selectedDelivery.id, messageText);
      setMessageText("");
    } catch (sendError) {
      setError(sendError.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (deleteError) {
      setError(deleteError.message || "Message could not be deleted.");
    }
  };

  if (!deliveries.length) {
    return <section className="simple-empty-page"><span className="empty-mark"><Icon name="inbox" /></span><h1>No conversations yet</h1><p>Messages will open here after a sender and traveler accept a match.</p></section>;
  }

  const otherUser = getUserById(selectedDelivery.senderId === currentUser.id ? selectedDelivery.travelerId : selectedDelivery.senderId);

  return (
    <section className="messages-page">
      <header className="page-heading compact"><span className="eyebrow">All your conversations</span><h1>Messages</h1><p>Messages stay visible whether you are in Sender or Travel mode.</p></header>
      <div className="messages-layout">
        <aside className="conversation-list">
          {conversations.map(({ delivery, otherUser: person, lastMessage, unread }) => (
            <button key={delivery.id} className={delivery.id === selectedDelivery.id ? "conversation-row active" : "conversation-row"} onClick={() => setSelectedId(delivery.id)}>
              <span className="conversation-avatar">{(person?.name || "U").slice(0, 1).toUpperCase()}</span>
              <span className="conversation-copy"><strong>{person?.name || "Chagga member"}</strong><small>{shortCity(delivery.from)} → {shortCity(delivery.to)}</small><span>{lastMessage?.text || "Start the conversation"}</span></span>
              {unread > 0 && <span className="message-count">{unread}</span>}
            </button>
          ))}
        </aside>

        <div className="conversation-panel">
          <header className="conversation-header"><div><strong>{otherUser?.name || "Chagga member"}</strong><span>{ITEM_TYPE_LABELS[selectedDelivery.itemType]} · {shortCity(selectedDelivery.from)} → {shortCity(selectedDelivery.to)}</span></div><span className="delivery-status-pill">{selectedDelivery.status.replace("_", " ")}</span></header>
          <div className="message-thread">
            {selectedMessages.length === 0 && <p className="thread-empty">Start with a simple hello and agree on the handover details.</p>}
            {selectedMessages.map((message) => {
              const mine = message.senderId === currentUser.id;
              return <div key={message.id} className={`message-bubble ${mine ? "mine" : "theirs"} ${message.type === "system" ? "system" : ""}`}>
                <p>{message.text}</p>
                <span>{new Date(message.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                {mine && message.type === "text" && <button onClick={() => handleDelete(message.id)}>Delete</button>}
              </div>;
            })}
          </div>
          {error && <p className="chat-error" role="alert">{error}</p>}
          <form className="simple-message-form" onSubmit={handleSend}><textarea rows="1" maxLength="1200" value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Write a message…" /><button className="primary-action" disabled={!messageText.trim() || sending}><Icon name="send" size={17} />{sending ? "Sending…" : "Send"}</button></form>
        </div>
      </div>
    </section>
  );
};

export default ChatView;
