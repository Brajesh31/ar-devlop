export interface ContactFormSubmission {
  id: string;
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
  organization?: string;
  phone?: string;
  submittedAt: string;
}

export const inquiryTypes = [
  {
    id: 'general',
    title: 'General Inquiry',
    description: 'Questions about Bharat XR and our initiatives'
  },
  {
    id: 'partnerships',
    title: 'Partnerships',
    description: 'Brand collaborations and sponsorship opportunities'
  },
  {
    id: 'colleges',
    title: 'Colleges & Institutions',
    description: 'Academic partnerships and campus programs'
  },
  {
    id: 'events',
    title: 'Events & Hackathons',
    description: 'Event inquiries, registrations, and participation'
  },
  {
    id: 'media',
    title: 'Media & Press',
    description: 'Press inquiries, interviews, and media coverage'
  }
];

export const contactIntentCards = [
  {
    id: 'specialist',
    title: 'Contact a Specialist',
    description: 'Get guidance on workshops, bootcamps, XR sessions, and general inquiries.',
    cta: 'Contact Us →',
    action: 'scroll-form'
  },
  {
    id: 'campus',
    title: 'Community / Campus Events',
    description: 'Host XR events at your college, run student initiatives, or organize workshops.',
    cta: 'Contact Us →',
    action: 'scroll-form'
  },
  {
    id: 'partnership',
    title: 'Partnership Inquiry Centre',
    description: 'Explore collaboration opportunities for brands, institutions, and long-term partnerships.',
    cta: 'Become a Partner →',
    action: 'link',
    href: '/partner'
  },
  {
    id: 'enterprise',
    title: 'Enterprise / Custom Programs',
    description: 'Custom XR programs, large-scale initiatives, and corporate training solutions.',
    cta: 'Contact Us →',
    action: 'scroll-form'
  }
];

export const officeAddresses = [
  {
    city: 'Delhi NCR',
    country: 'India',
    address: 'Sector 62, Noida, Uttar Pradesh'
  },
  {
    city: 'Bengaluru',
    country: 'India',
    address: 'HSR Layout, Bengaluru, Karnataka'
  },
  {
    city: 'Mumbai',
    country: 'India',
    address: 'Andheri East, Mumbai, Maharashtra'
  }
];

export const contactFAQs = [
  {
    question: 'How can I participate in Bharat XR events?',
    answer: 'You can browse our upcoming events on the Events page and register directly. Most events are free for students and XR enthusiasts.'
  },
  {
    question: 'Do you organize hackathons at colleges?',
    answer: 'Yes! We partner with colleges across India to host XR hackathons. Reach out through the Campus Events option above to discuss organizing one at your institution.'
  },
  {
    question: 'What kind of partnerships do you offer?',
    answer: 'We offer sponsorship opportunities, technology partnerships, academic collaborations, and custom program development. Visit our Partner page for detailed information.'
  },
  {
    question: 'Which cities do you operate in?',
    answer: 'We have a pan-India presence with primary operations in Delhi NCR, Bengaluru, and Mumbai. Our events and programs reach students across 50+ cities.'
  },
  {
    question: 'Do you offer consulting for XR projects?',
    answer: 'Yes, we provide consulting services for enterprises looking to integrate XR into their workflows, training programs, or customer experiences.'
  },
  {
    question: 'How long does it take to get a response?',
    answer: 'We typically respond within 24-48 business hours. For urgent partnership inquiries, you can reach us directly via email.'
  }
];

export const contactInfo = {
  email: 'hello@bharatxr.com',
  supportEmail: 'support@bharatxr.com',
  businessEmail: 'info@bharatxr.co',
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/bharatxr' },
    { platform: 'X', url: 'https://x.com/bharatxr' },
    { platform: 'Instagram', url: 'https://instagram.com/bharatxr' }
  ],
  presence: 'India'
};

// Store for form submissions (in production, this would be a database)
export const contactSubmissions: ContactFormSubmission[] = [];

export const addContactSubmission = (submission: Omit<ContactFormSubmission, 'id' | 'submittedAt'>) => {
  const newSubmission: ContactFormSubmission = {
    ...submission,
    id: `contact-${Date.now()}`,
    submittedAt: new Date().toISOString()
  };
  contactSubmissions.push(newSubmission);
  return newSubmission;
};
