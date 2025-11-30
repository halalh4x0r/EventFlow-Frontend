import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { api } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [userRsvp, setUserRsvp] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currentImg, setCurrentImg] = useState(0);

  // Fetch event, comments, and RSVPs once
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [e, c, r] = await Promise.all([
          api.getEvent(id),
          api.getComments(id),
          api.getRsvps(id)
        ]);

        if (!mounted) return;

        setEvent(e);
        setComments(c);
        setRsvps(r);
      } catch (err) {
        console.error("Failed to load event data", err);
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, [id]);

  // Update userRsvp whenever RSVPs or user changes
  useEffect(() => {
    if (user && rsvps.length) {
      const existingRsvp = rsvps.find(r => r.user_id === user.id);
      setUserRsvp(existingRsvp || null);
    }
  }, [user, rsvps]);

  const handleRsvp = async (status) => {
    if (!user || !event) return alert("Please login first");

    // Remove existing RSVP if any
    if (userRsvp) {
      await api.removeRsvp(userRsvp.id);
      setRsvps(prev => prev.filter(r => r.id !== userRsvp.id));
      setUserRsvp(null);
    }

    // Add new RSVP
    const newRsvp = await api.addRsvp({ user_id: user.id, event_id: event.id, status });
    setRsvps(prev => [...prev, newRsvp]);
    setUserRsvp(newRsvp);
  };

  const handleAddComment = async () => {
    if (!user || !newComment || !event) return;

    const commentData = {
      event_id: event.id,
      user_id: user.id,
      content: newComment,
      created_at: new Date().toISOString()
    };

    const addedComment = await api.addComment(commentData);
    setComments(prev => [...prev, addedComment]);
    setNewComment("");
  };

  if (!event) return <p>Loading event...</p>;

  const images = event.images || [];
  const prevImage = () => setCurrentImg((currentImg - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImg((currentImg + 1) % images.length);

  const summary = { Going: 0, Maybe: 0, "Not Going": 0 };
  rsvps.forEach(r => summary[r.status] = (summary[r.status] || 0) + 1);
  const statusColor = { Going: "success", Maybe: "warning", "Not Going": "danger" };

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
        {images.length > 0 && (
          <div className="position-relative">
            <img
              src={images[currentImg]}
              className="card-img-top rounded-top"
              alt={`Event ${currentImg + 1}`}
              style={{ height: "350px", objectFit: "cover" }}
            />
            {images.length > 1 && <>
              <button onClick={prevImage} className="btn btn-dark position-absolute top-50 start-0 translate-middle-y">&#10094;</button>
              <button onClick={nextImage} className="btn btn-dark position-absolute top-50 end-0 translate-middle-y">&#10095;</button>
            </>}
          </div>
        )}

        <div className="card-body">
          <h3 className="card-title fw-bold">{event.title}</h3>
          <p className="text-muted mb-2">{event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date_time).toLocaleString()}</p>
          <p><strong>Location:</strong> {event.location}</p>

          {/* RSVP */}
          {userRsvp ? (
            <div className="d-flex align-items-center mb-3">
              <span className={`badge bg-${statusColor[userRsvp.status]} me-2`}>Your RSVP: {userRsvp.status}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={async () => {
                await api.removeRsvp(userRsvp.id);
                setRsvps(prev => prev.filter(r => r.id !== userRsvp.id));
                setUserRsvp(null);
              }}>Cancel</button>
            </div>
          ) : (
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-primary btn-sm" onClick={() => handleRsvp("Going")}>Going</button>
              <button className="btn btn-warning btn-sm" onClick={() => handleRsvp("Maybe")}>Maybe</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleRsvp("Not Going")}>Not Going</button>
            </div>
          )}

          {/* Comments */}
          <h5>Comments</h5>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {comments.map(c => (
              <div key={c.id} className={`p-3 mb-2 rounded shadow-sm ${c.user_id === user?.id ? "bg-primary text-white ms-auto" : "bg-light"}`} style={{ maxWidth: "90%" }}>
                <p className="mb-1">{c.content}</p>
                <small className="text-muted">{new Date(c.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
          {user && (
            <div className="d-flex flex-column mt-2">
              <textarea className="form-control mb-2" rows="3" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." />
              <button className="btn btn-primary align-self-end" onClick={handleAddComment}>Submit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
