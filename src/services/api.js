// src/services/api.js
import { API_URL } from "../config";

export const api = {
  // ---------------- AUTH (using /users) ----------------
  async login(email, password) {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();

//  Find user with matching email and password
    const user = users.find(
      u => u.email === email && u.password === password
    );

    return user || null;
  },

  // ---------------- USERS ----------------
  async getUsers() {
    const res = await fetch(`${API_URL}/users`);
    return await res.json();
  },

  async getUserById(id) {
    const res = await fetch(`${API_URL}/users/${id}`);
    return await res.json();
  },

  // ---------------- EVENTS ----------------
  async getEvents() {
    const res = await fetch(`${API_URL}/events`);
    return await res.json();
  },

  async getEvent(id) {
    const res = await fetch(`${API_URL}/events/${id}`);
    return await res.json();
  },

  async createEvent(data) {
    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // ---------------- COMMENTS ----------------
  async getComments(eventId) {
    const res = await fetch(`${API_URL}/comments?event_id=${eventId}`);
    return await res.json();
  },

  async addComment(data) {
    const res = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // ---------------- RSVPS ----------------
  async getRsvps(eventId) {
    const res = await fetch(`${API_URL}/rsvps?event_id=${eventId}`);
    return await res.json();
  },

  async addRsvp(data) {
    const res = await fetch(`${API_URL}/rsvps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async removeRsvp(id) {
    const res = await fetch(`${API_URL}/rsvps/${id}`, { method: "DELETE" });
    return res.ok;
  }
};
