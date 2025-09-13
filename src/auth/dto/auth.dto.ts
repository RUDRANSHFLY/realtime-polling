import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}

export class SignInDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}

export class AuthUserDTO {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  id!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  constructor(partial: Partial<AuthUserDTO>) {
    Object.assign(this, partial);
  }
}

export class AuthResponseDTO {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  message!: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => AuthUserDTO)
  user!: AuthUserDTO;

  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  constructor(partial: Partial<AuthResponseDTO>) {
    Object.assign(this, partial);
  }
}
