import '@testing-library/jest-dom';

// Mock import.meta for testing
(global as any).importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:3001',
  },
};

