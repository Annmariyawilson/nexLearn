export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  qualification: string;
  mobile: string;
  profile_image?: string;
}

export interface AuthState {
  mobile: string;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: UserProfile | null;
}