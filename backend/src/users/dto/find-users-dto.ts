import { IsEmail, IsOptional, IsString } from 'class-validator';

export class FindUsersDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
