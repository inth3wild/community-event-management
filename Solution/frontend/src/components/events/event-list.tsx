/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useEventStore } from '@/stores/event.store';
import { EventCard } from './event-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/hooks/use-toast';

export const EventList = () => {
  const {
    events,
    venues,
    activities,
    fetchEvents,
    fetchVenues,
    fetchActivities,
    registerForEvent,
    registeredEvents,
    fetchRegisteredEvents
  } = useEventStore();
  console.log(registeredEvents);
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');

  useEffect(() => {
    fetchEvents(user?.role as string);
    fetchVenues();
    fetchActivities();
    if (user && user.role === 'USER') {
      fetchRegisteredEvents();
    }
  }, [fetchEvents, fetchVenues, fetchActivities, fetchRegisteredEvents, user]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesVenue = venueFilter
      ? event.venues.some((venue) => venue.id === venueFilter)
      : true;
    const matchesActivity = activityFilter
      ? event.activities.some((activity) => activity.id === activityFilter)
      : true;

    return matchesSearch && matchesVenue && matchesActivity;
  });

  const handleRegister = async (eventId: string) => {
    try {
      if (!user) {
        // Handle not logged in - you might want to show a login dialog or redirect
        return;
      }

      await registerForEvent(eventId, {
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber
      });

      toast({
        title: "Success!",
        description: "You have successfully registered for this event.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={venueFilter} onValueChange={setVenueFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by venue" />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem key={venue.id} value={venue.id}>
                {venue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activityFilter} onValueChange={setActivityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by activity" />
          </SelectTrigger>
          <SelectContent>
            {activities.map((activity) => (
              <SelectItem key={activity.id} value={activity.id}>
                {activity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={user?.role === 'ADMIN'}
            isRegistered={registeredEvents.includes(event.id)}
            onRegister={handleRegister}
            onEdit={() => {
              // Handle edit
            }}
            onDelete={() => {
              // Handle delete
            }}
          />
        ))}
      </div>
    </div>
  );
};
