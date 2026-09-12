// src/components/delivery/RecipientSystem.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useStorage } from '../../hooks/useStorage';

// ========== ADD RECIPIENT MODAL ==========
export const AddRecipientModal = ({ transaction, onClose }) => {
  const { getTheme } = useAuth();
  const { updateTransaction } = useStorage();
  const theme = getTheme();

  const [form, setForm] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    deliveryAddress: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateTransaction(transaction.id, {
      ...form,
      recipientAdded: true,
      recipientAddedAt: new Date().toISOString()
    });

    alert('✅ Recipient added successfully!');
    onClose();
  };

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
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    header: {
      marginBottom: '24px'
    },
    title: {
      fontSize: '22px',
      fontWeight: 'bold',
      margin: '0 0 8px 0',
      color: '#111827'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '6px',
      display: 'block'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxSizing: 'border-box'
    },
    actions: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px'
    },
    button: {
      flex: 1,
      padding: '14px',
      fontSize: '15px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    submitButton: {
      backgroundColor: theme.primary,
      color: 'white'
    }
  };

  const isValid = form.recipientName && form.recipientEmail && form.recipientPhone;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Recipient Details</h2>
          <p style={styles.subtitle}>
            Who will receive this delivery at {transaction.to}?
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Recipient Name *</label>
            <input
              type="text"
              style={styles.input}
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label style={styles.label}>Recipient Email *</label>
            <input
              type="email"
              style={styles.input}
              value={form.recipientEmail}
              onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label style={styles.label}>Recipient Phone *</label>
            <input
              type="tel"
              style={styles.input}
              value={form.recipientPhone}
              onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
              placeholder="+254712345678"
              required
            />
          </div>

          <div>
            <label style={styles.label}>Delivery Address (Optional)</label>
            <textarea
              style={{ ...styles.input, minHeight: '80px' }}
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              placeholder="123 Main St, Nairobi"
            />
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              style={{
                ...styles.button,
                ...styles.submitButton,
                opacity: isValid ? 1 : 0.5
              }}
            >
              Add Recipient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========== DELIVERY STATUS TRACKER ==========
export const DeliveryStatusTracker = ({ transaction }) => {
  const { getTheme } = useAuth();
  const theme = getTheme();

  const statuses = [
    { key: 'created', label: 'Match Created', icon: '🤝' },
    { key: 'dropped_off', label: 'Item Dropped Off', icon: '📦' },
    { key: 'in_transit', label: 'In Transit', icon: '✈️' },
    { key: 'arrived', label: 'Traveler Arrived', icon: '🛬' },
    { key: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  const currentIndex = statuses.findIndex(s => s.key === transaction.status);

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '24px',
      marginBottom: '20px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#111827'
    },
    timeline: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    icon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    stepLabel: {
      fontSize: '15px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Delivery Status</h3>
      <div style={styles.timeline}>
        {statuses.map((status, index) => {
          const isComplete = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status.key} style={styles.step}>
              <div
                style={{
                  ...styles.icon,
                  backgroundColor: isComplete ? theme.primary : '#f3f4f6',
                  color: isComplete ? 'white' : '#9ca3af',
                  border: isCurrent ? `3px solid ${theme.primary}` : 'none'
                }}
              >
                {isComplete ? '✓' : status.icon}
              </div>
              <span
                style={{
                  ...styles.stepLabel,
                  color: isComplete ? '#111827' : '#9ca3af'
                }}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ========== RECIPIENT INFO CARD ==========
export const RecipientInfoCard = ({ transaction }) => {
  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '20px',
      marginBottom: '20px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#111827'
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px'
    },
    label: {
      color: '#6b7280',
      fontWeight: '500'
    },
    value: {
      color: '#111827',
      fontWeight: '500'
    },
    empty: {
      padding: '20px',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '14px'
    }
  };

  if (!transaction.recipientAdded) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>Recipient Information</h3>
        <div style={styles.empty}>
          No recipient added yet
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Recipient Information</h3>
      <div style={styles.info}>
        <div style={styles.row}>
          <span style={styles.label}>Name:</span>
          <span style={styles.value}>{transaction.recipientName}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Email:</span>
          <span style={styles.value}>{transaction.recipientEmail}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Phone:</span>
          <span style={styles.value}>{transaction.recipientPhone}</span>
        </div>
        {transaction.deliveryAddress && (
          <div style={styles.row}>
            <span style={styles.label}>Address:</span>
            <span style={styles.value}>{transaction.deliveryAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
};