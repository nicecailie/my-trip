import React from "react";
import { useStorage } from "../../hooks/useStorage";

const Navigation = ({ activeView, onViewChange }) => {
  const { unreadMessageCount } = useStorage();
  const navItems = [
    { id: "feed", label: "Discover" },
    { id: "activity", label: "My activity" },
    { id: "chat", label: "Messages", badge: unreadMessageCount },
    { id: "profile", label: "Profile" },
  ];

  return (
    <nav className="app-navigation" aria-label="Primary navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <button key={item.id} className={activeView === item.id ? "nav-button active" : "nav-button"} onClick={() => onViewChange(item.id)} aria-current={activeView === item.id ? "page" : undefined}>
            {item.label}{item.badge > 0 && <span className="nav-badge" aria-label={`${item.badge} unread messages`}>{item.badge > 99 ? "99+" : item.badge}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
