const API_BASE_URL = 'http://localhost:8080/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', url);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log('Using token:', this.token.substring(0, 10) + '...');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        console.error('API Error:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Auth Service Error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      if (error instanceof Error && error.message.includes('CORS')) {
        throw new Error('CORS error. Please check your backend CORS configuration.');
      }
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: ApiResponse = await this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Extract token and user from the API response
    this.token = response.data.token;
    localStorage.setItem('auth_token', this.token);
    
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response: ApiResponse = await this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Extract token and user from the API response
    this.token = response.data.token;
    localStorage.setItem('auth_token', this.token);
    
    return response.data;
  }

  async logout(): Promise<void> {
    if (this.token) {
      await this.makeRequest('/logout', {
        method: 'POST',
      });
    }

    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getUser(): Promise<User> {
    const response = await this.makeRequest('/me');
    return response.data?.user || response.user || response;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
