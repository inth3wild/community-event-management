/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import api from '@/lib/axios';
import { Activity, Event, Registration, Venue } from '@/types';
import { create } from 'zustand';
import { useAuthStore } from './auth.store';

interface EventState {
  events: Event[];
  venues: Venue[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
  registeredEvents: string[]; // Array of event IDs the user is registered for
  registrations: Registration[];
  fetchEvents: (userRole: string) => Promise<void>;
  fetchVenues: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  createEvent: (formDataToSend: FormData) => Promise<void>;
  updateEvent: (id: string, formDataToSend: FormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (
    eventId: string,
    participantData: {
      email: string;
      name: string;
      phoneNumber?: string;
    }
  ) => Promise<void>;
  fetchRegisteredEvents: () => Promise<void>;
  clearRegistrations: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  venues: [],
  activities: [],
  loading: false,
  error: null,
  registeredEvents: [],
  registrations: [],

  fetchEvents: async (userRole) => {
    set({ loading: true });

    try {
      const response = await api.get(`/${userRole.toLowerCase()}/events`);
      set({ events: response.data, error: null });
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

  updateEvent: async (id, formDataToSend) => {
    const response = await api.patch(
      `/admin/events/update/${id}`,
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
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

  registerForEvent: async (eventId, participantData) => {
    set({ loading: true });
    try {
      await api.post('/user/events/register', {
        eventId,
        participant: participantData,
      });

      // Add to registered events
      set({
        registeredEvents: [...get().registeredEvents, eventId],
        error: null,
      });
    } catch (error) {
      set({ error: 'Failed to register for event' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchRegisteredEvents: async () => {
    set({ loading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user?.email) {
        throw new Error('User email not found');
      }

      const response = await api.post('/user/events/registrations', {
        email: user.email,
      });

      set({
        registeredEvents: response.data.map((reg: any) => reg.event.id),
        error: null,
        registrations: [...get().registrations, ...response.data],
      });
    } catch (error) {
      set({ error: 'Failed to fetch registered events' });
    } finally {
      set({ loading: false });
    }
  },
  clearRegistrations: () => set({ registrations: [] }),
}));
