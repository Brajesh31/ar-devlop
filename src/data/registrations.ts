/**
 * Registrations Data
 * Stores event registrations (will be moved to database later)
 */

export interface Registration {
  id: string;
  eventId: string;
  eventName: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  teamName?: string;
  teamSize?: number;
  experience?: string;
  expectations?: string;
}

// In-memory storage for registrations (will be persisted to file/database later)
export const registrations: Registration[] = [];

/**
 * Add a new registration
 */
export const addRegistration = (registration: Omit<Registration, 'id' | 'createdAt'>): Registration => {
  const newRegistration: Registration = {
    ...registration,
    id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  registrations.push(newRegistration);
  return newRegistration;
};

/**
 * Get registrations by event ID
 */
export const getRegistrationsByEvent = (eventId: string): Registration[] => {
  return registrations.filter(reg => reg.eventId === eventId);
};

/**
 * Get all registrations
 */
export const getAllRegistrations = (): Registration[] => {
  return [...registrations];
};
