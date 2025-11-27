import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { api } from "../api/mockApi";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const event = api.getEvent(id);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState(api.getComments(id));
  const [newComment, setNewComment] = useState("");

  // User RSVP
  const [userRsvp, setUserRsvp] = useState(
    user ? api.getRsvps(event.id).find(r => r.user_id === user.id) : null
  );

  // All RSVPs
  const rsvps = api.getRsvps(event.id);

  const handleRsvp = (status) => {
    if (!user) return alert("Please login first");

    if (userRsvp) api.removeRsvp(user.id, event.id);

    const newRsvp = api.addRsvp({ user_id: user.id, event_id: event.id, status });
    setUserRsvp(newRsvp);
  };

  const handleAddComment = () => {
    if (!user || !newComment) return;
    const comment = {
      id: Date.now(),
      event_id: event.id,
      user_id: user.id,
      content: newComment,
      created_at: new Date().toISOString()
    };
    api.addComment(comment);
    setComments([...comments, comment]);
    setNewComment("");
  };

  // Images carousel
  const [currentImg, setCurrentImg] = useState(0);
  const images = event.images || [];
  const prevImage = () => setCurrentImg((currentImg - 1 + images.length) % images.length);
  const nextImage = () => setCurrentImg((currentImg + 1) % images.length);

  // RSVP summary
  const summary = { Going: 0, Maybe: 0, "Not Going": 0 };
  rsvps.forEach(r => summary[r.status] = (summary[r.status] || 0) + 1);

  // RSVP color map
  const statusColor = { Going: "success", Maybe: "warning", "Not Going": "danger" };

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
        {/* Event Images */}
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
              <button className="btn btn-outline-danger btn-sm" onClick={() => { api.removeRsvp(user.id, event.id); setUserRsvp(null); }}>Cancel</button>
            </div>
          ) : (
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-primary btn-sm" onClick={() => handleRsvp("Going")}>Going</button>
              <button className="btn btn-warning btn-sm" onClick={() => handleRsvp("Maybe")}>Maybe</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleRsvp("Not Going")}>Not Going</button>
            </div>
          )}

          {/* RSVP info */}
          {user?.id === event.host_id ? (
            <div className="mb-3">
              <h6>Attendees Summary:</h6>
              <div className="mb-2">
                {Object.entries(summary).map(([status, count]) => (
                  <span key={status} className={`badge bg-${statusColor[status]} me-2`}>
                    {status}: {count}
                  </span>
                ))}
              </div>
              <ul className="list-group list-group-flush">
                {rsvps.map(r => (
                  <li key={r.id} className={`list-group-item d-flex justify-content-between align-items-center`}>
                    {api.getUserById(r.user_id).username}
                    <span className={`badge bg-${statusColor[r.status]}`}>{r.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted">Total RSVPs: {rsvps.length}</p>
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
          {user && <div className="d-flex flex-column mt-2">
            <textarea className="form-control mb-2" rows="3" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." />
            <button className="btn btn-primary align-self-end" onClick={handleAddComment}>Submit</button>
          </div>}
        </div>
      </div>
    </div>
  );
}
