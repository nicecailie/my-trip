
// src/components/activity/ActivityView.jsx - With Recipient Management
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useStorage } from '../../hooks/useStorage';
import { SIZE_LABELS, ITEM_TYPE_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
//import { styles } from '../../styles/styles';
import { styles, THEME_COLORS} from '../../styles/styles';
import IncomingRequests from './IncomingRequests';
import { 
  AddRecipientModal, 
  DeliveryStatusTracker, 
  RecipientInfoCard 
} from '../delivery/RecipientSystem';

const ActivityView = () => {
  const { currentUser, isSender, getTheme } = useAuth();
  const {
    getRequestsBySender,
    getTripsByTraveler,
    getActiveTransactions,
    getUserById,
    getIncomingMatchRequests,
    updateTransaction
  } = useStorage();

  const [activeTab, setActiveTab] = useState('posts');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const theme = getTheme();

  const myPosts = isSender()
    ? getRequestsBySender(currentUser.id)
    : getTripsByTraveler(currentUser.id);

  const activeDeliveries = getActiveTransactions(currentUser.id);
  const incoming = getIncomingMatchRequests
    ? getIncomingMatchRequests(currentUser.id, currentUser.role)
    : [];

  const handleStatusUpdate = (txnId, newStatus) => {
    updateTransaction(txnId, { status: newStatus });
    alert(`Status updated to: ${newStatus}`);
  };

  const renderMyPosts = () => {
    if (myPosts.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>{isSender() ? '📦' : '🧳'}</div>
          <h3 style={styles.emptyTitle}>No posts yet</h3>
          <p style={styles.emptyText}>
            {isSender()
              ? "You haven't posted any delivery requests yet"
              : "You haven't posted any trips yet"}
          </p>
        </div>
      );
    }

    return myPosts.map(post => (
      <div key={post.id} style={styles.activityCard}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.cardTitle}>
              {isSender()
                ? `📦 ${ITEM_TYPE_LABELS[post.itemType]}`
                : `🧳 Trip to ${post.to.split(',')[0]}`}
            </h3>

            <div style={styles.cardRoute}>
              <span>{post.from}</span>
              <span style={styles.arrow}>→</span>
              <span>{post.to}</span>
            </div>
          </div>

          <span
            style={{
              ...styles.status,
              ...(post.status === 'pending'
                ? styles.statusPending
                : post.status === 'matched'
                ? { ...styles.statusActive, backgroundColor: theme.light, color: theme.primary }
                : styles.statusCompleted)
            }}
          >
            {post.status}
          </span>
        </div>

        <div style={styles.details}>
          {isSender() ? (
            <>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Size</span>
                <span style={styles.detailValue}>{SIZE_LABELS[post.size]}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Needed By</span>
                <span style={styles.detailValue}>{formatDate(post.neededBy)}</span>
              </div>
            </>
          ) : (
            <>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Travel Date</span>
                <span style={styles.detailValue}>{formatDate(post.travelDate)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Available Space</span>
                <span style={styles.detailValue}>{SIZE_LABELS[post.availableSpace]}</span>
              </div>
            </>
          )}
        </div>
      </div>
    ));
  };

  const renderActiveDeliveries = () => {
    if (activeDeliveries.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🚚</div>
          <h3 style={styles.emptyTitle}>No active deliveries</h3>
          <p style={styles.emptyText}>Your active deliveries will appear here</p>
        </div>
      );
    }

    return activeDeliveries.map(transaction => {
      const otherUserId = transaction.participants.find(id => id !== currentUser.id);
      const otherUser = getUserById(otherUserId);
      const isMyTurn = (
        (isSender() && transaction.status === 'created') ||
        (!isSender() && ['dropped_off', 'in_transit', 'arrived'].includes(transaction.status))
      );

      return (
        <div key={transaction.id} style={styles.activityCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>{ITEM_TYPE_LABELS[transaction.itemType]}</h3>
              <div style={styles.cardRoute}>
                <span>{transaction.from}</span>
                <span style={styles.arrow}>→</span>
                <span>{transaction.to}</span>
              </div>
            </div>

            <span
              style={{
                ...styles.status,
                backgroundColor: theme.light,
                color: theme.primary
              }}
            >
              {transaction.status}
            </span>
          </div>

          <div style={styles.details}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>{isSender() ? 'Traveler' : 'Sender'}</span>
              <span style={styles.detailValue}>
                {otherUser?.name || 'Unknown'} ⭐ {otherUser?.rating?.toFixed(1) || '5.0'}
              </span>
            </div>

            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Created</span>
              <span style={styles.detailValue}>{formatDate(transaction.createdAt)}</span>
            </div>

            {transaction.recipientAdded && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Recipient</span>
                <span style={styles.detailValue}>✅ {transaction.recipientName}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => setSelectedTransaction(transaction)}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              View Details
            </button>

            {isSender() && !transaction.recipientAdded && (
              <button
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowRecipientModal(true);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Add Recipient
              </button>
            )}

            {isMyTurn && (
              <button
                onClick={() => {
                  const nextStatus =
                    transaction.status === 'created'
                      ? 'dropped_off'
                      : transaction.status === 'dropped_off'
                      ? 'in_transit'
                      : transaction.status === 'in_transit'
                      ? 'arrived'
                      : transaction.status === 'arrived'
                      ? 'delivered'
                      : transaction.status;

                  handleStatusUpdate(transaction.id, nextStatus);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {transaction.status === 'created' && 'Confirm Drop-off'}
                {transaction.status === 'dropped_off' && 'Start Journey'}
                {transaction.status === 'in_transit' && 'Mark Arrived'}
                {transaction.status === 'arrived' && 'Confirm Delivery'}
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'posts'
              ? { ...styles.activeTab, color: theme.primary, borderBottomColor: theme.primary }
              : {})
          }}
          onClick={() => setActiveTab('posts')}
        >
          My Posts ({myPosts.length})
        </button>

        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'incoming'
              ? { ...styles.activeTab, color: theme.primary, borderBottomColor: theme.primary }
              : {})
          }}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Requests ({incoming.length})
        </button>

        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'deliveries'
              ? { ...styles.activeTab, color: theme.primary, borderBottomColor: theme.primary }
              : {})
          }}
          onClick={() => setActiveTab('deliveries')}
        >
          Active Deliveries ({activeDeliveries.length})
        </button>
      </div>

      {activeTab === 'posts' && renderMyPosts()}
      {activeTab === 'incoming' && <IncomingRequests />}
      {activeTab === 'deliveries' && renderActiveDeliveries()}

      {/* Transaction Detail Modal */}
      {selectedTransaction && !showRecipientModal && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Add Recipient Modal */}
      {showRecipientModal && selectedTransaction && (
        <AddRecipientModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowRecipientModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
};

// ========== TRANSACTION DETAIL MODAL ==========
const TransactionDetailModal = ({ transaction, onClose }) => {
  const { getTheme } = useAuth();
  const { getUserById } = useStorage();
  const theme = getTheme();

  const sender = getUserById(transaction.senderId);
  const traveler = getUserById(transaction.travelerId);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '700px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    header: {
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 8px 0',
      color: '#111827'
    },
    route: {
      fontSize: '16px',
      color: '#6b7280',
      margin: 0
    },
    participantsCard: {
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px'
    },
    participantRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0'
    },
    closeButton: {
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      fontWeight: '600',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{ITEM_TYPE_LABELS[transaction.itemType]}</h2>
          <p style={styles.route}>
            {transaction.from} → {transaction.to}
          </p>
        </div>

        <DeliveryStatusTracker transaction={transaction} />

        <div style={styles.participantsCard}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Participants
          </div>
          <div style={styles.participantRow}>
            <span style={{ color: '#6b7280' }}>Sender:</span>
            <span style={{ fontWeight: '600' }}>{sender?.name}</span>
          </div>
          <div style={styles.participantRow}>
            <span style={{ color: '#6b7280' }}>Traveler:</span>
            <span style={{ fontWeight: '600' }}>{traveler?.name}</span>
          </div>
        </div>

        <RecipientInfoCard transaction={transaction} />

        <button onClick={onClose} style={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ActivityView;