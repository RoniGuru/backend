export interface UserDto {
  username: string;
  password: string;
  high_score: number;
}

export interface UpdateUserDto {
  username: string;
  password: string;
  high_score: number;
  new_password: string;
}
export interface userData {
  id: number;
  username: string;
  high_score: number;
  created_at: Date;
  password?: string;
}
