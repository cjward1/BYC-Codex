import { createId, events } from '../models/dataStore.js';

export const listEvents = (user) => {
  const isMember = user?.roles?.includes('member') || user?.roles?.includes('admin');
  return events.filter((event) => event.visibility === 'public' || isMember);
};

export const createEvent = (payload) => {
  const newEvent = { id: createId(), rsvps: [], ...payload };
  events.push(newEvent);
  return newEvent;
};

export const rsvpToEvent = (eventId, userId) => {
  const event = events.find((e) => e.id === eventId);
  if (!event) return { error: 'Event not found' };
  if (event.capacity && event.rsvps.length >= event.capacity) {
    return { error: 'Event is full' };
  }
  if (!event.rsvps.includes(userId)) {
    event.rsvps.push(userId);
  }
  return { event };
};
