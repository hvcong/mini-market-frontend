export const config = {
  // Data source mode:
  // - 'mock': Use in-memory mock data (no persistence)
  // - 'json-server': Use JSON Server (http://localhost:3030) - data persists
  // - 'real': Use real backend API
  dataMode: 'mock', // Change to 'json-server' to enable CRUD persistence

  // For backward compatibility
  get useMockData() {
    return this.dataMode === 'mock';
  },

  // JSON Server URL (when dataMode = 'json-server')
  jsonServerUrl: "http://localhost:3030",

  // API URL cho backend thật (when dataMode = 'real')
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:3000/api",

  // Timeout cho API requests
  apiTimeout: 10000,

  // App settings
  appName: "Mini Market",
  appVersion: "1.0.0",

  // Pagination
  defaultPageSize: 20,

  // Currency format
  currency: "VND",
};
