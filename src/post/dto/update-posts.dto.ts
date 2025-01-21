import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  topic: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  community: string;
}
