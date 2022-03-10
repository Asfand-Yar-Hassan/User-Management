import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName: string;
}
