// src/components/chat/ChatView.jsx - Enhanced with Photos & Role Filtering
import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useStorage } from '../../hooks/useStorage';
import { ITEM_TYPE_LABELS } from '../../utils/constants';

const ChatView = () => {
  const { currentUser, getTheme, isSender } = useAuth();
  const {
    getActiveTransactions,
    getUserById,
    getMessagesByTransaction,
    addMessage
  } = useStorage();

  const theme = getTheme();
  const [selectedId, setSelectedId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const fileInputRef = useRef(null);

  // Get transactions filtered by current role
  const allTransactions = getActiveTransactions(currentUser.id);
  
  const transactions = allTransactions.filter(txn => {
    if (isSender()) {
      return txn.senderId === currentUser.id;
    } else {
      return txn.travelerId === currentUser.id;
    }
  });

  const selectedTransaction = transactions.find(t => t.id === selectedId);

  // Auto-select first transaction
  React.useEffect(() => {
    if (!selectedId && transactions.length > 0) {
      setSelectedId(transactions[0].id);
    }
  }, [selectedId, transactions]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTransaction) return;

    addMessage({
      transactionId: selectedTransaction.id,
      senderId: currentUser.id,
      text: messageText.trim(),
      type: 'text'
    });

    setMessageText('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTransaction) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      addMessage({
        transactionId: selectedTransaction.id,
        senderId: currentUser.id,
        text: '',
        type: 'image',
        imageData: reader.result,
        imageName: file.name
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: '360px 1fr',
      gap: 16,
      height: 'calc(100vh - 250px)',
      minHeight: 520
    },
    leftPane: {
      backgroundColor: 'white',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    leftHeader: {
      padding: '14px 16px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: theme.light
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    headerTitle: {
      fontWeight: 700,
      fontSize: '16px',
      color: '#111827'
    },
    roleIndicator: {
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 10px',
      backgroundColor: theme.primary,
      color: 'white',
      borderRadius: '12px'
    },
    roleToggle: {
      padding: '8px 12px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: 'white',
      border: `1px solid ${theme.border}`,
      borderRadius: '6px',
      cursor: 'pointer',
      color: theme.primary,
      marginTop: '8px',
      width: '100%'
    },
    leftList: {
      overflowY: 'auto',
      flex: 1
    },
    convoItem: {
      width: '100%',
      border: 'none',
      background: 'white',
      textAlign: 'left',
      padding: 14,
      cursor: 'pointer',
      borderBottom: '1px solid #f3f4f6',
      borderLeft: '4px solid transparent',
      transition: 'all 0.2s'
    },
    convoItemActive: {
      backgroundColor: theme.light,
      borderLeftColor: theme.primary
    },
    convoTop: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 999,
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      color: '#111827',
      flexShrink: 0
    },
    convoName: {
      fontWeight: 700,
      color: '#111827',
      fontSize: 14
    },
    convoMeta: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 2
    },
    convoPreview: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 6,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    rightWrap: {
      backgroundColor: 'white',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      display: 'flex'
    },
    rightPane: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    chatHeader: {
      padding: '12px 16px',
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: theme.light,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    },
    chatHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    chatTitle: {
      fontWeight: 800,
      color: '#111827'
    },
    chatSubtitle: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 2
    },
    rolePill: {
      fontSize: 12,
      fontWeight: 700,
      color: theme.primary,
      backgroundColor: 'white',
      padding: '6px 10px',
      borderRadius: 999,
      whiteSpace: 'nowrap'
    },
    messagesContainer: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    message: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.primary,
      color: 'white'
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#f3f4f6',
      color: '#111827'
    },
    image: {
      maxWidth: '100%',
      borderRadius: '8px',
      marginTop: '4px'
    },
    messageInput: {
      padding: '16px 20px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end'
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      resize: 'none',
      maxHeight: '120px'
    },
    photoButton: {
      padding: '12px',
      fontSize: '20px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    sendButton: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: theme.primary,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    emptyState: {
      padding: 26,
      textAlign: 'center',
      color: '#6b7280'
    },
    rightEmpty: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      color: '#6b7280'
    },
    emptyTitle: {
      fontWeight: 800,
      color: '#111827',
      marginTop: 10
    },
    emptyText: {
      marginTop: 6,
      fontSize: 13
    }
  };

  const renderLeft = () => {
    if (transactions.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 44 }}>💬</div>
          <div style={styles.emptyTitle}>No {isSender() ? 'sender' : 'traveler'} chats</div>
          <div style={styles.emptyText}>
            Your {isSender() ? 'sender' : 'traveler'} conversations will appear here
          </div>
        </div>
      );
    }

    return transactions.map((txn) => {
      const otherUserId = txn.participants.find(id => id !== currentUser.id);
      const otherUser = getUserById(otherUserId);
      const msgs = getMessagesByTransaction(txn.id);
      const lastMsg = msgs[msgs.length - 1];
      const isActive = selectedId === txn.id;

      return (
        <button
          key={txn.id}
          onClick={() => setSelectedId(txn.id)}
          style={{
            ...styles.convoItem,
            ...(isActive ? styles.convoItemActive : {})
          }}
        >
          <div style={styles.convoTop}>
            <div style={styles.avatar}>
              {getInitials(otherUser?.name || 'User')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.convoName}>{otherUser?.name || 'Unknown'}</div>
              <div style={styles.convoMeta}>
                {ITEM_TYPE_LABELS[txn.itemType]} • {shortCity(txn.from)} → {shortCity(txn.to)}
              </div>
              <div style={styles.convoPreview}>
                {lastMsg?.type === 'image' 
                  ? '📷 Photo' 
                  : lastMsg?.text 
                  ? truncate(lastMsg.text, 60) 
                  : 'No messages yet'}
              </div>
            </div>
          </div>
        </button>
      );
    });
  };

  const renderRight = () => {
    if (!selectedTransaction) {
      return (
        <div style={styles.rightEmpty}>
          <div style={{ fontSize: 44 }}>💬</div>
          <div style={styles.emptyTitle}>Select a conversation</div>
          <div style={styles.emptyText}>Pick one on the left to start chatting</div>
        </div>
      );
    }

    const otherUserId = selectedTransaction.participants.find(id => id !== currentUser.id);
    const otherUser = getUserById(otherUserId);
    const messages = getMessagesByTransaction(selectedTransaction.id);

    return (
      <div style={styles.rightPane}>
        {/* Header */}
        <div style={styles.chatHeader}>
          <div style={styles.chatHeaderLeft}>
            <div style={{ ...styles.avatar, width: 36, height: 36, fontSize: 13 }}>
              {getInitials(otherUser?.name || 'User')}
            </div>
            <div>
              <div style={styles.chatTitle}>{otherUser?.name || 'Unknown'}</div>
              <div style={styles.chatSubtitle}>
                {ITEM_TYPE_LABELS[selectedTransaction.itemType]} • {selectedTransaction.from} → {selectedTransaction.to}
              </div>
            </div>
          </div>

          <div style={styles.rolePill}>
            {isSender() ? '📦 Sender Chat' : '🧳 Traveler Chat'}
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map(msg => {
              const isMyMsg = msg.senderId === currentUser.id;
              
              return (
                <div
                  key={msg.id}
                  style={{
                    ...styles.message,
                    ...(isMyMsg ? styles.myMessage : styles.theirMessage)
                  }}
                >
                  {msg.type === 'image' ? (
                    <>
                      {msg.text && <div style={{ marginBottom: '8px' }}>{msg.text}</div>}
                      <img src={msg.imageData} alt={msg.imageName} style={styles.image} />
                      <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.8 }}>
                        📷 {msg.imageName}
                      </div>
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={styles.messageInput}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={styles.photoButton}
            title="Upload photo"
          >
            📷
          </button>

          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />

          <button
            type="submit"
            disabled={!messageText.trim()}
            style={{
              ...styles.sendButton,
              opacity: messageText.trim() ? 1 : 0.5
            }}
          >
            Send
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="chat-layout" style={styles.container}>
      <div className="chat-sidebar" style={styles.leftPane}>
        <div style={styles.leftHeader}>
          <div style={styles.headerTop}>
            <span style={styles.headerTitle}>Messages</span>
            <span style={styles.roleIndicator}>
              {isSender() ? '📦 Sender' : '🧳 Traveler'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Showing only your {isSender() ? 'sender' : 'traveler'} chats
          </div>
        </div>
        <div style={styles.leftList}>{renderLeft()}</div>
      </div>

      <div className="chat-panel" style={styles.rightWrap}>{renderRight()}</div>
    </div>
  );
};

export default ChatView;

/* ---------- helpers ---------- */
const shortCity = (s = '') => s.split(',')[0] || s;
const truncate = (s = '', n = 60) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || 'U';
