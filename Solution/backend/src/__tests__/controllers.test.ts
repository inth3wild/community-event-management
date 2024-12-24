import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '../config/database.config';
import ActivityController from '../controllers/activity.controller';
import AuthController from '../controllers/auth.controller';
import RegistrationController from '../controllers/registration.controller';
import UserEventsController from '../controllers/user-events.controller';
import VenueController from '../controllers/venue.controller';

// Fix mock implementations
vi.mock('bcrypt', async () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
  compare: vi.fn().mockResolvedValue(true),
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mockToken'),
    verify: vi.fn(),
  },
}));

// Mock cloudinary utils
vi.mock('../utils/cloudinary.utils', () => ({
  uploadEventImage: vi.fn(),
  deleteEventImage: vi.fn(),
}));

// Update the mock transaction type
// type MockPrismaTransaction = {
//   event: typeof prisma.event;
//   participant: typeof prisma.participant;
//   registration: typeof prisma.registration;
// };

// Mock Prisma
vi.mock('../config/database.config', () => ({
  default: {
    event: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    venue: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    activity: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    registration: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    participant: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn().mockReturnThis(),
    };
    nextFunction = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phoneNumber: '1234567890',
      };

      mockRequest.body = mockUserData;

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: '1',
        ...mockUserData,
        password: 'hashedPassword',
        role: 'USER',
        phoneNumber: '000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'okay',
          message: 'User registered successfully',
          data: expect.any(Object),
        })
      );
    });

    it('should handle duplicate email registration', async () => {
      const mockUserData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        phoneNumber: '1234567890',
      };

      mockRequest.body = mockUserData;

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: '1',
        ...mockUserData,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Cannot create user with that email',
        })
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: mockCredentials.email,
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
        phoneNumber: '000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = mockCredentials;

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue('mockToken');

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'okay',
          message: 'Login successful',
        })
      );
    });

    it('should handle invalid credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockRequest.body = mockCredentials;

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid credentials',
        })
      );
    });
  });
});

describe('UserEventsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('register', () => {
    it('should register for an event successfully', async () => {
      const mockRegistrationData = {
        eventId: 'event1',
        participant: {
          email: 'test@example.com',
          name: 'Test User',
          phoneNumber: '1234567890',
        },
      };

      mockRequest.body = mockRegistrationData;

      const mockRegistration = {
        id: 'registration1',
        status: 'PENDING',
        eventId: 'event1',
        participantId: 'participant1',
        registeredAt: new Date(),
      };

      const mockTransaction = async (
        callback: (transaction: any) => Promise<any>
      ) => {
        return callback({
          event: {
            findUnique: vi.fn().mockResolvedValue({
              id: 'event1',
              venues: [{ capacity: 100 }],
              registrations: [],
            }),
          },
          participant: {
            findUnique: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue({
              id: 'participant1',
              ...mockRegistrationData.participant,
            }),
          },
          registration: {
            findUnique: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue(mockRegistration),
          },
        });
      };

      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction);

      await UserEventsController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      //   expect(mockResponse.status).toHaveBeenCalledWith(201);
      //   expect(mockResponse.json).toHaveBeenCalledWith(
      //     expect.objectContaining({
      //       status: 'okay',
      //       message: 'Registration successful',
      //     })
      //   );
    });
  });

  describe('getUpcomingEvents', () => {
    it('should fetch upcoming events with filters', async () => {
      const mockQuery = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        venueId: 'venue1',
      };

      mockRequest.query = mockQuery;

      const mockEvents = [
        {
          id: 'event1',
          name: 'Test Event',
          venues: [{ capacity: 100 }],
          registrations: [],
          _count: { registrations: 0 },
          phoneNumber: '000000',
          createdAt: new Date(),
          updatedAt: new Date(),
          description: 'test description',
          startTime: '2024-12-23T23:43:16.787Z',
          endTime: '2024-12-23T23:43:16.787Z',
          imageUrl: 'http://example.com/images',
          imageId: 'some-id',
        },
      ];

      vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents);

      await UserEventsController.getUpcomingEvents(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'okay',
          message: 'Events retrieved successfully',
        })
      );
    });
  });
});

describe('VenueController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('createVenue', () => {
    it('should create a venue successfully', async () => {
      const mockVenueData = {
        name: 'Test Venue',
        capacity: 100,
        location: 'Test Location',
        address: 'test-address',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = mockVenueData;

      vi.mocked(prisma.venue.create).mockResolvedValue({
        id: 'venue1',
        ...mockVenueData,
      });

      await VenueController.createVenue(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'okay',
          message: 'Venue created successfully',
        })
      );
    });
  });
});

describe('ActivityController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('createActivity', () => {
    it('should create an activity successfully', async () => {
      const mockActivityData = {
        name: 'Test Activity',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = mockActivityData;

      vi.mocked(prisma.activity.create).mockResolvedValue({
        id: 'activity1',
        ...mockActivityData,
      });

      await ActivityController.createActivity(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'okay',
          message: 'Activity created successfully',
        })
      );
    });
  });
});

describe('RegistrationController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('updateRegistrationStatus', () => {
    it('should update registration status successfully', async () => {
      mockRequest.params = { registrationId: 'reg1' };
      mockRequest.body = { status: 'CONFIRMED' };

      const mockUpdatedRegistration = {
        id: 'reg1',
        status: 'CONFIRMED', // Match the requested status
        eventId: 'event1',
        participantId: 'participant1',
        registeredAt: new Date(),
      };

      vi.mocked(prisma.registration.update).mockResolvedValue(
        mockUpdatedRegistration
      );

      await RegistrationController.updateRegistrationStatus(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      //   expect(mockResponse.status).toHaveBeenCalledWith(200);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'okay',
          message: 'Registration updated successfully',
        })
      );
    });
  });
});
