import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty()
    @IsString()
    @MinLength(3)
    name: string;
   
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
    
    @ApiProperty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsDate()
    entryDate: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    departureDate?: Date;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    active: boolean;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    img?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
