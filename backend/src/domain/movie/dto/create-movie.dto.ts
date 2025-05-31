import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  originalTitle: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  releaseDate: string;

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

  @IsArray()
  @ArrayNotEmpty({ message: 'Pelo menos uma categoria deve ser informada.' })
  // @IsUUID('4', { each: true })
  categoryIds: string[];
}
