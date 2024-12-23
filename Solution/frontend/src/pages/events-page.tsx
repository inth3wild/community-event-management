import { Layout } from '@/components/layout/layout';
import { EventList } from '@/components/events/event-list';
import { RegistrationList } from '@/components/user/registration-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

export const EventsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab =
    location.pathname === '/my-registrations' ? 'registrations' : 'events';

  const handleTabChange = (value: string) => {
    if (value === 'registrations') {
      navigate('/my-registrations');
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">My Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventList />
          </TabsContent>

          <TabsContent value="registrations">
            <RegistrationList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
