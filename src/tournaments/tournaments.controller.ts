import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UnauthorizedException, Req } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { AssignPlayerDto } from './dto/assignPlayer.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}


  //this method includes the validation of the api key required in the user history
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() request: any,
    @Body() createTournamentDto: CreateTournamentDto
  ) {

     const apiKey = request.headers['x-api-key'];
    if (apiKey !== 'administrador') {
      throw new UnauthorizedException('API Key inválida');
    }
    
    return this.tournamentsService.create(createTournamentDto);
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

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  async findAndOrder(@Param('name') name: string): Promise<Tournament> {
    const autor = await this.tournamentsService.findOneWithPlayersOrdering(name);
    if (!autor) {
      throw new NotFoundException(`tournament con ID ${name} no encontrado`);
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
