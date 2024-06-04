import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AssignPlayerDto {
    
    @IsNumber()
    @IsNotEmpty()
    playerId: number;    

    @IsNumber()
    @IsOptional()
    tournamentId?: number;    
}