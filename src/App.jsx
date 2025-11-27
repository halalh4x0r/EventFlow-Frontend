import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePage from "./pages/CreatePage";
import EventPage from "./pages/EventPage";
import mockData from "./data/mockdata.json";

function App() {
  const [users] = useState(mockData.users);

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : mockData.events;
  });

  const [comments, setComments] = useState(mockData.comments);
  const [rsvps, setRsvps] = useState(mockData.rsvps);

  // Persist events to localStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const createEvent = (newEvent) => {
    const nextId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;
    const eventWithId = { ...newEvent, id: nextId };
    setEvents([...events, eventWithId]);
    return eventWithId;
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home events={sortedEvents} />} />
        <Route path="/create" element={<CreatePage users={users} createEvent={createEvent} />} />
        <Route
          path="/events/:id"
          element={<EventPage events={events} users={users} comments={comments} rsvps={rsvps} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
