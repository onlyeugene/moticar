export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
  role: string;
  preferredCurrency?: string;
  country?: string;
  preferredLanguage?: string;
  preferredName?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  clearAuth: () => void;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken: string;
  user: User;
}

export interface SignupResponse {
  message: string;
  email: string;
}
