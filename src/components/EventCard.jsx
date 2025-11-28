import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { api } from "../api/mockApi";
import { AuthContext } from "../context/AuthContext";

export default function EventCard({ event }) {
  const { user } = useContext(AuthContext);
  const [userRsvp, setUserRsvp] = useState(
    user ? api.getRsvps(event.id).find(r => r.user_id === user.id) : null
  );

  const handleRsvp = (status) => {
    if (!user) return alert("Please login first");
    if (userRsvp) api.removeRsvp(user.id, event.id);
    const newRsvp = api.addRsvp({ user_id: user.id, event_id: event.id, status });
    setUserRsvp(newRsvp);
  };

  const rsvps = api.getRsvps(event.id);
  const firstImage = event.images?.[0] || "https://images.unsplash.com/photo-1556125574-d7f27ec36a06?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="card shadow-lg mb-4 h-100 border-0 rounded-3">
      <img
        src={firstImage}
        className="card-img-top rounded-top"
        alt={event.title}
        style={{ height: "220px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-2">{event.title}</h5>
        <p className="card-text text-muted mb-3" style={{ flexGrow: 1, minHeight: "60px" }}>
          {event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
        </p>

        <p className="mb-1"><strong>Date:</strong> {new Date(event.date_time).toLocaleString()}</p>
        <p className="mb-3"><strong>Location:</strong> {event.location}</p>

        {/* RSVP Buttons */}
        {userRsvp ? (
          <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
            <span className={`badge bg-${userRsvp.status === "Going" ? "success" : userRsvp.status === "Maybe" ? "warning" : "danger"}`}>
              Your RSVP: {userRsvp.status}
            </span>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => { api.removeRsvp(user.id, event.id); setUserRsvp(null); }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button className="btn btn-primary btn-sm" onClick={() => handleRsvp("Going")}>Going</button>
            <button className="btn btn-warning btn-sm" onClick={() => handleRsvp("Maybe")}>Maybe</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleRsvp("Not Going")}>Not Going</button>
          </div>
        )}

        <p className="text-muted mb-3">Total RSVPs: {rsvps.length}</p>
        <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
}
