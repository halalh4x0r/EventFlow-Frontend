import EventCard from "../components/EventCard";

export default function Home({ events }) {
  const now = new Date();

  return (
    <div>
      <h1 className="mb-4">All Events</h1>

      {events.length === 0 ? (
        <p>No events available. Be the first to create one!</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {events.map(event => (
            <div key={event.id} className="col">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
