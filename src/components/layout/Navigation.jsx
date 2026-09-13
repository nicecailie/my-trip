import React from "react";

const Navigation = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: "feed", label: "Discover" },
    { id: "activity", label: "My activity" },
    { id: "chat", label: "Messages" },
  ];

  return (
    <nav className="app-navigation" aria-label="Primary navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <button key={item.id} className={activeView === item.id ? "nav-button active" : "nav-button"} onClick={() => onViewChange(item.id)} aria-current={activeView === item.id ? "page" : undefined}>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
