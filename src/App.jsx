// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import CreatePage from "./pages/CreatePage";
import EventPage from "./pages/EventDetails";
import LoginForm from "./components/LoginForm";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";

import { api } from "./api/mockApi";
import { AuthProvider } from "./context/AuthContext";

function AppWrapper() {
  // We use a wrapper to access useLocation
  const location = useLocation();
  const showNav = location.pathname !== "/login";

  const [users] = useState(api.users);

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : api.getEvents();
  });

  const [comments, setComments] = useState(api.comments);
  const [rsvps, setRsvps] = useState(api.rsvps);

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
    (a, b) => new Date(a.date_time || a.start_time) - new Date(b.date_time || b.start_time)
  );

  return (
    <>
      {showNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Home events={sortedEvents} />} />
        <Route path="/create" element={<CreatePage users={users} createEvent={createEvent} />} />
        <Route path="/events/:id" element={<EventPage events={events} users={users} comments={comments} rsvps={rsvps} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}
