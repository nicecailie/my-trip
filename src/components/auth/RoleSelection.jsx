// src/components/auth/RoleSelection.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';
import { styles } from '../../styles/styles';

const RoleSelection = () => {
  const { quickLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowNameInput(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && selectedRole) {
      quickLogin(name.trim(), selectedRole);
    }
  };

  if (showNameInput) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <button 
            onClick={() => setShowNameInput(false)}
            style={styles.backButton}
          >
            ← Back
          </button>
          
          <h2 style={styles.title}>What's your name?</h2>
          <p style={styles.subtitle}>
            You're signing up as a {selectedRole === ROLES.SENDER ? 'Sender' : 'Traveler'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              autoFocus
            />
            
            <button 
              type="submit"
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: name.trim() ? 1 : 0.5
              }}
              disabled={!name.trim()}
            >
              Continue
            </button>
          </form>

          <p style={styles.testNote}>
            💡 Quick test accounts: Try "Amara" or "John"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>✈️ MyTrip</h1>
        <h2 style={styles.title}>Welcome! How will you use MyTrip?</h2>
        <p style={styles.subtitle}>
          Connect senders and travelers for peer-to-peer delivery
        </p>

        <div style={styles.roleGrid}>
          {/* Sender Option */}
          <button
            onClick={() => handleRoleSelect(ROLES.SENDER)}
            style={styles.roleCard}
          >
            <div style={styles.roleIcon}>📦</div>
            <h3 style={styles.roleTitle}>I'm a Sender</h3>
            <p style={styles.roleDescription}>
              I need someone to deliver an item for me
            </p>
            <ul style={styles.roleFeatures}>
              <li>Post delivery requests</li>
              <li>Browse available travelers</li>
              <li>Track your deliveries</li>
            </ul>
          </button>

          {/* Traveler Option */}
          <button
            onClick={() => handleRoleSelect(ROLES.TRAVELER)}
            style={styles.roleCard}
          >
            <div style={styles.roleIcon}>🧳</div>
            <h3 style={styles.roleTitle}>I'm a Traveler</h3>
            <p style={styles.roleDescription}>
              I'm traveling and can carry items
            </p>
            <ul style={styles.roleFeatures}>
              <li>Post your travel plans</li>
              <li>Browse delivery requests</li>
              <li>Earn money while traveling</li>
            </ul>
          </button>
        </div>

        <p style={styles.note}>
          You can switch between roles anytime after signing up
        </p>
      </div>
    </div>
  );
};
export default RoleSelection;