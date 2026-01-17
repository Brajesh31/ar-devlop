/**
 * Showcase Data
 * Community-built XR projects and creators
 */

export type ProjectCategory = 'ar' | 'vr' | 'webar' | 'snapar' | 'hackathon' | 'workshop';

export interface ShowcaseProject {
  videoUrl: any;
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  categories: ProjectCategory[];
  techUsed: string[];
  builtDuring?: string;
  eventId?: string;
  projectUrl?: string;
  creatorName: string;
  creatorTeam?: string;
  featured: boolean;
}

export interface ShowcaseCreator {
  id: string;
  name: string;
  role: string;
  bio: string;
  projectCount: number;
  associatedProgram?: string;
  photo?: string;
}

// Showcase Projects
export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'proj1',
    title: 'Cultural Heritage AR Tour',
    description: 'An augmented reality experience that brings historical monuments to life with interactive 3D reconstructions and narrated stories.',
    categories: ['ar', 'hackathon'],
    techUsed: ['Unity', 'ARCore', 'Blender'],
    builtDuring: 'XR Creator Hackathon with WAVES 2025',
    eventId: 'waves-xr-2025',
    creatorName: 'Team Heritage360',
    creatorTeam: 'Priya Sharma, Arjun Mehta, Kavita Reddy',
    featured: true,
  },
  {
    id: 'proj2',
    title: 'MoodLens',
    description: 'An AR lens that visualizes emotions through color auras and animated particles, promoting emotional awareness and expression.',
    categories: ['snapar', 'hackathon'],
    techUsed: ['Lens Studio', 'JavaScript'],
    builtDuring: 'MoodHack 2024',
    eventId: 'moodhack-2024',
    creatorName: 'Sneha Kapoor',
    featured: true,
  },
  {
    id: 'proj3',
    title: 'Virtual Chemistry Lab',
    description: 'A VR application that allows students to conduct chemistry experiments safely in a fully interactive virtual laboratory.',
    categories: ['vr', 'hackathon'],
    techUsed: ['Unity', 'Oculus SDK', 'C#'],
    builtDuring: 'Campus XR Challenge 2024',
    eventId: 'campus-xr-challenge',
    creatorName: 'Team EduVR',
    creatorTeam: 'Rohan Gupta, Ananya Singh, Vikram Patel',
    featured: true,
  },
  {
    id: 'proj4',
    title: 'Diwali Diya AR',
    description: 'Place virtual diyas around your home with this AR experience celebrating the festival of lights.',
    categories: ['ar', 'snapar', 'hackathon'],
    techUsed: ['Lens Studio'],
    builtDuring: 'NovHack 2024',
    eventId: 'novhack-2024',
    creatorName: 'Amit Jain',
    featured: false,
  },
  {
    id: 'proj5',
    title: 'WebXR Portfolio',
    description: 'An immersive 3D portfolio website built with WebXR that showcases work in a virtual gallery space.',
    categories: ['webar'],
    techUsed: ['Three.js', 'A-Frame', 'JavaScript'],
    builtDuring: 'Bharat XR Workshop Series',
    creatorName: 'Neha Malhotra',
    featured: false,
  },
  {
    id: 'proj6',
    title: 'Yoga Pose Tracker',
    description: 'An AR application using body tracking to guide users through yoga poses with real-time feedback.',
    categories: ['ar', 'workshop'],
    techUsed: ['Lens Studio', 'Body Tracking API'],
    builtDuring: 'AR Creator Workshop',
    creatorName: 'Wellness Tech Team',
    creatorTeam: 'Meera Iyer, Raj Kumar',
    featured: false,
  },
  {
    id: 'proj7',
    title: 'AR Rangoli Creator',
    description: 'Design and place traditional rangoli patterns in AR. Share your creations with family and friends.',
    categories: ['snapar', 'hackathon'],
    techUsed: ['Lens Studio', 'Hand Tracking'],
    builtDuring: 'NovHack 2024',
    eventId: 'novhack-2024',
    creatorName: 'Kavitha Reddy',
    featured: false,
  },
  {
    id: 'proj8',
    title: 'Campus Navigator VR',
    description: 'A VR tour guide for prospective students to explore university campuses virtually before visiting.',
    categories: ['vr', 'hackathon'],
    techUsed: ['Unity', 'Photogrammetry', 'VR'],
    builtDuring: 'Campus XR Challenge 2024',
    eventId: 'campus-xr-challenge',
    creatorName: 'Team CampusXR',
    creatorTeam: 'Shreya Bansal, Amit Kumar, Divya Menon',
    featured: false,
  },
  {
    id: 'proj9',
    title: 'Meditation Space',
    description: 'A calming VR environment with guided meditation sessions and nature soundscapes for stress relief.',
    categories: ['vr', 'hackathon'],
    techUsed: ['Unity', 'Spatial Audio', 'VR'],
    builtDuring: 'MoodHack 2024',
    eventId: 'moodhack-2024',
    creatorName: 'ZenTech Studios',
    featured: false,
  },
];

// Showcase Creators
export const showcaseCreators: ShowcaseCreator[] = [
  {
    id: 'creator1',
    name: 'Priya Sharma',
    role: 'XR Developer',
    bio: 'Full-stack XR developer specializing in cultural heritage applications. Winner of WAVES 2025.',
    projectCount: 5,
    associatedProgram: 'XR Creator Hackathon with WAVES 2025',
  },
  {
    id: 'creator2',
    name: 'Sneha Kapoor',
    role: 'AR Creator',
    bio: 'Snap Lens Creator focused on wellness and emotional expression through AR.',
    projectCount: 12,
    associatedProgram: 'MoodHack 2024',
  },
  {
    id: 'creator3',
    name: 'Rohan Gupta',
    role: 'VR Developer',
    bio: 'Building immersive educational experiences. Passionate about making learning accessible.',
    projectCount: 3,
    associatedProgram: 'Campus XR Challenge 2024',
  },
  {
    id: 'creator4',
    name: 'Neha Malhotra',
    role: 'WebXR Developer',
    bio: 'Frontend developer exploring the intersection of web technologies and XR.',
    projectCount: 7,
    associatedProgram: 'Bharat XR Workshop Series',
  },
];

// Filter functions
export const getProjectsByCategory = (category: ProjectCategory): ShowcaseProject[] => {
  return showcaseProjects.filter(p => p.categories.includes(category));
};

export const getFeaturedProjects = (): ShowcaseProject[] => {
  return showcaseProjects.filter(p => p.featured);
};

export const getAllProjects = (): ShowcaseProject[] => {
  return showcaseProjects;
};

export const filterProjects = (
  projects: ShowcaseProject[],
  categories: ProjectCategory[]
): ShowcaseProject[] => {
  if (categories.length === 0) return projects;
  return projects.filter(p => 
    categories.some(cat => p.categories.includes(cat))
  );
};
