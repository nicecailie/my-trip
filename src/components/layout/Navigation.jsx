import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { styles} from '../../styles/styles';

const Navigation = ({ activeView, onViewChange }) => {
  const { getTheme } = useAuth();
  const theme = getTheme();

  const navItems = [
    { id: "feed", label: "🏠 Feed" },
    { id: "activity", label: "📋 My Activity" },
    { id: "chat", label: "💬 Messages" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              ...styles.navButton,
              ...(activeView === item.id
                ? { ...styles.activeNavButton, color: theme.primary, borderBottomColor: theme.primary }
                : {}),
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
