import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    name: 'email',
    description: 'an email for account creation',
    example: 'abc@exmaple.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    name: 'password',
    description: 'an passowrd mimimuj length 8',
    example: 'safePassword',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    name: 'name',
    description: 'an username for account',
    example: 'john',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}

export class SignInDTO {
  @ApiProperty({
    name: 'email',
    description: 'an email for account creation',
    example: 'abc@exmaple.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    name: 'password',
    description: 'an passowrd mimimuj length 8',
    example: 'safePassword',
    required: true,
  })
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
