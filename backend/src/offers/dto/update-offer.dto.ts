import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
