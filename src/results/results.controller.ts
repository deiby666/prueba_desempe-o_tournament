import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() CreateResultDto: CreateResultDto) {
    return this.resultsService.create(CreateResultDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
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
  update(@Param('id') id: string, @Body() UpdateResultDto: UpdateResultDto) {
    return this.resultsService.update(+id, UpdateResultDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.resultsService.remove(+id);
  }
}
