import api from '@/lib/axios';
import { Event } from '@/types';
import { create } from 'zustand';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/admin/events');
      set({ events: response.data, error: null });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ error: 'Failed to fetch events' });
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (eventData) => {
    const response = await api.post('/admin/events/create', eventData);
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
