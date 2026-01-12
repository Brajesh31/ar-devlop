/**
 * Resources Data
 * Curated XR learning resources, tools, and paths
 */

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export interface FeaturedResource {
  id: string;
  title: string;
  type: 'guide' | 'tool' | 'video' | 'doc' | 'course';
  description: string;
  source: 'internal' | 'external';
  url: string;
}

export interface XRTool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  whoFor: string;
  whatYouLearn: string[];
  effortLevel: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

export interface CommunityPick {
  id: string;
  title: string;
  author: string;
  description: string;
  url: string;
}

export interface ResourceFAQ {
  id: string;
  question: string;
  answer: string;
}

// Resource Categories
export const resourceCategories: ResourceCategory[] = [
  {
    id: 'xr-basics',
    title: 'XR Basics',
    description: 'Foundational concepts of extended reality including AR, VR, and MR',
    icon: '🎯',
    slug: 'xr-basics',
  },
  {
    id: 'ar-development',
    title: 'AR Development',
    description: 'Build augmented reality experiences for mobile and web',
    icon: '📱',
    slug: 'ar-development',
  },
  {
    id: 'vr-development',
    title: 'VR Development',
    description: 'Create immersive virtual reality applications and games',
    icon: '🥽',
    slug: 'vr-development',
  },
  {
    id: 'tools-sdks',
    title: 'Tools & SDKs',
    description: 'Discover the best development tools and frameworks',
    icon: '🛠️',
    slug: 'tools-sdks',
  },
  {
    id: 'career-paths',
    title: 'Career & Learning Paths',
    description: 'Guidance for building a career in XR industry',
    icon: '🚀',
    slug: 'career-paths',
  },
  {
    id: 'research-cases',
    title: 'Research & Case Studies',
    description: 'Academic research and real-world XR implementations',
    icon: '📊',
    slug: 'research-cases',
  },
];

// Featured Resources
export const featuredResources: FeaturedResource[] = [
  {
    id: 'fr1',
    title: 'Getting Started with AR Development',
    type: 'guide',
    description: 'A comprehensive beginner\'s guide to augmented reality development covering concepts, tools, and your first project.',
    source: 'internal',
    url: '#',
  },
  {
    id: 'fr2',
    title: 'Lens Studio Fundamentals',
    type: 'course',
    description: 'Learn to create AR lenses for Snapchat from scratch with hands-on tutorials.',
    source: 'external',
    url: 'https://ar.snap.com/lens-studio',
  },
  {
    id: 'fr3',
    title: 'WebXR API Documentation',
    type: 'doc',
    description: 'Official W3C documentation for building immersive web experiences.',
    source: 'external',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API',
  },
  {
    id: 'fr4',
    title: 'XR Design Principles',
    type: 'video',
    description: 'Learn the fundamental design principles for creating user-friendly XR experiences.',
    source: 'internal',
    url: '#',
  },
  {
    id: 'fr5',
    title: 'Unity XR Interaction Toolkit',
    type: 'tool',
    description: 'High-level interaction system for creating VR and AR experiences in Unity.',
    source: 'external',
    url: 'https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@2.0/manual/index.html',
  },
];

// XR Tools & Platforms
export const xrTools: XRTool[] = [
  {
    id: 'tool1',
    name: 'Lens Studio',
    description: 'Create, publish, and share AR experiences on Snapchat',
    category: 'AR Development',
    url: 'https://ar.snap.com/lens-studio',
  },
  {
    id: 'tool2',
    name: 'Unity',
    description: 'Industry-leading game engine for VR, AR, and MR development',
    category: 'Game Engine',
    url: 'https://unity.com/',
  },
  {
    id: 'tool3',
    name: 'Unreal Engine',
    description: 'Powerful engine for high-fidelity VR and real-time 3D experiences',
    category: 'Game Engine',
    url: 'https://www.unrealengine.com/',
  },
  {
    id: 'tool4',
    name: 'A-Frame',
    description: 'Open-source web framework for building WebVR experiences',
    category: 'WebXR',
    url: 'https://aframe.io/',
  },
  {
    id: 'tool5',
    name: 'Spark AR',
    description: 'Create AR effects for Instagram and Facebook',
    category: 'AR Development',
    url: 'https://sparkar.facebook.com/ar-studio/',
  },
  {
    id: 'tool6',
    name: 'Blender',
    description: 'Free 3D modeling software for creating XR assets',
    category: '3D Modeling',
    url: 'https://www.blender.org/',
  },
  {
    id: 'tool7',
    name: 'Reality Composer',
    description: 'Apple\'s tool for prototyping AR experiences on iOS',
    category: 'AR Development',
    url: 'https://developer.apple.com/augmented-reality/tools/',
  },
  {
    id: 'tool8',
    name: 'Three.js',
    description: 'JavaScript library for 3D graphics on the web',
    category: 'WebXR',
    url: 'https://threejs.org/',
  },
];

