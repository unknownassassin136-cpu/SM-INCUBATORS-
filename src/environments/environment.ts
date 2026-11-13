// Dynamic environment configuration:
// Automatically uses local backend when running on localhost,
// and uses production backend when deployed.
const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const environment = {
  production: !isLocal,
  siteUrl: 'https://smincubators.in',
  apiUrl: isLocal ? 'http://localhost:5000/api' : '/api',
};
