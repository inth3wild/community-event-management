import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { useEventStore } from '@/stores/event.store';
import { Button } from '@/components/ui/button';
import { EventForm } from './event-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';

export const EventManagement = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { events, fetchEvents, deleteEvent } = useEventStore();

  useEffect(() => {
    fetchEvents('admin');
  }, [fetchEvents]);

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedEvent(undefined);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedEvent(undefined);
    fetchEvents('admin');
  };

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
          </div>
          <EventForm event={selectedEvent} onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Events</h2>
            <Button onClick={handleCreateNew}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </div>
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(event.startTime), 'PPP')} -{' '}
                        {format(new Date(event.endTime), 'PPP')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditEvent(event)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-sm text-muted-foreground">
                      Venues: {event.venues.map((v) => v.name).join(', ')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Activities:{' '}
                      {event.activities.map((a) => a.name).join(', ')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
