import React, { useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";


import FeedView from "../feed/FeedView";
import ActivityView from "../activity/ActivityView";
import ChatView from "../chat/ChatView";

const Layout = () => {
  const [activeView, setActiveView] = useState("feed");

  const renderView = () => {
    switch (activeView) {
      case "feed":
        return <FeedView />;
      case "activity":
        return <ActivityView />;
      case "chat":
        return <ChatView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <Header />
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="app-main" style={styles.mainContent}>{renderView()}</main>
    </div>
  );
};
const styles = {
  mainContent: { maxWidth: 1200, margin: "0 auto", padding: "0 20px 24px" },
}; 

export default Layout;

