import { Event } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
}

export const EventCard = ({
  event,
  onEdit,
  onDelete,
  isAdmin,
  onRegister,
  isRegistered,
}: EventCardProps) => {
  return (
    <Card className="w-full">
      {event.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600">{event.description}</p>
        <div className="text-sm">
          <p>
            <strong>Start:</strong> {format(new Date(event.startTime), 'PPP p')}
          </p>
          <p>
            <strong>End:</strong> {format(new Date(event.endTime), 'PPP p')}
          </p>
        </div>
        <div className="text-sm">
          <p>
            <strong>Venues:</strong>{' '}
            {event.venues.map((venue) => venue.name).join(', ')}
          </p>
          <p>
            <strong>Activities:</strong>{' '}
            {event.activities.map((activity) => activity.name).join(', ')}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isAdmin && (
          <Button onClick={() => onRegister(event.id)} disabled={isRegistered}>
            {isRegistered ? 'Registered' : 'Register'}
          </Button>
        )}
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={onEdit}>Edit</Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
