// import { useParams, Link } from "react-router-dom";

// export default function EventPage({ events, users, comments, rsvps }) {
//   const { id } = useParams();
//   const event = events.find((e) => e.id === parseInt(id));

//   if (!event) return <p>Event not found</p>;

//   const organizer = users.find((u) => u.id === event.organizer_id);
//   const eventComments = comments.filter((c) => c.event_id === event.id);
//   const eventRSVPs = rsvps.filter((r) => r.event_id === event.id);
//   const goingCount = eventRSVPs.filter(r => r.status === "going").length;

//   return (
//     <div>
//       <h1>{event.title}</h1>
//       <p>{event.description}</p>
//       <p>
//         Location: {event.location} <br />
//         Organizer: {organizer?.username || "Unknown"} <br />
//         Start: {new Date(event.start_time).toLocaleString()} <br />
//         End: {new Date(event.end_time).toLocaleString()} <br />
//         Capacity: {event.capacity} <br />
//         RSVPs (Going): {goingCount}
//       </p>

//       <h2>Comments</h2>
//       {eventComments.length === 0 ? (
//         <p>No comments yet</p>
//       ) : (
//         <ul>
//           {eventComments.map((c) => {
//             const user = users.find(u => u.id === c.user_id);
//             return (
//               <li key={c.id}>
//                 {user?.username || c.user_id}: {c.content}
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       <Link to="/" style={{ display: "inline-block", marginTop: "10px" }}>
//         Back to Home
//       </Link>
//     </div>
//   );
// }
