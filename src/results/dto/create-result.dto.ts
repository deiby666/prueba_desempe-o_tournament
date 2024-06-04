import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
    @IsString()
    @IsNotEmpty()
    score: string;    

    @IsInt()
    @IsNotEmpty()
    playerId: number;    
}
