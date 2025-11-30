import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { api } from '../services/api';
import { AuthContext } from "../context/AuthContext";

export default function EventCard({ event }) {
  const { user } = useContext(AuthContext);
  const [rsvps, setRsvps] = useState([]);
  const [userRsvp, setUserRsvp] = useState(null);

  // Fetch RSVPs for this event
  useEffect(() => {
    const fetchRsvps = async () => {
      const r = await api.getRsvps(event.id);
      setRsvps(r);
      if (user) {
        const existing = r.find(rsvp => rsvp.user_id === user.id);
        setUserRsvp(existing || null);
      }
    };
    fetchRsvps();
  }, [event.id, user]);

  const handleRsvp = async (status) => {
    if (!user) return alert("Please login first");

    if (userRsvp) {
      await api.removeRsvp(userRsvp.id);
      setRsvps(prev => prev.filter(r => r.id !== userRsvp.id));
      setUserRsvp(null);
    }

    const newRsvp = await api.addRsvp({
      user_id: user.id,
      event_id: event.id,
      status
    });
    setUserRsvp(newRsvp);
    setRsvps(prev => [...prev, newRsvp]);
  };

  const firstImage = event.images && event.images.length > 0
    ? event.images[0]
    : "https://via.placeholder.com/400x200?text=No+Image";

  return (
    <div className="card mb-4 shadow-sm h-100 border-0">
      <img
        src={firstImage}
        className="card-img-top rounded-top"
        alt={event.title}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{event.title}</h5>
        <p className="card-text text-muted" style={{ flexGrow: 1 }}>
          {event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
        </p>

        <p className="mb-1"><strong>Date:</strong> {new Date(event.date_time).toLocaleString()}</p>
        <p className="mb-2"><strong>Location:</strong> {event.location}</p>

        {/* RSVP info */}
        {userRsvp ? (
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-success me-2">Your RSVP: {userRsvp.status}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={async () => {
              await api.removeRsvp(userRsvp.id);
              setRsvps(prev => prev.filter(r => r.id !== userRsvp.id));
              setUserRsvp(null);
            }}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2 mb-2 flex-wrap">
            <button className="btn btn-primary btn-sm" onClick={() => handleRsvp("Going")}>Going</button>
            <button className="btn btn-warning btn-sm" onClick={() => handleRsvp("Maybe")}>Maybe</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleRsvp("Not Going")}>Not Going</button>
          </div>
        )}

        {/* Show RSVP count */}
        <p className="text-muted mb-2">Total RSVPs: {rsvps.length}</p>

        <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
}
