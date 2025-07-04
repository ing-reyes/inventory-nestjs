import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto{
    @IsNumber()
    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number = 0;
    
    @IsNumber()
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;
}