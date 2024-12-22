import api from '@/lib/axios';
import { Activity, Event, Venue } from '@/types';
import { create } from 'zustand';

interface EventState {
  events: Event[];
  venues: Venue[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
  fetchEvents: (userRole: string) => Promise<void>;
  fetchVenues: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  createEvent: (formData: FormData) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  venues: [],
  activities: [],
  loading: false,
  error: null,

  fetchEvents: async (userRole) => {
    set({ loading: true });

    try {
      const response = await api.get(`/${userRole.toLowerCase()}/events`);
      set({ events: response.data, error: null });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ error: 'Failed to fetch events' });
    } finally {
      set({ loading: false });
    }
  },

  fetchVenues: async () => {
    set({ loading: true });

    try {
      const response = await api.get(`/venues`);
      set({ venues: response.data, error: null });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ error: 'Failed to fetch venues' });
    } finally {
      set({ loading: false });
    }
  },

  fetchActivities: async () => {
    set({ loading: true });

    try {
      const response = await api.get(`/activities`);
      set({ activities: response.data, error: null });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ error: 'Failed to fetch activities' });
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (formDataToSend) => {
    const response = await api.post('/admin/events/create', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    set({ events: [...get().events, response.data] });
  },

  updateEvent: async (id, eventData) => {
    const response = await api.patch(`/admin/events/update/${id}`, eventData);
    set({
      events: get().events.map((event) =>
        event.id === id ? { ...event, ...response.data } : event
      ),
    });
  },

  deleteEvent: async (id) => {
    await api.delete(`/admin/events/delete/${id}`);
    set({ events: get().events.filter((event) => event.id !== id) });
  },
}));
