import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";

const Header = () => {
  const { currentUser, logout, switchRole, isSender, getTheme } = useAuth();
  const theme = getTheme();

  return (
    <header className="app-header" style={{ ...styles.header, background: theme.gradient }}>
      <div className="app-header-content" style={styles.headerContent}>
        <h1 className="app-header-logo" style={{ ...styles.headerLogo, color: "white" }}>✈️ MyTrip</h1>

        <div className="app-user-info" style={styles.userInfo}>
          <div className="app-user-details" style={styles.userDetails}>
            <span style={{ ...styles.userName, color: "white" }}>{currentUser?.name}</span>
            <span style={{ ...styles.userRole, color: "rgba(255,255,255,0.9)" }}>
              {isSender() ? "📦 Sender" : "🧳 Traveler"}
            </span>
          </div>

          <button
            className="role-switch-button"
            onClick={() => switchRole(isSender() ? ROLES.TRAVELER : ROLES.SENDER)}
            style={{
              ...styles.switchButton,
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Switch to {isSender() ? "Traveler" : "Sender"}
          </button>

          <button
            className="logout-button"
            onClick={logout}
            style={{
              ...styles.logoutButton,
              backgroundColor: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

const styles = {
  header: { padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  headerContent: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLogo: { fontSize: 24, margin: 0 },
  userInfo: { display: "flex", alignItems: "center", gap: 15 },
  userDetails: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  userName: { fontSize: 15, fontWeight: "bold" },
  userRole: { fontSize: 13 },
  switchButton: { padding: "8px 16px", fontSize: 13, borderRadius: 6, cursor: "pointer", fontWeight: 600 },
  logoutButton: { padding: "8px 16px", fontSize: 13, color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 },
};
