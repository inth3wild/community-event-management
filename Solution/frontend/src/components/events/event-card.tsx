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
  onRegister?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const EventCard = ({
  event,
  onRegister,
  onEdit,
  onDelete,
  isAdmin,
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
      <CardFooter className="space-x-2">
        {isAdmin ? (
          <>
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </>
        ) : (
          <Button onClick={onRegister}>Register</Button>
        )}
      </CardFooter>
    </Card>
  );
};
