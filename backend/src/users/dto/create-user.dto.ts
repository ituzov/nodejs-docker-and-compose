import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
