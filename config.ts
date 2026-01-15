/**
 * Application Configuration
 * Contains API URLs and other configuration settings
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds
  },
 
};
