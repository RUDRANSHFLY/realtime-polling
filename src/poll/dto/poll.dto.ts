import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class PollCreateDTO {
  @ApiProperty({
    name: 'question',
    type: String,
    description: 'a question u wanna ask for poll',
    example: 'What iss your favorite season of the year?',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  question!: string;

  @ApiProperty({
    name: 'isPublished',
    type: Boolean,
    description: 'wanna publish poll or not',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isPublished!: boolean;

  @ApiProperty({
    name: 'options',
    type: [String],
    description: 'List of Options for Poll',
    example: ['Spring', 'Summer', 'Autumn', 'Winter'],
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MinLength(2, { each: true })
  options!: string[];
}

export class PollDTO {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  question!: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublished!: boolean;

  @IsDate()
  @IsNotEmpty()
  createdAt!: Date;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PollOptionDTO)
  options!: PollOptionDTO[];

  constructor(partial: Partial<PollDTO>) {
    Object.assign(this, partial);
  }
}

export class PollResponseDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  message!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  page!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  limit!: number;

  @ValidateNested()
  @Type(() => PollDTO)
  @IsNotEmpty()
  polls!: PollDTO[];

  constructor(partial: Partial<PollResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class PollOptionDTO {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  text!: string;

  constructor(partial: Partial<PollOptionDTO>) {
    Object.assign(this, partial);
  }
}

export class PollCreateResponseDTO {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  message!: string;

  constructor(partial: Partial<PollCreateResponseDTO>) {
    Object.assign(this, partial);
  }
}
