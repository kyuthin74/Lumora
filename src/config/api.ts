export const API_BASE_URL = "https://lumora-backend-ba9s.onrender.com";
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export const getApiBaseUrl = (): string => API_BASE_URL;
