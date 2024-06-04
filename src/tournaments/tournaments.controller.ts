import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() CreateTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(this.tournamentsService);
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

/*   @Get('autor/:id')
  @HttpCode(HttpStatus.OK)
  async findOneWithBooks(@Param('id') id: string): Promise<Autore> {
    const autor = await this.autoresService.findOneWithBooks(+id);
    if (!autor) {
      throw new NotFoundException(`Autor con ID ${id} no encontrado`);
    }
    return autor;
  } */


  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() UpdatePlayerDto: UpdateTournamentDto) {
    return this.tournamentsService.update(+id, UpdateTournamentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
