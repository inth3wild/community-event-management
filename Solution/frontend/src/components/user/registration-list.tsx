import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEventStore } from '@/stores/event.store';
import { format } from 'date-fns';

export const RegistrationList = () => {
  const { fetchRegisteredEvents, registrations } = useEventStore();

  useEffect(() => {
    fetchRegisteredEvents();
  }, [fetchRegisteredEvents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Registrations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>{registration.event.name}</TableCell>
              <TableCell>
                {format(new Date(registration.event.startTime), 'PPP')}
              </TableCell>
              <TableCell>
                {registration.event.venues.map((v) => v.name).join(', ')}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(registration.status)}
                >
                  {registration.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
