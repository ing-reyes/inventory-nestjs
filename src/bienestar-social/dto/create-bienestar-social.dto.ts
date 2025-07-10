import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBienestarSocialDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsOptional()
    summary?: string;

    @IsString()
    @IsOptional()
    doc?: string;
}
