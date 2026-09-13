import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export const StorageContext = createContext(null);

const mapProfile = (profile) => ({
  id: profile.id,
  name: profile.full_name,
  role: profile.active_role,
  rating: Number(profile.rating ?? 5),
  completedDeliveries: profile.completed_deliveries ?? 0,
  verificationStatus: profile.verification_status,
  avatarUrl: profile.avatar_url || "",
  usualRoutes: Array.isArray(profile.usual_routes) ? profile.usual_routes : [],
  createdAt: profile.created_at,
});

const mapTrip = (trip, names = {}) => ({
  id: trip.id,
  travelerId: trip.traveler_id,
  travelerName: names[trip.traveler_id] || "Traveler",
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
  senderName: names[request.sender_id] || "Sender",
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
});

const mapDelivery = (delivery) => ({
  id: delivery.id,
  proposalId: delivery.proposal_id,
  senderId: delivery.sender_id,
  travelerId: delivery.traveler_id,
  tripId: delivery.trip_id,
  requestId: delivery.request_id,
  from: delivery.from_location,
  to: delivery.to_location,
  itemType: delivery.item_type,
  status: delivery.status,
  senderConfirmedAt: delivery.sender_confirmed_at,
  travelerConfirmedAt: delivery.traveler_confirmed_at,
  createdAt: delivery.created_at,
  completedAt: delivery.completed_at,
  participants: [delivery.sender_id, delivery.traveler_id],
});

const mapMessage = (message) => ({
  id: message.id,
  deliveryId: message.delivery_id,
  transactionId: message.delivery_id,
  senderId: message.sender_id,
  recipientId: message.recipient_id,
  text: message.body,
  type: message.kind,
  readAt: message.read_at,
  createdAt: message.created_at,
});

const mapRating = (rating) => ({
  id: rating.id,
  deliveryId: rating.delivery_id,
  raterId: rating.rater_id,
  ratedUserId: rating.rated_user_id,
  stars: rating.stars,
  comment: rating.comment || "",
  createdAt: rating.created_at,
});