// Learning Paths
export const learningPaths: LearningPath[] = [
  {
    id: 'path1',
    title: 'Beginner XR Path',
    description: 'Start your journey into extended reality from zero',
    whoFor: 'Complete beginners with no prior XR or programming experience',
    whatYouLearn: [
      'Understanding AR, VR, and MR concepts',
      'Basic 3D thinking and spatial design',
      'Your first AR filter with Lens Studio',
      'Introduction to Unity basics',
    ],
    effortLevel: 'beginner',
    icon: '🌱',
  },
  {
    id: 'path2',
    title: 'AR Creator Path',
    description: 'Master augmented reality development for social platforms',
    whoFor: 'Designers and creators interested in AR filters and effects',
    whatYouLearn: [
      'Advanced Lens Studio techniques',
      'Face tracking and body tracking',
      'World effects and marker-based AR',
      'Publishing and monetization strategies',
    ],
    effortLevel: 'intermediate',
    icon: '✨',
  },
  {
    id: 'path3',
    title: 'XR Developer Path',
    description: 'Build professional-grade XR applications',
    whoFor: 'Programmers looking to specialize in XR development',
    whatYouLearn: [
      'Unity XR development workflow',
      'Hand tracking and spatial interaction',
      'Performance optimization for XR',
      'Multi-platform deployment',
    ],
    effortLevel: 'advanced',
    icon: '💻',
  },
  {
    id: 'path4',
    title: 'Educator Path',
    description: 'Integrate XR into teaching and academic research',
    whoFor: 'Teachers, professors, and academic researchers',
    whatYouLearn: [
      'XR in education use cases',
      'Creating educational XR content',
      'Research methodologies for XR',
      'Classroom implementation strategies',
    ],
    effortLevel: 'intermediate',
    icon: '📚',
  },
];

// Community Picks
export const communityPicks: CommunityPick[] = [
  {
    id: 'cp1',
    title: 'Building My First AR Lens: A Journey',
    author: 'Priya Mehta',
    description: 'A community member shares their experience creating their first viral AR lens',
    url: '#',
  },
  {
    id: 'cp2',
    title: 'XR for Cultural Preservation',
    author: 'Bharat XR Research Team',
    description: 'How we used AR to digitize and preserve traditional Indian art forms',
    url: '#',
  },
  {
    id: 'cp3',
    title: 'Optimization Tips for WebXR',
    author: 'Arjun Sharma',
    description: 'Performance best practices learned from building WebXR experiences',
    url: '#',
  },
];

// Resources FAQ
export const resourcesFAQs: ResourceFAQ[] = [
  {
    id: 'rfaq1',
    question: 'Are these resources free?',
    answer: 'Most resources linked here are free or have free tiers. Some advanced courses or tools may have paid options, which we\'ll clearly indicate.',
  },
  {
    id: 'rfaq2',
    question: 'Do I need prior XR experience?',
    answer: 'No! We have resources for all skill levels, from complete beginners to advanced developers. Start with the Beginner XR Path if you\'re new.',
  },
  {
    id: 'rfaq3',
    question: 'Are these official tools?',
    answer: 'We link to official documentation and tools from verified sources like Unity, Snap, Meta, and W3C. Community picks are clearly labeled as such.',
  },
  {
    id: 'rfaq4',
    question: 'How often is this updated?',
    answer: 'We update our resources regularly as new tools, tutorials, and best practices emerge. Last updated: January 2025.',
  },
  {
    id: 'rfaq5',
    question: 'Can I contribute resources?',
    answer: 'Yes! Community members can suggest resources through our community channels. Quality contributions may be featured in Community Picks.',
  },
];
