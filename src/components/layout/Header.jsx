import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";

const Header = () => {
  const { currentUser, logout, switchRole, isSender } = useAuth();
  const senderMode = isSender();
  const initials = (currentUser?.name || "Member").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="brand-lockup app-brand" aria-label="MyTrip">
          <span className="brand-mark" aria-hidden="true">M</span><span>MyTrip</span>
        </div>
        <div className="app-user-info">
          <button className="mode-switch" onClick={() => switchRole(senderMode ? ROLES.TRAVELER : ROLES.SENDER)} aria-label={`Switch to ${senderMode ? "traveler" : "sender"} mode`}>
            <span className={senderMode ? "mode-option active" : "mode-option"}>Send</span>
            <span className={!senderMode ? "mode-option active" : "mode-option"}>Travel</span>
          </button>
          <div className="user-avatar" aria-hidden="true">{initials}</div>
          <div className="app-user-details">
            <span className="user-name">{currentUser?.name}</span>
            <span className="user-role">{senderMode ? "Sender mode" : "Traveler mode"}</span>
          </div>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
