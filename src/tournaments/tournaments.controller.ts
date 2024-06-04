import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { AssignPlayerDto } from './dto/assignPlayer.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() CreateTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(CreateTournamentDto);
  }

  @Post('player')
  @HttpCode(HttpStatus.CREATED)
  assignPlayer(@Body() assignPlayerDto: AssignPlayerDto) {
    return this.tournamentsService.assignPlayer(assignPlayerDto);
  }
  

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @Get('tournament/:id')
  @HttpCode(HttpStatus.OK)
  async findOneWithPlayers(@Param('id') id: string): Promise<Tournament> {
    const autor = await this.tournamentsService.findOneWithPlayers(+id);
    if (!autor) {
      throw new NotFoundException(`tournament con ID ${id} no encontrado`);
    }
    return autor;
  }


  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() UpdateTournamentDto: UpdateTournamentDto) {
    return this.tournamentsService.update(+id, UpdateTournamentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
