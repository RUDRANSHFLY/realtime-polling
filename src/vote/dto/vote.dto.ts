import { IsNotEmpty, IsString } from 'class-validator';

export class VoteCreateDTO {
  @IsString()
  @IsNotEmpty()
  pollId!: string;

  @IsString()
  @IsNotEmpty()
  optionId!: string;
}
