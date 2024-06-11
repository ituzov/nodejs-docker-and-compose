import { IsString } from 'class-validator';

export class FindManyUsersDto {
  @IsString()
  query: string;
}
