import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class FindOfferDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @IsOptional()
  @IsNumber()
  itemId?: number;

  @IsOptional()
  @IsNumber()
  id?: number;
}
