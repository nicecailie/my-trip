import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import ChaggaLogo from "../common/ChaggaLogo";
import { useStorage } from "../../hooks/useStorage";

const Header = () => {
  const { currentUser, logout, switchRole, isSender } = useAuth();
  const { getUserById } = useStorage();
  const profile = getUserById(currentUser?.id) || currentUser;
  const senderMode = isSender();
  const initials = (profile?.name || "Member").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="app-header">
      <div className="app-header-content">
        <div className="brand-lockup app-brand" aria-label="Chagga"><ChaggaLogo /></div>
        <div className="app-user-info">
          <button className="mode-switch" onClick={() => switchRole(senderMode ? ROLES.TRAVELER : ROLES.SENDER)} aria-label={`Switch to ${senderMode ? "traveler" : "sender"} mode`}>
            <span className={senderMode ? "mode-option active" : "mode-option"}>Send</span>
            <span className={!senderMode ? "mode-option active" : "mode-option"}>Travel</span>
          </button>
          <div className="user-avatar" aria-hidden="true">{profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : initials}</div>
          <div className="app-user-details">
            <span className="user-name">{profile?.name}</span>
            <span className="user-role">{senderMode ? "Sender mode" : "Traveler mode"}</span>
          </div>
          <button className="logout-button" onClick={logout}>Sign out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
