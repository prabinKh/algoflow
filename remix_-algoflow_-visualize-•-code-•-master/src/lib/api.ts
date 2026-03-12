import { GoogleGenAI } from "@google/genai";

export const getApiConfig = () => {
  const config = localStorage.getItem('algo_flow_api_config');
  if (config) {
    try {
      return JSON.parse(config);
    } catch (e) {
      return {};
    }
  }
  return {};
};

export const saveApiConfig = (config: { geminiKey?: string; backendUrl?: string }) => {
  localStorage.setItem('algo_flow_api_config', JSON.stringify(config));
};

export const getBackendUrl = () => {
  // For now, always talk to the Django backend.
  // If you want to make this configurable again, wire it through getApiConfig().
  return 'http://localhost:8000';
};

export const getGeminiKey = () => {
  const config = getApiConfig();
  return config.geminiKey || process.env.GEMINI_API_KEY || '';
};

export const createAiClient = () => {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key is not configured. Please set it in the API Matrix.');
  }
  return new GoogleGenAI({ apiKey });
};

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const baseUrl = getBackendUrl();
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  
  // Get access token from cookie
  const getCookie = (name: string) => {
   const value = `; ${document.cookie}`;
   const parts = value.split(`; ${name}=`);
   if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };
  
  const accessToken = getCookie('access_token');
  
  // Merge headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if we have a token
  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }
  
  // Include credentials for cookies
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  });
  
  return response;
};
