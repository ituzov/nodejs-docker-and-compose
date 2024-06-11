import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description?: string;

  @IsOptional()
  itemsId?: number[];
}
