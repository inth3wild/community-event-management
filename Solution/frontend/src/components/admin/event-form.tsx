import { useState, useEffect } from 'react';
import { Event, Venue, Activity } from '@/types';
import { useEventStore } from '@/stores/event.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileInput } from '@/components/ui/file-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface EventFormProps {
  event?: Event;
  onSuccess: () => void;
}

export const EventForm = ({ event, onSuccess }: EventFormProps) => {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    description: event?.description || '',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    venueIds: event?.venues.map((v) => v.id) || [],
    activityIds: event?.activities.map((a) => a.id) || [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { createEvent, updateEvent } = useEventStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [venuesRes, activitiesRes] = await Promise.all([
        api.get('/venues'),
        api.get('/activities'),
      ]);
      setVenues(venuesRes.data);
      setActivities(activitiesRes.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      const venueIds = Array.isArray(formData.venueIds)
        ? formData.venueIds
        : [formData.venueIds];
      const activityIds = Array.isArray(formData.activityIds)
        ? formData.activityIds
        : [formData.activityIds];

      const startTimeISO = new Date(formData.startTime).toISOString();
      const endTimeISO = new Date(formData.endTime).toISOString();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('startTime', startTimeISO);
      formDataToSend.append('endTime', endTimeISO);
      formDataToSend.append('venueIds', JSON.stringify(venueIds));
      formDataToSend.append('activityIds', JSON.stringify(activityIds));

      // Only handle image if there's a change
      if (imageFile) {
        formDataToSend.append('eventImage', imageFile);
      } else if (shouldRemoveImage) {
        formDataToSend.append('eventImage', 'null');
      }

      if (event) {
        await updateEvent(event.id, formDataToSend);
        toast({ title: 'Success', description: 'Event updated successfully' });
      } else {
        await createEvent(formDataToSend);
        toast({ title: 'Success', description: 'Event created successfully' });
      }

      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Event Image</label>
        <FileInput
          onFileSelect={setImageFile}
          previewUrl={event?.imageUrl}
          onClear={() => {
            setImageFile(null);
            setShouldRemoveImage(true);
          }}
        />
      </div>

      {/* Rest of the form remains unchanged */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Time</label>
          <Input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Time</label>
          <Input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Venues</label>
        <Select
          value={formData.venueIds[0]}
          onValueChange={(value) =>
            setFormData({ ...formData, venueIds: [value] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select venue" />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem key={venue.id} value={venue.id}>
                {venue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Activities</label>
        <Select
          value={formData.activityIds[0]}
          onValueChange={(value) =>
            setFormData({ ...formData, activityIds: [value] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select activity" />
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

      <Button type="submit" className="w-full">
        {event ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
};
