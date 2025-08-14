export interface UserDto {
  name: string;
  password: string;
}

export interface UpdateUserDto {
  name: string;
  password: string;
  high_score: number;
}
export interface userData {
  id: number;
  name: string;
  high_score: number;
  created_at: Date;
  password?: string;
}
