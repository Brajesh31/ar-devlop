/**
 * Team Data
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
}

export const founder: TeamMember = {
  id: 'chhavi-garg',
  name: 'Chhavi Garg',
  role: 'Founder & CEO',
  bio: 'Chhavi Garg is the visionary behind Bharat XR, building India\'s largest AR/VR community from the ground up. With a passion for democratizing immersive technology, she has led initiatives that have touched 90,000+ students across 500+ colleges.',
  linkedin: 'https://linkedin.com/in/chhavigarg',
  twitter: 'https://twitter.com/chhavigarg',
};

export const team: TeamMember[] = [
  founder,
  {
    id: 'community-manager',
    name: 'Community Manager',
    role: 'Community Lead',
    bio: 'Leading community engagement, events coordination, and partnership outreach across India.',
  },
  {
    id: 'tech-lead',
    name: 'Technical Lead',
    role: 'Tech & Content',
    bio: 'Overseeing technical workshops, curriculum development, and XR content creation.',
  },
  {
    id: 'partnerships',
    name: 'Partnerships Lead',
    role: 'Partnerships & Growth',
    bio: 'Building strategic partnerships with colleges, companies, and government bodies.',
  },
];

/**
 * Values
 */
export interface Value {
  title: string;
  description: string;
  icon: string;
}

export const values: Value[] = [
  {
    title: 'Community First',
    description: 'Everything we build starts with our community. We listen, learn, and grow together.',
    icon: '👥',
  },
  {
    title: 'Hands-On Learning',
    description: 'Theory without practice is incomplete. We believe in learning by doing.',
    icon: '🛠️',
  },
  {
    title: 'Inclusive Access',
    description: 'XR technology should be accessible to everyone, regardless of background or location.',
    icon: '🌍',
  },
  {
    title: 'India-First Innovation',
    description: 'Building solutions that address Indian challenges and celebrate Indian creativity.',
    icon: '🇮🇳',
  },
];

/**
 * Journey milestones
 */
export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const journey: Milestone[] = [
  {
    year: '2021',
    title: 'The Beginning',
    description: 'Started as a small community of AR enthusiasts sharing knowledge and creating together.',
  },
  {
    year: '2022',
    title: 'First 10,000',
    description: 'Reached 10,000 students trained through workshops and online bootcamps.',
  },
  {
    year: '2023',
    title: 'National Recognition',
    description: 'Partnered with SnapAR, Google for Developers, and government initiatives like NSDC.',
  },
  {
    year: '2024',
    title: 'Movement Status',
    description: '90,000+ students, 500+ colleges, and official jury role at India Skills Nationals.',
  },
  {
    year: '2025',
    title: 'WAVES Summit',
    description: 'Flagship XR Creator Hackathon culminating at WAVES 2025 with national participation.',
  },
];
