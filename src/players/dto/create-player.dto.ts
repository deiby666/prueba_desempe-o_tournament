import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;    

    @IsInt()
    @IsNotEmpty()
    tournamentId: number;    
}