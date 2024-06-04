import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() CreatePlayerDto: CreatePlayerDto) {
    return this.playersService.create(CreatePlayerDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
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
  update(@Param('id') id: string, @Body() UpdatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, UpdatePlayerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
