import { Link } from "react-router-dom";
import EventList from "../components/EventList";

export default function Home({ events }) {
  const now = new Date();

  return (
    <div>
      <h1>All Events</h1>
      <Link to="/create" style={{ display: "inline-block", margin: "10px 0" }}>
        Create New Event
      </Link>

      {events.length === 0 ? (
        <p>No events available. Be the first to create one!</p>
      ) : (
        <EventList
          events={events.map(event => ({
            ...event,
            isUpcoming: new Date(event.start_time) > now
          }))}
        />
      )}
    </div>
  );
}
