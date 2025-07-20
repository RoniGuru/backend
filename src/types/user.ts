export interface UserDto {
  name: string;
  password: string;
}

export interface UpdateUserDto {
  id: number;
  name: string;
  password: string;
}
export interface userData {
  id: number;
  name: string;
  created_at: Date;
}
