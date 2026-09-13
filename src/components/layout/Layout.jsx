import React, { useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";


import FeedView from "../feed/FeedView";
import ActivityView from "../activity/ActivityView";
import ChatView from "../chat/ChatView";
import ProfileView from "../profile/ProfileView";

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
      case "profile":
        return <ProfileView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="app-main">{renderView()}</main>
    </div>
  );
};

export default Layout;
