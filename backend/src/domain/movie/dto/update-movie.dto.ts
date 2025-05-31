import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  IsArray,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  @IsString()
  originalTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsInt()
  recommendedAge?: number;

  @IsOptional()
  @IsInt()
  budget?: number;

  @IsOptional()
  @IsInt()
  boxOffice?: number;

  @IsOptional()
  @IsString()
  studio?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsArray()
  // @IsUUID('4', { each: true })
  categoryIds?: string[];
}
