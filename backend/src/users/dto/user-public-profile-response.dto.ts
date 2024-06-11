import { IsNumber, IsString, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserPublicProfileResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  about: string;

  @Expose()
  @IsUrl()
  avatar: string;

  @Expose()
  @IsString()
  createdAt: string;

  @Expose()
  @IsString()
  updatedAt: string;
}
