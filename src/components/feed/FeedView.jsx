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
    <div className="feed-view">
      <div className="feed-header">
        <div>
          <span className="eyebrow">{isSender() ? "Find a travel match" : "Make your trip count"}</span>
          <h1>
            {isSender() ? "Travelers on your route" : "Items heading your way"}
          </h1>
          <p>
            {isSender()
              ? "Compare upcoming journeys and contact the right traveler."
              : "Browse requests that fit your route and available luggage space."}
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="primary-action feed-create"
        >
          <span aria-hidden="true">+</span> {isSender() ? "Post a request" : "Post a trip"}
        </button>
      </div>

      {/* Filters */}
      <FeedFilters
        isSender={isSender()}
        onFilterChange={handleFilterChange}
        theme={theme}
      />

      <div className="safety-note">
        <span className="safety-mark" aria-hidden="true">✓</span>
        <span><strong>Inspect before you carry.</strong> Never accept sealed, unidentified, illegal, or airline-prohibited items. Customs rules always apply.</span>
      </div>

      {/* Results count */}
      {filteredItems.length > 0 && (
        <div className="results-info">
          <span>{filteredItems.length}</span> {isSender() ? "traveler" : "request"}
          {filteredItems.length !== 1 ? "s" : ""}
          {hasActiveFilters ? " (filtered)" : ""}
        </div>
      )}

      {/* Grid */}
      <div className="feed-grid">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-mark" aria-hidden="true">{isSender() ? "T" : "S"}</div>
            <h3>
              {hasActiveFilters
                ? "No results found"
                : `No ${isSender() ? "travelers" : "requests"} yet`}
            </h3>
            <p>
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
