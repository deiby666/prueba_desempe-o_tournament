import {  IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;     
}
