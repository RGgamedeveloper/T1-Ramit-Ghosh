import client from './client';
import type { User, AuthTokens } from '../types';

interface GoogleLoginPayload {
  credential?: string;
  code?: string;
  redirect_uri?: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface EmailLoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  googleLogin: (payload: GoogleLoginPayload) =>
    client.post<AuthResponse>('/auth/google/login/', payload),

  register: (payload: RegisterPayload) =>
    client.post<AuthResponse>('/auth/register/', payload),

  emailLogin: (payload: EmailLoginPayload) =>
    client.post<AuthResponse>('/auth/login/', payload),

  getProfile: () =>
    client.get<User>('/auth/profile/'),

  updateProfile: (data: Partial<User>) =>
    client.patch<User>('/auth/profile/', data),
};
