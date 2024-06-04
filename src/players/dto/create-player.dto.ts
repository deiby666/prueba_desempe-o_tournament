import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;    

    @IsNumber()
    @IsOptional()
    tournamentId?: number;    
}