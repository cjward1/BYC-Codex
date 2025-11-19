import { createEvent, listEvents, rsvpToEvent } from '../services/eventService.js';

export const getEvents = (req, res) => res.json({ events: listEvents(req.user) });

export const addEvent = (req, res) => {
  const event = createEvent(req.body);
  return res.status(201).json({ event });
};

export const rsvp = (req, res) => {
  const { eventId } = req.params;
  const result = rsvpToEvent(eventId, req.user.id);
  if (result.error) return res.status(400).json({ message: result.error });
  return res.json(result);
};