export const StorageProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [trips, setTrips] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
  const [marketplaceError, setMarketplaceError] = useState("");

  const refreshMarketplace = useCallback(async () => {
    if (!supabase || !currentUser) {
      setUsers(currentUser ? [currentUser] : []);
      setRequests([]); setTrips([]); setMatchRequests([]);
      setDeliveries([]); setMessages([]); setRatings([]);
      return;
    }

    setIsMarketplaceLoading(true);
    setMarketplaceError("");
    const results = await Promise.all([
      supabase.from("profiles").select("id, full_name, active_role, rating, completed_deliveries, verification_status, avatar_url, usual_routes, created_at"),
      supabase.from("trips").select("*").order("travel_date", { ascending: true }),
      supabase.from("delivery_requests").select("*").order("needed_by", { ascending: true }),
      supabase.from("match_proposals").select("*").order("created_at", { ascending: false }),
      supabase.from("deliveries").select("*").order("created_at", { ascending: false }),
      supabase.from("messages").select("*").order("created_at", { ascending: true }),
      supabase.from("ratings").select("*").order("created_at", { ascending: false }),
    ]);

    const failed = results.find((result) => result.error);
    if (failed) {
      setMarketplaceError(failed.error.message);
      setIsMarketplaceLoading(false);
      return;
    }

    const publicUsers = results[0].data.map(mapProfile);
    const names = Object.fromEntries(publicUsers.map((user) => [user.id, user.name]));
    setUsers(publicUsers);
    setTrips(results[1].data.map((trip) => mapTrip(trip, names)));
    setRequests(results[2].data.map((request) => mapRequest(request, names)));
    setMatchRequests(results[3].data.map((proposal) => mapProposal(proposal, names)));
    setDeliveries(results[4].data.map(mapDelivery));
    setMessages(results[5].data.map(mapMessage));
    setRatings(results[6].data.map(mapRating));
    setIsMarketplaceLoading(false);
  }, [currentUser]);

  useEffect(() => { refreshMarketplace(); }, [refreshMarketplace]);

  useEffect(() => {
    if (!supabase || !currentUser) return undefined;
    const channel = supabase.channel(`chagga-mvp-${currentUser.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, refreshMarketplace)
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, refreshMarketplace)
      .on("postgres_changes", { event: "*", schema: "public", table: "match_proposals" }, refreshMarketplace)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUser, refreshMarketplace]);

  const names = useMemo(() => Object.fromEntries(users.map((user) => [user.id, user.name])), [users]);
  const getUserById = (id) => users.find((user) => user.id === id) || (currentUser?.id === id ? currentUser : null);
  const getRequestById = (id) => requests.find((request) => request.id === id);
  const getRequestsBySender = (id) => requests.filter((request) => request.senderId === id);
  const getActiveRequests = () => requests.filter((request) => request.status === "pending");
  const getTripById = (id) => trips.find((trip) => trip.id === id);
  const getTripsByTraveler = (id) => trips.filter((trip) => trip.travelerId === id);
  const getActiveTrips = () => trips.filter((trip) => trip.status === "available");
  const getDeliveriesByUser = (id) => deliveries.filter((delivery) => delivery.participants.includes(id));
  const getDeliveryById = (id) => deliveries.find((delivery) => delivery.id === id);
  const getMessagesByDelivery = (id) => messages.filter((message) => message.deliveryId === id);
  const getMessagesByTransaction = getMessagesByDelivery;
  const getRatingsByUser = (id) => ratings.filter((rating) => rating.ratedUserId === id);
  const hasRatedDelivery = (deliveryId, userId) => ratings.some((rating) => rating.deliveryId === deliveryId && rating.raterId === userId);
  const unreadMessageCount = messages.filter((message) => message.recipientId === currentUser?.id && !message.readAt).length;

  const createRequest = async (requestData) => {
    const { data, error } = await supabase.from("delivery_requests").insert({
      sender_id: currentUser.id, item_type: requestData.itemType,
      from_location: requestData.from, to_location: requestData.to,
      needed_by: requestData.neededBy, size: requestData.size,
      description: requestData.description?.trim() || null,
    }).select().single();
    if (error) throw error;
    const request = mapRequest(data, names);
    setRequests((previous) => [...previous, request]);
    return request;
  };

  const createTrip = async (tripData) => {
    const { data, error } = await supabase.from("trips").insert({
      traveler_id: currentUser.id, from_location: tripData.from,
      to_location: tripData.to, travel_date: tripData.travelDate,
      available_space: tripData.availableSpace, accepted_items: tripData.acceptedItems,
      delivery_area: tripData.deliveryArea?.trim() || null,
    }).select().single();
    if (error) throw error;
    const trip = mapTrip(data, names);
    setTrips((previous) => [...previous, trip]);
    return trip;
  };

  const createMatchRequest = async (proposalData) => {
    const { data, error } = await supabase.from("match_proposals").insert({
      sender_id: proposalData.senderId, traveler_id: proposalData.travelerId,
      trip_id: proposalData.tripId || null, request_id: proposalData.requestId || null,
      proposed_by: currentUser.id, proposal_type: proposalData.type,
      from_location: proposalData.from, to_location: proposalData.to,
      item_type: proposalData.itemType,
    }).select().single();
    if (error) return { success: false, error: error.code === "23505" ? "You already have a pending proposal for this post." : error.message };
    const proposal = mapProposal(data, names);
    setMatchRequests((previous) => [proposal, ...previous]);
    return { success: true, matchRequest: proposal };
  };

  const getIncomingMatchRequests = (userId) => matchRequests.filter((proposal) =>
    proposal.status === "pending" && proposal.proposedBy !== userId &&
    (proposal.senderId === userId || proposal.travelerId === userId));
  const getOutgoingMatchRequests = (userId) => matchRequests.filter((proposal) => proposal.status === "pending" && proposal.proposedBy === userId);

  const respondToMatchRequest = async (id, response) => {
    const { error } = await supabase.rpc("respond_to_match_proposal", { proposal_id: id, response });
    if (error) return { success: false, error: error.message };
    await refreshMarketplace();
    return { success: true };
  };

  const sendMessage = async (deliveryId, body) => {
    const delivery = getDeliveryById(deliveryId);
    const recipientId = delivery.senderId === currentUser.id ? delivery.travelerId : delivery.senderId;
    const { data, error } = await supabase.from("messages").insert({
      delivery_id: deliveryId, sender_id: currentUser.id,
      recipient_id: recipientId, body: body.trim(), kind: "text",
    }).select().single();
    if (error) throw error;
    const message = mapMessage(data);
    setMessages((previous) => [...previous, message]);
    return message;
  };

  const deleteMessage = async (id) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
    setMessages((previous) => previous.filter((message) => message.id !== id));
  };

  const markMessagesRead = async (deliveryId) => {
    const unreadIds = messages.filter((message) => message.deliveryId === deliveryId && message.recipientId === currentUser.id && !message.readAt).map((message) => message.id);
    if (!unreadIds.length) return;
    const readAt = new Date().toISOString();
    const { error } = await supabase.from("messages").update({ read_at: readAt }).in("id", unreadIds);
    if (!error) setMessages((previous) => previous.map((message) => unreadIds.includes(message.id) ? { ...message, readAt } : message));
  };

  const updateDeliveryStatus = async (id, status) => {
    const { error } = await supabase.rpc("update_delivery_status", { delivery_id: id, next_status: status });
    if (error) return { success: false, error: error.message };
    await refreshMarketplace();
    return { success: true };
  };

  const confirmDelivery = async (id) => {
    const { error } = await supabase.rpc("confirm_delivery", { delivery_id: id });
    if (error) return { success: false, error: error.message };
    await refreshMarketplace();
    return { success: true };
  };

  const submitRating = async ({ deliveryId, stars, comment }) => {
    const delivery = getDeliveryById(deliveryId);
    const ratedUserId = delivery.senderId === currentUser.id ? delivery.travelerId : delivery.senderId;
    const { error } = await supabase.from("ratings").insert({
      delivery_id: deliveryId, rater_id: currentUser.id,
      rated_user_id: ratedUserId, stars, comment: comment.trim() || null,
    });
    if (error) return { success: false, error: error.message };
    await refreshMarketplace();
    return { success: true };
  };

  const updateProfile = async ({ name, usualRoutes }) => {
    const { error } = await supabase.from("profiles").update({ full_name: name.trim(), usual_routes: usualRoutes }).eq("id", currentUser.id);
    if (error) return { success: false, error: error.message };
    await refreshMarketplace();
    return { success: true };
  };

  const uploadProfilePicture = async (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${currentUser.id}/avatar.${extension}`;
    const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) return { success: false, error: uploadError.message };
    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(path);
    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
    const { error } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", currentUser.id);
    if (error) return { success: false, error: error.message };
    await refreshMarketplace();
    return { success: true, avatarUrl };
  };

  const value = {
    users, getUserById,
    requests, createRequest, getRequestById, getRequestsBySender, getActiveRequests,
    trips, createTrip, getTripById, getTripsByTraveler, getActiveTrips,
    matchRequests, createMatchRequest, getIncomingMatchRequests, getOutgoingMatchRequests,
    acceptMatchRequest: (id) => respondToMatchRequest(id, "accepted"),
    declineMatchRequest: (id) => respondToMatchRequest(id, "declined"),
    deliveries, getDeliveriesByUser, getDeliveryById, updateDeliveryStatus, confirmDelivery,
    messages, sendMessage, deleteMessage, markMessagesRead, getMessagesByDelivery, getMessagesByTransaction, unreadMessageCount,
    ratings, getRatingsByUser, hasRatedDelivery, submitRating,
    updateProfile, uploadProfilePicture,
    refreshMarketplace, isMarketplaceLoading, marketplaceError,
    transactions: deliveries,
    getActiveTransactions: getDeliveriesByUser,
    getTransactionsByUser: getDeliveriesByUser,
    getTransactionById: getDeliveryById,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};
