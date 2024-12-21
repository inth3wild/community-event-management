import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VenueManagement } from '@/components/admin/venue-management';
import { ActivityManagement } from '@/components/admin/activity-management';
import { RegistrationManagement } from '@/components/admin/registration-management';
import { EventForm } from '@/components/admin/event-form';
import { Layout } from '@/components/layout/layout';

export const AdminDashboardPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            <EventForm onSuccess={() => {}} />
          </TabsContent>
          <TabsContent value="venues">
            <VenueManagement />
          </TabsContent>
          <TabsContent value="activities">
            <ActivityManagement />
          </TabsContent>
          <TabsContent value="registrations">
            <RegistrationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
