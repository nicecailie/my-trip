import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS, SIZE_LABELS } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import IncomingRequests from "./IncomingRequests";
import Icon from "../common/Icon";

const STATUS_STEPS = ["accepted", "in_transit", "dropped_off", "delivered", "completed"];
const STATUS_LABELS = { accepted: "Accepted", in_transit: "In transit", dropped_off: "Dropped off", delivered: "Confirming", completed: "Completed" };

const RatingForm = ({ delivery, onSubmit }) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    const result = await onSubmit({ deliveryId: delivery.id, stars, comment });
    setSaving(false);
    if (!result.success) setError(result.error || "Rating could not be saved.");
  };

  return <form className="rating-form" onSubmit={submit}><strong>How was your experience?</strong><div className="star-picker" aria-label="Rating">{[1,2,3,4,5].map((value) => <button type="button" key={value} className={value <= stars ? "selected" : ""} onClick={() => setStars(value)} aria-label={`${value} star${value > 1 ? "s" : ""}`}><Icon name="star" /></button>)}</div><input value={comment} onChange={(event) => setComment(event.target.value)} maxLength="300" placeholder="Short comment (optional)" />{error && <span className="field-error">{error}</span>}<button className="secondary-action" disabled={saving}>{saving ? "Saving…" : "Submit rating"}</button></form>;
};

const ActivityView = () => {
  const { currentUser, isSender } = useAuth();
  const {
    getRequestsBySender, getTripsByTraveler, getDeliveriesByUser,
    getUserById, getIncomingMatchRequests, updateDeliveryStatus,
    confirmDelivery, hasRatedDelivery, submitRating,
  } = useStorage();
  const incoming = getIncomingMatchRequests(currentUser.id);
  const [activeTab, setActiveTab] = useState("deliveries");
  const [actionError, setActionError] = useState("");
  const [workingId, setWorkingId] = useState(null);
  const posts = isSender() ? getRequestsBySender(currentUser.id) : getTripsByTraveler(currentUser.id);
  const deliveries = getDeliveriesByUser(currentUser.id);

  const runAction = async (deliveryId, action) => {
    setWorkingId(deliveryId); setActionError("");
    const result = await action();
    setWorkingId(null);
    if (!result.success) setActionError(result.error || "That update could not be saved.");
  };

  const renderPosts = () => posts.length ? posts.map((post) => <article className="simple-post-card" key={post.id}><div><strong>{isSender() ? ITEM_TYPE_LABELS[post.itemType] : `Trip to ${post.to.split(",")[0]}`}</strong><span>{post.from} → {post.to}</span></div><div><span className="delivery-status-pill">{post.status}</span><small>{isSender() ? `${SIZE_LABELS[post.size]} · needed ${formatDate(post.neededBy)}` : `${SIZE_LABELS[post.availableSpace]} · ${formatDate(post.travelDate)}`}</small></div></article>) : <div className="activity-empty"><h3>No posts yet</h3><p>Your {isSender() ? "delivery requests" : "trips"} will appear here.</p></div>;

  const renderDeliveries = () => deliveries.length ? deliveries.map((delivery) => {
    const traveler = currentUser.id === delivery.travelerId;
    const otherUser = getUserById(traveler ? delivery.senderId : delivery.travelerId);
    const ownConfirmed = traveler ? delivery.travelerConfirmedAt : delivery.senderConfirmedAt;
    const currentStep = STATUS_STEPS.indexOf(delivery.status);
    const rated = hasRatedDelivery(delivery.id, currentUser.id);
    return <article className="delivery-card" key={delivery.id}>
      <header><div><span className="eyebrow">{ITEM_TYPE_LABELS[delivery.itemType]}</span><h3>{delivery.from.split(",")[0]} → {delivery.to.split(",")[0]}</h3><p>With {otherUser?.name || "another Chagga member"}</p></div><span className="delivery-status-pill">{STATUS_LABELS[delivery.status] || delivery.status}</span></header>
      <div className="status-steps">{STATUS_STEPS.map((status, index) => <div className={index <= currentStep ? "done" : ""} key={status}><span>{index < currentStep || delivery.status === "completed" ? <Icon name="check" size={13} /> : index + 1}</span><small>{STATUS_LABELS[status]}</small></div>)}</div>
      <div className="delivery-actions">
        {traveler && delivery.status === "accepted" && <button className="primary-action" disabled={workingId === delivery.id} onClick={() => runAction(delivery.id, () => updateDeliveryStatus(delivery.id, "in_transit"))}>Mark in transit</button>}
        {traveler && delivery.status === "in_transit" && <button className="primary-action" disabled={workingId === delivery.id} onClick={() => runAction(delivery.id, () => updateDeliveryStatus(delivery.id, "dropped_off"))}>Confirm drop-off</button>}
        {["dropped_off", "delivered"].includes(delivery.status) && !ownConfirmed && <button className="primary-action" disabled={workingId === delivery.id} onClick={() => runAction(delivery.id, () => confirmDelivery(delivery.id))}>Confirm delivery</button>}
        {["dropped_off", "delivered"].includes(delivery.status) && ownConfirmed && <p className="waiting-note"><Icon name="check" size={16} /> You confirmed. Waiting for the other person.</p>}
      </div>
      {delivery.status === "completed" && !rated && <RatingForm delivery={delivery} onSubmit={submitRating} />}
      {delivery.status === "completed" && rated && <p className="rating-thanks"><Icon name="check" size={16} /> Rating submitted. Thank you.</p>}
    </article>;
  }) : <div className="activity-empty"><h3>No deliveries yet</h3><p>When a match is accepted, its progress will appear here.</p></div>;

  return <section className="activity-view"><header className="page-heading compact"><span className="eyebrow">Keep track without the complexity</span><h1>My activity</h1><p>Your posts, matches, and active deliveries in one place.</p></header>
    <nav className="simple-tabs" aria-label="Activity sections"><button className={activeTab === "deliveries" ? "active" : ""} onClick={() => setActiveTab("deliveries")}>Deliveries</button><button className={activeTab === "matches" ? "active" : ""} onClick={() => setActiveTab("matches")}>Match requests{incoming.length > 0 && <span>{incoming.length}</span>}</button><button className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>My posts</button></nav>
    {actionError && <div className="notice notice-error">{actionError}</div>}
    <div className="activity-content">{activeTab === "deliveries" ? renderDeliveries() : activeTab === "matches" ? <IncomingRequests /> : renderPosts()}</div>
  </section>;
};

export default ActivityView;
