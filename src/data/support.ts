export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  submittedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
}

export const supportCategories = [
  {
    id: 'account',
    title: 'Account Issues',
    description: 'Login problems, profile settings, password reset'
  },
  {
    id: 'events',
    title: 'Event Issues',
    description: 'Registration, attendance, certificates'
  },
  {
    id: 'hackathons',
    title: 'Hackathon Issues',
    description: 'Team formation, submissions, judging'
  },
  {
    id: 'partnerships',
    title: 'Partnership Queries',
    description: 'Collaboration and sponsorship questions'
  }
];

export const supportInfo = {
  responseTime: '24-48 hours',
  workingHours: 'Monday to Friday, 10 AM - 6 PM IST',
  urgentNote: 'For urgent matters during events or hackathons, please include "URGENT" in your message subject.'
};

// Store for support tickets
export const supportTickets: SupportTicket[] = [];

export const addSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'submittedAt' | 'status'>) => {
  const newTicket: SupportTicket = {
    ...ticket,
    id: `ticket-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'open'
  };
  supportTickets.push(newTicket);
  return newTicket;
};
