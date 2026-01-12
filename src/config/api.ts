/**
 * API Configuration File
 * Add your API tokens, endpoints, and other configuration here.
 * This file is meant to be populated with your backend credentials.
 */

// Automatically detect if we are on localhost, dev, or production
const getBaseUrl = () => {
  // If running locally (npm run dev), point to local PHP server if you have one,
  // or use the relative path if you are proxying.
  // For standard localhost development without a local PHP setup,
  // you might point this to your temporary live testing domain:
  if (import.meta.env.DEV) {
    return 'https://bharatxr.edtech-community.com/api';
  }

  // In production (built files), use relative path
  // This works for both bharatxr.co/api and bharatxr.edtech-community.com/api
  return '/api';
};

export const API_CONFIG = {
  // Base API URL
  baseUrl: getBaseUrl(),

  // Authentication endpoints
  auth: {
    login: '/auth/login.php',
    signup: '/auth/signup.php',
    logout: '/auth/logout.php',
  },

  // Admin endpoints (Added for Admin Panel Integration)
  admin: {
    login: '/admin/login.php',
    create: '/admin/add_new.php',
    forgotPassword: '/admin/forgot_password.php',
    stats: '/admin/stats.php'
  },

  // Contact form endpoint
  contact: {
    submit: '/contact/submit.php',
  },

  // Events endpoints
  events: {
    list: '/events/list.php',
    upcoming: '/events/upcoming.php',
    past: '/events/past.php',
  },

  // Hackathons endpoints
  hackathons: {
    list: '/hackathons/list.php',
    live: '/hackathons/live.php',
    past: '/hackathons/past.php',
  },

  // Newsletter
  newsletter: {
    subscribe: '/newsletter/subscribe.php',
  },
};

/**
 * External API Keys
 * Store your API keys here. In production, these should come from environment variables.
 */
export const API_KEYS = {
  // Example: analytics: import.meta.env.VITE_ANALYTICS_KEY || '',
  // Example: emailService: import.meta.env.VITE_EMAIL_SERVICE_KEY || '',
};

/**
 * Social Media Links
 */
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/bharatxr',
  twitter: 'https://twitter.com/bharatxr',
  linkedin: 'https://linkedin.com/company/bharatxr',
  whatsapp: 'https://wa.me/919999999999', // Update with actual number
  youtube: 'https://youtube.com/@bharatxr',
  discord: 'https://discord.gg/bharatxr', // Update with actual invite
};

/**
 * Contact Information
 */
export const CONTACT_INFO = {
  email: 'hello@bharatxr.com',
  businessEmail: 'info@bharatxr.co',
  supportEmail: 'support@bharatxr.co',
  phone: '+91 99999 99999',
  address: 'India',
};