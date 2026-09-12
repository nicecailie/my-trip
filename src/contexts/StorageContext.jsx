// src/contexts/StorageContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const StorageContext = createContext(null);

const futureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

const seedData = {
  users: [
    { id: "demo_traveler_amina", name: "Amina Kamau", email: "amina@example.com", role: "traveler", rating: 4.9, completedDeliveries: 18, createdAt: new Date().toISOString() },
    { id: "demo_traveler_moussa", name: "Moussa Diallo", email: "moussa@example.com", role: "traveler", rating: 5, completedDeliveries: 11, createdAt: new Date().toISOString() },
    { id: "demo_sender_esi", name: "Esi Agyeman", email: "esi@example.com", role: "sender", rating: 4.8, completedDeliveries: 7, createdAt: new Date().toISOString() },
  ],
  trips: [
    { id: "demo_trip_1", travelerId: "demo_traveler_amina", travelerName: "Amina Kamau", from: "Nairobi, Kenya", to: "London, UK", travelDate: futureDate(7), availableSpace: "large", acceptedItems: ["documents", "clothes", "gifts"], deliveryArea: "Central London", status: "available", createdAt: new Date().toISOString(), receivedRequests: [] },
    { id: "demo_trip_2", travelerId: "demo_traveler_moussa", travelerName: "Moussa Diallo", from: "Paris, France", to: "Dakar, Senegal", travelDate: futureDate(12), availableSpace: "medium", acceptedItems: ["documents", "electronics"], deliveryArea: "Dakar Plateau", status: "available", createdAt: new Date().toISOString(), receivedRequests: [] },
  ],
  requests: [
    { id: "demo_request_1", senderId: "demo_sender_esi", senderName: "Esi Agyeman", itemType: "documents", from: "Accra, Ghana", to: "Lagos, Nigeria", neededBy: futureDate(10), size: "small", description: "University documents in an open envelope for inspection.", status: "pending", createdAt: new Date().toISOString(), interestedTravelers: [] },
    { id: "demo_request_2", senderId: "demo_sender_esi", senderName: "Esi Agyeman", itemType: "clothes", from: "London, UK", to: "Nairobi, Kenya", neededBy: futureDate(18), size: "medium", description: "A small set of new baby clothes with receipts.", status: "pending", createdAt: new Date().toISOString(), interestedTravelers: [] },
  ],
};

