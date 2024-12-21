import { Layout } from '@/components/layout/layout';
import { EventList } from '@/components/events/event-list';

export const EventsPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <EventList />
      </div>
    </Layout>
  );
};
