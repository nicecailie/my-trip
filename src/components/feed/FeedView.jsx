import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPES } from "../../utils/constants";

import FeedFilters from "./FeedFilters";
import TravelerCard from "./TravelerCard";
import RequestCard from "./RequestCard";
import CreateRequest from "../create/CreateRequest";
import CreateTrip from "../create/CreateTrip";

import {
  filterTripsForSender,
  filterRequestsForTraveler,
  sortItems,
} from "../../utils/helpers";

const FeedView = () => {
  const { isSender, currentUser, getTheme } = useAuth();
  const {
    getActiveTrips,
    getActiveRequests,
    createMatchRequest, // ✅ match-request flow
  } = useStorage();

  const theme = getTheme();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({ sortBy: "date" });

  // Get all items
  const allTrips = getActiveTrips();
  const allRequests = getActiveRequests();

  // Apply filters (NO useMemo)
  let filteredItems = isSender() ? [...allTrips] : [...allRequests];

  if (isSender()) {
    filteredItems = filterTripsForSender(filteredItems, filters);
  } else {
    filteredItems = filterRequestsForTraveler(filteredItems, filters);
  }

  if (filters.sortBy) {
    filteredItems = sortItems(filteredItems, filters.sortBy);
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => {
    if (k === "sortBy") return false; // sorting is not a "filter"
    return v !== undefined && v !== null && v !== "" && v !== false;
  });

  const handleSendRequest = (trip) => {
    const res = createMatchRequest({
      senderId: currentUser.id,
      travelerId: trip.travelerId,
      tripId: trip.id,
      from: trip.from,
      to: trip.to,
      itemType: ITEM_TYPES.DOCUMENTS, // you can later make this selectable
      type: "sender_to_traveler",
      senderName: currentUser.name,
      travelerName: trip.travelerName,
    });

    if (!res?.success) {
      alert(res?.error || res?.message || "Could not send request.");
      return;
    }
    alert("Request sent! The traveler will accept/decline it in Incoming Requests.");
  };

  const handleHelp = (request) => {
    const res = createMatchRequest({
      senderId: request.senderId,
      travelerId: currentUser.id,
      requestId: request.id,
      from: request.from,
      to: request.to,
      itemType: request.itemType,
      type: "traveler_to_sender",
      senderName: request.senderName,
      travelerName: currentUser.name,
    });

    if (!res?.success) {
      alert(res?.error || res?.message || "Could not send interest.");
      return;
    }
    alert("Interest sent! The sender will accept/decline it in Incoming Requests.");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <h2 style={styles.title}>
            {isSender() ? "🧳 Available Travelers" : "📦 Delivery Requests"}
          </h2>
          <p style={styles.subtitle}>
            {isSender()
              ? "Find travelers going your route"
              : "Help someone with their delivery"}
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          style={{ ...styles.createButton, backgroundColor: theme.primary }}
        >
          + {isSender() ? "Post Request" : "Post Trip"}
        </button>
      </div>

      {/* Filters */}
      <FeedFilters
        isSender={isSender()}
        onFilterChange={handleFilterChange}
        theme={theme}
      />

      <div style={styles.safetyNote}>
        <span aria-hidden="true">🛡️</span>
        <span><strong>Carry only what you inspect.</strong> Never accept sealed, unidentified, illegal, or airline-prohibited items. Customs rules always apply.</span>
      </div>

      {/* Results count */}
      {filteredItems.length > 0 && (
        <div style={{ ...styles.resultsInfo, backgroundColor: theme.light, color: theme.primary }}>
          Showing {filteredItems.length} {isSender() ? "traveler" : "request"}
          {filteredItems.length !== 1 ? "s" : ""}
          {hasActiveFilters ? " (filtered)" : ""}
        </div>
      )}

      {/* Grid */}
      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>{isSender() ? "🧳" : "📦"}</div>
            <h3 style={styles.emptyTitle}>
              {hasActiveFilters
                ? "No results found"
                : `No ${isSender() ? "travelers" : "requests"} yet`}
            </h3>
            <p style={styles.emptyText}>
              {hasActiveFilters
                ? "Try adjusting your filters"
                : `Check back later or post your ${isSender() ? "request" : "trip"}`}
            </p>
          </div>
        ) : isSender() ? (
          filteredItems.map((trip) => (
            <TravelerCard
              key={trip.id}
              trip={trip}
              onSendRequest={handleSendRequest}
            />
          ))
        ) : (
          filteredItems.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onHelp={handleHelp}
            />
          ))
        )}
      </div>

      {/* Create form modal */}
      {showCreateForm &&
        (isSender() ? (
          <CreateRequest
            onClose={() => setShowCreateForm(false)}
            onCreate={() => {}}
          />
        ) : (
          <CreateTrip
            onClose={() => setShowCreateForm(false)}
            onCreate={() => {}}
          />
        ))}
    </div>
  );
};

export default FeedView;

const styles = {
  container: { maxWidth: 1200, margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
    flexWrap: "wrap",
  },
  headerText: { flex: 1 },
  title: { fontSize: 28, fontWeight: "bold", margin: "0 0 8px 0", color: "#111827" },
  subtitle: { fontSize: 15, color: "#6b7280", margin: 0 },

  createButton: {
    padding: "12px 24px",
    fontSize: 15,
    fontWeight: 600,
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  resultsInfo: {
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 600,
  },
  safetyNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "12px 14px",
    marginBottom: 16,
    border: "1px solid #fde68a",
    borderRadius: 8,
    backgroundColor: "#fffbeb",
    color: "#78350f",
    fontSize: 13,
    lineHeight: 1.5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: 20,
  },

  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 600, margin: "0 0 8px 0", color: "#111827" },
  emptyText: { fontSize: 15, color: "#6b7280", margin: 0 },
};
