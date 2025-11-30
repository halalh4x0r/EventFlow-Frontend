import { useState, useContext } from "react";
import { api } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [images, setImages] = useState([""]);

  if (!user)
    return <p className="container mt-4">Please login to create an event.</p>;

  const handleAddImage = () => setImages([...images, ""]);

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      description,
      location,
      date_time: dateTime,
      host_id: user.id,
      images: images.filter((img) => img.trim() !== "")
    };

    try {
      const created = await api.createEvent(newEvent);
      navigate(`/events/${created.id}`);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start mt-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Create Event</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              placeholder="Event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date & Time</label>
            <input
              className="form-control"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <h5>Images</h5>
          {images.map((img, idx) => (
            <div className="mb-2" key={idx}>
              <input
                className="form-control"
                placeholder="Image URL"
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
              />
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={handleAddImage}
          >
            Add another image
          </button>

          <button type="submit" className="btn btn-primary w-100">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
