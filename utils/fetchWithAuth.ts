const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Ensure the URL starts with a slash
    const apiUrl = url.startsWith('/') ? url : `/${url}`;

    const response = await fetch(`${API_BASE_URL}${apiUrl}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login?redirect=' + window.location.pathname;
      throw new Error('Please log in to continue');
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}; 