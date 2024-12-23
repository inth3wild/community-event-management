/* eslint-disable @typescript-eslint/no-unused-vars */
import api from '@/lib/axios';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../stores/auth.store';
import { useEventStore } from '../stores/event.store';

// Mock axios
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
    },
    defaults: {
      headers: {
        common: {} as Record<string, string>,
      },
    },
  },
}));

// event store tests
describe('useEventStore', () => {
  beforeEach(() => {
    // Clear store before each test
    const { result } = renderHook(() => useEventStore());
    act(() => {
      result.current.events = [];
      result.current.venues = [];
      result.current.activities = [];
      result.current.error = null;
      result.current.loading = false;
      result.current.registeredEvents = [];
      result.current.registrations = [];
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchEvents', () => {
    it('should fetch events successfully for user role', async () => {
      const mockEvents = [
        {
          id: '1',
          name: 'Test Event',
          description: 'Test Description',
          startTime: '2024-12-25T10:00:00Z',
          endTime: '2024-12-25T12:00:00Z',
        },
      ];

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockEvents });

      const { result } = renderHook(() => useEventStore());

      await act(async () => {
        await result.current.fetchEvents('user');
      });

      expect(api.get).toHaveBeenCalledWith('/user/events');
      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch events error', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEventStore());

      await act(async () => {
        await result.current.fetchEvents('user');
      });

      expect(result.current.error).toBe('Failed to fetch events');
      expect(result.current.events).toEqual([]);
    });
  });

  describe('registerForEvent', () => {
    it('should register for event successfully', async () => {
      const mockEventId = '1';
      const mockParticipantData = {
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '1234567890',
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: { status: 'okay' } });

      const { result } = renderHook(() => useEventStore());

      await act(async () => {
        await result.current.registerForEvent(mockEventId, mockParticipantData);
      });

      expect(api.post).toHaveBeenCalledWith('/user/events/register', {
        eventId: mockEventId,
        participant: mockParticipantData,
      });
      expect(result.current.registeredEvents).toContain(mockEventId);
      expect(result.current.error).toBeNull();
    });

    it('should handle registration error', async () => {
      const mockEventId = '1';
      const mockParticipantData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      vi.mocked(api.post).mockRejectedValueOnce(
        new Error('Registration failed')
      );

      const { result } = renderHook(() => useEventStore());

      await act(async () => {
        try {
          await result.current.registerForEvent(
            mockEventId,
            mockParticipantData
          );
        } catch (error) {
          // Error should be caught
        }
      });

      expect(result.current.error).toBe('Failed to register for event');
      expect(result.current.registeredEvents).not.toContain(mockEventId);
    });
  });
});

// auth store tests
describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.user = null;
      result.current.token = null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      };
      const mockToken = 'test-token';

      vi.mocked(api.post).mockResolvedValueOnce({
        data: { user: mockUser, token: mockToken },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(localStorage.getItem('token')).toBe(mockToken);
      //   expect(api.defaults.headers.common['Authorization']).toBe(
      //     `Bearer ${mockToken}`
      //   );
    });

    it('should handle login error', async () => {
      vi.mocked(api.post).mockRejectedValueOnce(
        new Error('Invalid credentials')
      );

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong-password');
        } catch (error) {
          // Error should be caught
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user session', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set initial state
      act(() => {
        result.current.user = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER',
          phoneNumber: '000',
        };
        result.current.token = 'test-token';
        localStorage.setItem('token', 'test-token');
        api.defaults.headers.common['Authorization'] = 'Bearer test-token';
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      //   expect(api.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });
});
