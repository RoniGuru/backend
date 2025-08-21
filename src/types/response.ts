export interface AuthResponse {
  success: boolean;
  user?: { id: number; name: string };
  error?: string;
}

//make global declar so dont have to import
declare global {
  namespace Express {
    interface Request {
      user?: { username: string; id: number }; // or use a more specific type
    }
  }
}

export interface jwtUserPayload {
  username: string;
  id: number;
}
