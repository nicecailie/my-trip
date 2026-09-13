import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export const StorageContext = createContext(null);

const loadStored = (key) => {
  try {
    const stored = localStorage.getItem(`chagga_${key}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const persistStored = (key, value) => {
  try {
    localStorage.setItem(`chagga_${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not persist ${key}:`, error);
  }
};

const mapProfile = (profile) => ({
  id: profile.id,
  name: profile.full_name,
  role: profile.active_role,
  rating: Number(profile.rating ?? 5),
  completedDeliveries: profile.completed_deliveries ?? 0,
  verificationStatus: profile.verification_status,
});

const mapTrip = (trip, names = {}) => ({
  id: trip.id,
  travelerId: trip.traveler_id,
  travelerName: names[trip.traveler_id] || "Chagga traveler",
  from: trip.from_location,
  to: trip.to_location,
  travelDate: trip.travel_date,
  availableSpace: trip.available_space,
  acceptedItems: trip.accepted_items || [],
  deliveryArea: trip.delivery_area || "",
  status: trip.status,
  createdAt: trip.created_at,
});

const mapRequest = (request, names = {}) => ({
  id: request.id,
  senderId: request.sender_id,
  senderName: names[request.sender_id] || "Chagga sender",
  itemType: request.item_type,
  from: request.from_location,
  to: request.to_location,
  neededBy: request.needed_by,
  size: request.size,
  description: request.description || "",
  status: request.status,
  createdAt: request.created_at,
});

const mapProposal = (proposal, names = {}) => ({
  id: proposal.id,
  senderId: proposal.sender_id,
  travelerId: proposal.traveler_id,
  senderName: names[proposal.sender_id] || "Sender",
  travelerName: names[proposal.traveler_id] || "Traveler",
  tripId: proposal.trip_id,
  requestId: proposal.request_id,
  proposedBy: proposal.proposed_by,
  type: proposal.proposal_type,
  from: proposal.from_location,
  to: proposal.to_location,
  itemType: proposal.item_type,
  status: proposal.status,
  createdAt: proposal.created_at,
  respondedAt: proposal.responded_at,
});

export const StorageProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [trips, setTrips] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);
  const [transactions, setTransactions] = useState(() => loadStored("transactions"));
  const [messages, setMessages] = useState(() => loadStored("messages"));
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
  const [marketplaceError, setMarketplaceError] = useState("");

  useEffect(() => persistStored("transactions", transactions), [transactions]);
  useEffect(() => persistStored("messages", messages), [messages]);

  const refreshMarketplace = useCallback(async () => {
    if (!supabase || !currentUser) {
      setUsers(currentUser ? [currentUser] : []);
      setRequests([]);
      setTrips([]);
      setMatchRequests([]);
      return;
    }

    setIsMarketplaceLoading(true);
    setMarketplaceError("");
    const [profilesResult, tripsResult, requestsResult, proposalsResult] = await Promise.all([
      supabase.from("profiles").select("id, full_name, active_role, rating, completed_deliveries, verification_status"),
      supabase.from("trips").select("*").order("travel_date", { ascending: true }),
      supabase.from("delivery_requests").select("*").order("needed_by", { ascending: true }),
      supabase.from("match_proposals").select("*").order("created_at", { ascending: false }),
    ]);

    const failedResult = [profilesResult, tripsResult, requestsResult, proposalsResult].find((result) => result.error);
    if (failedResult) {
      setMarketplaceError(failedResult.error.message);
      setIsMarketplaceLoading(false);
      return;
    }

    const publicUsers = profilesResult.data.map(mapProfile);
    const names = Object.fromEntries(publicUsers.map((user) => [user.id, user.name]));
    setUsers(publicUsers);
    setTrips(tripsResult.data.map((trip) => mapTrip(trip, names)));
    setRequests(requestsResult.data.map((request) => mapRequest(request, names)));
    setMatchRequests(proposalsResult.data.map((proposal) => mapProposal(proposal, names)));
    setIsMarketplaceLoading(false);
  }, [currentUser]);

  useEffect(() => { refreshMarketplace(); }, [refreshMarketplace]);

  const getUserById = (userId) => users.find((user) => user.id === userId) || (currentUser?.id === userId ? currentUser : null);

  const createRequest = async (requestData) => {
    if (!supabase || !currentUser) throw new Error("Sign in before posting a request.");
    const { data, error } = await supabase.from("delivery_requests").insert({
      sender_id: currentUser.id,
      item_type: requestData.itemType,
      from_location: requestData.from,
      to_location: requestData.to,
      needed_by: requestData.neededBy,
      size: requestData.size,
      description: requestData.description?.trim() || null,
    }).select().single();
    if (error) throw error;
    const request = mapRequest(data, { [currentUser.id]: currentUser.name });
    setRequests((previous) => [...previous, request]);
    return request;
  };

  const updateRequest = async (requestId, updates) => {
    const databaseUpdates = {};
    if (updates.status) databaseUpdates.status = updates.status;
    const { error } = await supabase.from("delivery_requests").update(databaseUpdates).eq("id", requestId);
    if (error) throw error;
    setRequests((previous) => previous.map((request) => request.id === requestId ? { ...request, ...updates } : request));
  };

  const getRequestById = (requestId) => requests.find((request) => request.id === requestId);
  const getRequestsBySender = (userId) => requests.filter((request) => request.senderId === userId);
  const getActiveRequests = () => requests.filter((request) => request.status === "pending");

  const createTrip = async (tripData) => {
    if (!supabase || !currentUser) throw new Error("Sign in before posting a trip.");
    const { data, error } = await supabase.from("trips").insert({
      traveler_id: currentUser.id,
      from_location: tripData.from,
      to_location: tripData.to,
      travel_date: tripData.travelDate,
      available_space: tripData.availableSpace,
      accepted_items: tripData.acceptedItems,
      delivery_area: tripData.deliveryArea?.trim() || null,
    }).select().single();
    if (error) throw error;
    const trip = mapTrip(data, { [currentUser.id]: currentUser.name });
    setTrips((previous) => [...previous, trip]);
    return trip;
  };

  const updateTrip = async (tripId, updates) => {
    const databaseUpdates = {};
    if (updates.status) databaseUpdates.status = updates.status;
    const { error } = await supabase.from("trips").update(databaseUpdates).eq("id", tripId);
    if (error) throw error;
    setTrips((previous) => previous.map((trip) => trip.id === tripId ? { ...trip, ...updates } : trip));
  };

  const getTripById = (tripId) => trips.find((trip) => trip.id === tripId);
  const getTripsByTraveler = (userId) => trips.filter((trip) => trip.travelerId === userId);
  const getActiveTrips = () => trips.filter((trip) => trip.status === "available");

  const createMatchRequest = async (proposalData) => {
    if (!supabase || !currentUser) return { success: false, error: "Sign in before proposing a match." };
    const { data, error } = await supabase.from("match_proposals").insert({
      sender_id: proposalData.senderId,
      traveler_id: proposalData.travelerId,
      trip_id: proposalData.tripId || null,
      request_id: proposalData.requestId || null,
      proposed_by: currentUser.id,
      proposal_type: proposalData.type,
      from_location: proposalData.from,
      to_location: proposalData.to,
      item_type: proposalData.itemType,
    }).select().single();

    if (error) {
      return { success: false, error: error.code === "23505" ? "You already have a pending proposal for this post." : error.message };
    }

    const names = Object.fromEntries(users.map((user) => [user.id, user.name]));
    const matchRequest = mapProposal(data, names);
    setMatchRequests((previous) => [matchRequest, ...previous]);
    return { success: true, matchRequest };
  };

  const getIncomingMatchRequests = (userId) => matchRequests.filter(
    (proposal) => proposal.status === "pending" && proposal.proposedBy !== userId &&
      (proposal.senderId === userId || proposal.travelerId === userId)
  );
  const getOutgoingMatchRequests = (userId) => matchRequests.filter(
    (proposal) => proposal.status === "pending" && proposal.proposedBy === userId
  );

  const createTransaction = (transactionData) => {
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      status: "created",
      chatPhase: "negotiation",
      createdAt: new Date().toISOString(),
      participants: [transactionData.senderId, transactionData.travelerId],
      recipientId: null,
      recipientName: "",
      recipientEmail: "",
      recipientPhone: "",
      deliveryPhoto: "",
      photoUploadedAt: "",
      ...transactionData,
    };
    setTransactions((previous) => [...previous, transaction]);
    return transaction;
  };

  const respondToMatchRequest = async (matchRequestId, response) => {
    const proposal = matchRequests.find((item) => item.id === matchRequestId);
    if (!proposal) return { success: false, error: "Match proposal not found." };
    const { error } = await supabase.rpc("respond_to_match_proposal", { proposal_id: matchRequestId, response });
    if (error) return { success: false, error: error.message };
    setMatchRequests((previous) => previous.map((item) => item.id === matchRequestId
      ? { ...item, status: response, respondedAt: new Date().toISOString() }
      : item));

    let transaction = null;
    if (response === "accepted") {
      transaction = createTransaction({
        senderId: proposal.senderId,
        travelerId: proposal.travelerId,
        requestId: proposal.requestId,
        tripId: proposal.tripId,
        from: proposal.from,
        to: proposal.to,
        itemType: proposal.itemType,
      });
      if (proposal.tripId) setTrips((previous) => previous.map((trip) => trip.id === proposal.tripId ? { ...trip, status: "matched" } : trip));
      if (proposal.requestId) setRequests((previous) => previous.map((request) => request.id === proposal.requestId ? { ...request, status: "matched" } : request));
    }
    return { success: true, transaction };
  };

  const getTransactionById = (id) => transactions.find((transaction) => transaction.id === id);
  const getTransactionsByUser = (id) => transactions.filter((transaction) => transaction.participants.includes(id));
  const getActiveTransactions = (id) => transactions.filter((transaction) => transaction.participants.includes(id) && transaction.status !== "closed");
  const updateTransaction = (id, updates) => setTransactions((previous) => previous.map((transaction) => transaction.id === id ? { ...transaction, ...updates } : transaction));
  const addMessage = (messageData) => {
    const message = { id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`, createdAt: new Date().toISOString(), ...messageData };
    setMessages((previous) => [...previous, message]);
    return message;
  };
  const getMessagesByTransaction = (id) => messages.filter((message) => message.transactionId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const value = useMemo(() => ({
    users, getUserById,
    requests, createRequest, getRequestById, updateRequest, getRequestsBySender, getActiveRequests,
    trips, createTrip, getTripById, updateTrip, getTripsByTraveler, getActiveTrips,
    matchRequests, createMatchRequest, getIncomingMatchRequests, getOutgoingMatchRequests,
    acceptMatchRequest: (id) => respondToMatchRequest(id, "accepted"),
    declineMatchRequest: (id) => respondToMatchRequest(id, "declined"),
    transactions, createTransaction, getActiveTransactions, updateTransaction, getTransactionById, getTransactionsByUser,
    messages, addMessage, getMessagesByTransaction,
    refreshMarketplace, isMarketplaceLoading, marketplaceError,
  }), [users, requests, trips, matchRequests, transactions, messages, isMarketplaceLoading, marketplaceError, refreshMarketplace]);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};
