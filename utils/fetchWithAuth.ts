import api from '../services/api';
import { AxiosRequestConfig } from 'axios';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    const method = options.method?.toLowerCase() || 'get';
    
    // Convert Headers to plain object
    const headers: Record<string, string> = {};
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else if (typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }
    }

    const config: AxiosRequestConfig = {
      headers,
      ...(options.body && { data: JSON.parse(options.body.toString()) }),
    };

    switch (method) {
      case 'get':
        return api.get(url, config);
      case 'post':
        return api.post(url, config.data, config);
      case 'put':
        return api.put(url, config.data, config);
      case 'delete':
        return api.delete(url, config);
      case 'patch':
        return api.patch(url, config.data, config);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}; 