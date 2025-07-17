// What clients send (plain password)
export interface CreateUserDto {
  name: string;
  password: string;
}

export interface LoginDto {
  name: string;
  password: string;
}
