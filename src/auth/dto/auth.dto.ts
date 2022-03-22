/* eslint-disable prettier/prettier */
import { Roles } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
