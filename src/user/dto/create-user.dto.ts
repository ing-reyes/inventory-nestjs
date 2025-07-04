import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(5)
    password: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    role?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    img?: string;

}
