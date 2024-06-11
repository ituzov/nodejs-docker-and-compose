import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FindWishlistDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
