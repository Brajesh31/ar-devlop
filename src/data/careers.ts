export interface JobListing {
  id: string;
  title: string;
  type: 'full-time' | 'part-time' | 'internship' | 'volunteer';
  location: string;
  description: string;
  applyUrl?: string;
  isActive: boolean;
}

export const jobListings: JobListing[] = [
  {
    id: 'community-lead',
    title: 'Community Lead',
    type: 'full-time',
    location: 'Remote (India)',
    description: 'Build and nurture the Bharat XR community across India. Organize events, engage creators, and grow our ecosystem.',
    isActive: true
  },
  {
    id: 'content-creator',
    title: 'Content Creator',
    type: 'part-time',
    location: 'Remote',
    description: 'Create engaging content about XR technology, tutorials, and community stories for our platforms.',
    isActive: true
  },
  {
    id: 'xr-intern',
    title: 'XR Development Intern',
    type: 'internship',
    location: 'Remote (India)',
    description: 'Work on real XR projects, learn from industry experts, and contribute to India\'s XR ecosystem.',
    isActive: true
  },
  {
    id: 'campus-ambassador',
    title: 'Campus Ambassador',
    type: 'volunteer',
    location: 'Pan India',
    description: 'Represent Bharat XR at your college, organize workshops, and inspire students to explore XR.',
    isActive: true
  }
];

export const whyWorkWithUs = [
  {
    title: 'Learning',
    description: 'Work at the forefront of XR technology in India. Learn from industry leaders and cutting-edge projects.'
  },
  {
    title: 'Impact',
    description: 'Shape the future of immersive technology in India. Your work reaches thousands of students and creators.'
  },
  {
    title: 'Community',
    description: 'Join a passionate team building India\'s largest XR community. Collaborate with creators, educators, and innovators.'
  }
];

export const hiringProcess = [
  { step: 1, title: 'Apply', description: 'Submit your application with your resume and portfolio' },
  { step: 2, title: 'Review', description: 'We review applications within 5-7 business days' },
  { step: 3, title: 'Connect', description: 'Selected candidates have a conversation with our team' },
  { step: 4, title: 'Welcome', description: 'Join the Bharat XR team and start making an impact' }
];
