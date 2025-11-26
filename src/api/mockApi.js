import users from './users.json';
import events from './events.json';
import rsvps from './rsvps.json';
import comments from './comments.json';

export const api = {
  login(email, password) {
    return users.find(u => u.email === email && u.password === password) || null;
  },
  getEvents() { return events; },
  getEvent(id) { return events.find(e => e.id === Number(id)); },
  getComments(eventId) { return comments.filter(c => c.event_id === Number(eventId)); },
  addComment(data) {
    const newComment = { id: comments.length + 1, ...data };
    comments.push(newComment);
    return newComment;
  },
  getRsvps(eventId) {
    return rsvps.filter(r => r.event_id === Number(eventId));
  },
  addRsvp(data) {
    const newRsvp = { id: rsvps.length + 1, ...data };
    rsvps.push(newRsvp);
    return newRsvp;
  },
  removeRsvp(user_id, event_id) {
    const index = rsvps.findIndex(r => r.user_id === user_id && r.event_id === event_id);
    if (index !== -1) {
      rsvps.splice(index, 1);
      return true;
    }
    return false;
  },
  getUserById(id) {
    return users.find(u => u.id === Number(id));
  }
};
