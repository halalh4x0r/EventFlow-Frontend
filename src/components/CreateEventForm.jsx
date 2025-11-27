import React, { useState } from "react";
import eventsData from "../api/events.json";
import users from "../api/users.json";

const CreateEventForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_time: "",
    location: "",
    host_id: users[0]?.id || 1, // Default host
  });

  const [eventList, setEventList] = useState(eventsData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      ...formData,
      id: eventList.length + 1,
    };

    // Simulate local state update (mock API)
    setEventList([...eventList, newEvent]);
    onCreate?.(newEvent);

    // Reset form
    setFormData({
      title: "",
      description: "",
      date_time: "",
      location: "",
      host_id: users[0]?.id || 1,
    });
  };

  return (
    <form className="create-event-form" onSubmit={handleSubmit}>
      <h2>Create New Event</h2>

      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Date & Time:
        <input
          type="datetime-local"
          name="date_time"
          value={formData.date_time}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Host:
        <select
          name="host_id"
          value={formData.host_id}
          onChange={handleChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn">
        Add Event
      </button>
    </form>
  );
};

export default CreateEventForm;