const loadStored = (key, fallback) => {
  try {
    const stored = localStorage.getItem(`mytrip_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const persistStored = (key, value) => {
  try {
    localStorage.setItem(`mytrip_${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not persist ${key}:`, error);
  }
};

export const StorageProvider = ({ children }) => {
  const [users, setUsers] = useState(() => loadStored("users", seedData.users));
  const [requests, setRequests] = useState(() => loadStored("requests", seedData.requests));
  const [trips, setTrips] = useState(() => loadStored("trips", seedData.trips));
  //New
  const [matchRequests, setMatchRequests] = useState(() => loadStored("match_requests", []));
  const [transactions, setTransactions] = useState(() => loadStored("transactions", []));
  const [messages, setMessages] = useState(() => loadStored("messages", []));

  useEffect(() => persistStored("users", users), [users]);
  useEffect(() => persistStored("requests", requests), [requests]);
  useEffect(() => persistStored("trips", trips), [trips]);
  useEffect(() => persistStored("match_requests", matchRequests), [matchRequests]);
  useEffect(() => persistStored("transactions", transactions), [transactions]);
  useEffect(() => persistStored("messages", messages), [messages]);

  const createUser = (userData) => {
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      completedDeliveries: 0,
      ...userData,
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const getUserById = (userId) => users.find((u) => u.id === userId);
  const getUserByEmail = (email) =>
    users.find((u) => u.email?.toLowerCase() === email?.toLowerCase());

  const updateUser = (userId, updates) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  };

  // =============REQUESTS================
  const createRequest = (requestData) => {
    const newRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      interestedTravelers: [],
      ...requestData,
    };
    setRequests((prev) => [...prev, newRequest]);
    return newRequest;
  };

  const getRequestById = (requestId) => requests.find((r) => r.id === requestId);

  const updateRequest = (requestId, updates) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, ...updates } : r)));
};

  const getRequestsBySender = (userId) => requests.filter((r) => r.senderId === userId);
  const getActiveRequests = () => requests.filter((r) => r.status === "pending");

  const createTrip = (tripData) => {
    const newTrip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: "available",
      createdAt: new Date().toISOString(),
      receivedRequests: [],
      ...tripData,
    };
    setTrips((prev) => [...prev, newTrip]);
    return newTrip;
  };

  const updateTrip = (tripId, updates) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, ...updates } : t))
    );
  };

  const getTripById = (tripId) => trips.find((t) => t.id === tripId);
  const getTripsByTraveler = (userId) => trips.filter((t) => t.travelerId === userId);
  const getActiveTrips = () => trips.filter((t) => t.status === "available");


  const createTransaction = (transactionData) => {
    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
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
    setTransactions((prev) => [...prev, newTransaction]);

    if (transactionData.requestId) updateRequest(transactionData.requestId, { status: "matched" });
    if (transactionData.tripId) updateTrip(transactionData.tripId, { status: "matched" });

    return newTransaction;
  };

  const getTransactionById = (transactionId) =>
    transactions.find((t) => t.id === transactionId);

  const getTransactionsByUser = (userId) =>
    transactions.filter((t) => t.participants.includes(userId));

  const getActiveTransactions = (userId) =>
    transactions.filter((t) => t.participants.includes(userId) && t.status !== "closed");

  const updateTransaction = (transactionId, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, ...updates } : t))
    );
  };

  // =============MATCH REQUESTS================
  const createMatchRequest = (data) => {
    const existing = matchRequests.find(
      (mr) =>
        mr.senderId === data.senderId &&
        mr.travelerId === data.travelerId &&
        mr.status === "pending" &&
        ((mr.requestId && data.requestId && mr.requestId === data.requestId) ||
         (mr.tripId && data.tripId && mr.tripId === data.tripId))
    );
    if (existing) { return {success: false, message: "Match request already exists"};}

    const matchRequest = {
      id: `match_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: "pending", // pending | accepted | declined
      createdAt: new Date().toISOString(),
      ...data,
    };

    setMatchRequests((prev) => [...prev, matchRequest]);
    return { success: true, matchRequest };
  };

  const getIncomingMatchRequests = (userId, role) => {
    if (role === "sender") {
      return matchRequests.filter(
        (mr) => mr.senderId === userId && mr.type === "traveler_to_sender" && mr.status === "pending"
      );
    }
    return matchRequests.filter(
      (mr) => mr.travelerId === userId && mr.type === "sender_to_traveler" && mr.status === "pending"
    );
  };

  const getOutgoingMatchRequests = (userId, role) => {
    if (role === "sender") {
      return matchRequests.filter(
        (mr) => mr.senderId === userId && mr.type === "sender_to_traveler" && mr.status === "pending"
      );
    }
    return matchRequests.filter(
      (mr) => mr.travelerId === userId && mr.type === "traveler_to_sender" && mr.status === "pending"
    );
  };

  const acceptMatchRequest = (matchRequestId) => {
    const matchReq = matchRequests.find((mr) => mr.id === matchRequestId);
    if (!matchReq) { return { success: false, message: "Match request not found" }; }

    setMatchRequests((prev) =>
      prev.map((mr) => (mr.id === matchRequestId ? { ...mr, status: "accepted" } : mr))
    );

    const transaction = createTransaction({
        senderId: matchReq.senderId, 
        travelerId: matchReq.travelerId, 
        requestId: matchReq.requestId, 
        tripId: matchReq.tripId, 
        from: matchReq.from, 
        to: matchReq.to, 
        itemType: matchReq.itemType,
    }); 
    if (matchReq.requestId) updateRequest (matchReq.requestId, {status: "matched"}); 
    if (matchReq.tripId) updateTrip(matchReq.tripId, {status: "matched"});

    return { success: true, transaction };
  };

  const declineMatchRequest = (matchRequestId) => {
    setMatchRequests((prev) =>
      prev.map((mr) => (mr.id === matchRequestId ? { ...mr, status: "declined" } : mr))
    );
    return { success: true };
  };

// =============MESSAGES================
  const addMessage = (messageData) => {
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...messageData,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const getMessagesByTransaction = (transactionId) =>
    messages.filter((m) => m.transactionId === transactionId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const value = {
    users,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,

    requests,
    createRequest,
    getRequestById, 
    updateRequest,
    getRequestsBySender,
    getActiveRequests,

    matchRequests, 
    createMatchRequest, 
    getIncomingMatchRequests, 
    getOutgoingMatchRequests, 
    acceptMatchRequest, 
    declineMatchRequest,

    trips,
    createTrip,
    getTripById, 
    updateTrip,
    getTripsByTraveler,
    getActiveTrips,

    transactions,
    createTransaction,
    getActiveTransactions,
    updateTransaction,
    getTransactionById, 
    getTransactionsByUser, 

    messages,
    addMessage,
    getMessagesByTransaction,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};
 
