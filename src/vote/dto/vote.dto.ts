import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoteCreateDTO {
  @ApiProperty({
    name: 'pollId',
    description: 'poll id of u wanna make a vote',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  pollId!: string;

  @ApiProperty({
    name: 'optionId',
    description:
      'option id of that polls options u wanna vote for that option of that poll',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  optionId!: string;
}
