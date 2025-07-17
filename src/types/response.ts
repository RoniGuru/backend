export interface AuthResponse {
  success: boolean;
  user?: { id: number; name: string };
  error?: string;
}
