export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  imageId?: string;
  venues: Venue[];
  activities: Activity[];
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  participantId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  registeredAt: string;
  event: Event;
  participant: Participant;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}
