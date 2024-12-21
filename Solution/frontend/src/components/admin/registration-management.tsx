/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Registration } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { format } from 'date-fns';

export const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/admin/registration');
      setRegistrations(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch registrations',
        variant: 'destructive',
      });
    }
  };

  const updateStatus = async (registrationId: string, status: string) => {
    try {
      await api.put(`/admin/registration/${registrationId}`, { status });
      toast({ title: 'Success', description: 'Registration status updated' });
      fetchRegistrations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Registration Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>{registration.event.name}</TableCell>
              <TableCell>{registration.participant.name}</TableCell>
              <TableCell>{registration.status}</TableCell>
              <TableCell>
                {format(new Date(registration.registeredAt), 'PPP p')}
              </TableCell>
              <TableCell>
                <Select
                  value={registration.status}
                  onValueChange={(value) =>
                    updateStatus(registration.id, value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
