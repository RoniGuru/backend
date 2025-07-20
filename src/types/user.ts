// What clients send (plain password)
export interface CreateUserDto {
  name: string;
  password: string;
}

export interface LoginDto {
  name: string;
  password: string;
}

export interface UpdateUserDto {
  name: string;
  password: string;
}
export interface userData {
  id: number;
  name: string;
  created_at: Date;
}
