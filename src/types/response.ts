export interface AuthResponse {
  success: boolean;
  user?: { id: number; name: string };
  error?: string;
}

//make global declar so dont have to import
declare global {
  namespace Express {
    interface Request {
      user?: { name: string; id: number }; // or use a more specific type
    }
  }
}

export interface jwtUserPayload {
  name: string;
  id: number;
}
