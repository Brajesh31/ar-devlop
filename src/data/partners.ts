/**
 * Partners Data
 * Partnership logos, submissions, and related data
 */

export interface PartnerLogo {
  id: string;
  name: string;
  category: 'brand' | 'college' | 'institution' | 'government';
  logoUrl?: string;
}

export interface PartnershipSubmission {
  id: string;
  name: string;
  organization: string;
  role: string;
  email: string;
  partnershipType: string;
  message: string;
  submittedAt: string;
}

export interface PartnershipModel {
  id: string;
  title: string;
  description: string;
  outcomes: string[];
  icon: string;
}

// Placeholder partner logos
export const partnerLogos: PartnerLogo[] = [
  { id: 'p1', name: 'TechCorp India', category: 'brand' },
  { id: 'p2', name: 'IIT Delhi', category: 'college' },
  { id: 'p3', name: 'Snap Inc.', category: 'brand' },
  { id: 'p4', name: 'BITS Pilani', category: 'college' },
  { id: 'p5', name: 'Meta Reality Labs', category: 'brand' },
  { id: 'p6', name: 'NIT Trichy', category: 'college' },
  { id: 'p7', name: 'NASSCOM', category: 'institution' },
  { id: 'p8', name: 'Startup India', category: 'government' },
  { id: 'p9', name: 'Unity Technologies', category: 'brand' },
  { id: 'p10', name: 'IIIT Hyderabad', category: 'college' },
  { id: 'p11', name: 'VIT University', category: 'college' },
  { id: 'p12', name: 'AICTE', category: 'government' },
];

// Partnership models
export const partnershipModels: PartnershipModel[] = [
  {
    id: 'brand',
    title: 'Brand Partnerships',
    description: 'Collaborate on campaigns, product adoption, and XR showcases that reach our engaged community.',
    outcomes: [
      'Brand visibility across events',
      'Product integration in hackathons',
      'Co-branded XR experiences',
      'Access to XR talent pool',
    ],
    icon: '🏢',
  },
  {
    id: 'college',
    title: 'College & University Partnerships',
    description: 'Bring XR education to your campus through workshops, curriculum support, and student programs.',
    outcomes: [
      'On-campus XR workshops',
      'Faculty training programs',
      'Student hackathon participation',
      'Curriculum consultation',
    ],
    icon: '🎓',
  },
  {
    id: 'industry',
    title: 'Industry Collaborations',
    description: 'Partner on hackathons, hiring initiatives, and innovation challenges that solve real problems.',
    outcomes: [
      'Custom hackathon challenges',
      'Access to vetted XR developers',
      'Innovation lab partnerships',
      'R&D collaborations',
    ],
    icon: '💼',
  },
  {
    id: 'government',
    title: 'Government & Institutions',
    description: 'Work together on national programs, skilling initiatives, and public technology adoption.',
    outcomes: [
      'Large-scale skilling programs',
      'Policy consultation',
      'Public awareness campaigns',
      'Digital India initiatives',
    ],
    icon: '🏛️',
  },
];

// Impact metrics for partners
export const partnerImpactMetrics = [
  { label: 'Students Reached', value: '50,000+' },
  { label: 'Cities Covered', value: '25+' },
  { label: 'Programs Delivered', value: '100+' },
  { label: 'Creators Trained', value: '10,000+' },
];

// Partnership form submissions (stored locally for now)
export const partnershipSubmissions: PartnershipSubmission[] = [];

// Helper to add a new submission
export const addPartnershipSubmission = (submission: Omit<PartnershipSubmission, 'id' | 'submittedAt'>): PartnershipSubmission => {
  const newSubmission: PartnershipSubmission = {
    ...submission,
    id: `sub_${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  partnershipSubmissions.push(newSubmission);
  return newSubmission;
};
