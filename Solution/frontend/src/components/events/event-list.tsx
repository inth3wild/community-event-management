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

export const EventList = () => {
  const { events, fetchEvents } = useEventStore();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  // Get unique venues and activities for filters
  const venues = Array.from(new Set(events.flatMap((event) => event.venues)));
  const activities = Array.from(
    new Set(events.flatMap((event) => event.activities))
  );

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
            <SelectItem value="">All venues</SelectItem>
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
            <SelectItem value="">All activities</SelectItem>
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
            onRegister={() => {
              // Handle registration
            }}
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
