import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class FindWishDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  owner?: Partial<User>;
}
