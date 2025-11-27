import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateEventForm from "../components/CreateEventForm";

export default function CreatePage({ users, createEvent }) {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleCreate = (data) => {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    const event = createEvent(data);
    setSuccessMessage(`Event "${event.title}" created successfully!`);

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/");
    }, 2000);
  };

  return (
    <div>
      <h1>Create Event</h1>
      {successMessage && (
        <div style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
          {successMessage}
        </div>
      )}
      <CreateEventForm users={users} onCreate={handleCreate} />
    </div>
  );
}
