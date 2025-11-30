import { useState, useEffect } from "react";
import { api } from '../services/api';
import EventCard from "../components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Month navigation
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));

  const countEvents = (date) =>
    events.filter(e => {
      const eDate = new Date(e.date_time);
      return eDate.getFullYear() === date.getFullYear() &&
             eDate.getMonth() === date.getMonth() &&
             eDate.getDate() === date.getDate();
    }).length;

  const eventsOnDay = (date) =>
    events.filter(e => {
      const eDate = new Date(e.date_time);
      return eDate.getFullYear() === date.getFullYear() &&
             eDate.getMonth() === date.getMonth() &&
             eDate.getDate() === date.getDate();
    });

  const filteredEvents = (selectedDate ? eventsOnDay(selectedDate) : events)
    .filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Upcoming Events</h2>
      <div className="row">
        <div className="col-lg-8">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="row">
            {filteredEvents.length > 0 ? filteredEvents.map(e => (
              <div className="col-md-6 mb-3" key={e.id}>
                <EventCard event={e} />
              </div>
            )) : (
              <p className="text-muted">No events found.</p>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-3 shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-sm btn-outline-primary" onClick={handlePrevMonth}>&lt;</button>
              <h5 className="mb-0 text-center">
                {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
              </h5>
              <button className="btn btn-sm btn-outline-primary" onClick={handleNextMonth}>&gt;</button>
            </div>

            <div className="d-grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {["S","M","T","W","T","F","S"].map((d,i)=>(
                <div key={i} className="text-center fw-bold text-secondary pb-1">{d}</div>
              ))}

              {calendarDays.map((date, idx)=>(
                <div
                  key={idx}
                  className={`border rounded text-center p-2 mb-1 ${selectedDate === date ? "bg-primary text-white" : ""}`}
                  style={{ minHeight: "50px", cursor: date ? "pointer" : "default", transition: "0.2s" }}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div className="fw-bold">{date.getDate()}</div>
                      {countEvents(date) > 0 && (
                        <span className="badge bg-success position-relative mt-1">{countEvents(date)}</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {selectedDate && (
              <div className="mt-3">
                <h6 className="fw-bold">Events on {selectedDate.toDateString()}:</h6>
                {eventsOnDay(selectedDate).length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {eventsOnDay(selectedDate).map(e => (
                      <li key={e.id} className="list-group-item py-2 px-2">
                        {e.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No events.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
