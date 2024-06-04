import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

  ) { }

  async create(CreateResultDto: CreateResultDto): Promise<Result> {


    const player = await this.playerRepository.findOneBy({id: CreateResultDto.playerId, deletedAt: null });
    if (!player) {
      throw new NotFoundException('player not found');
    }

    const result = this.resultRepository.create({
      ...CreateResultDto,
      player
    });

    return this.resultRepository.save(result);
  }

  async findAll(page: number = 1, limit: number = +process.env.LIMIT): Promise<Result[]> {
    const skip = (page - 1) * limit;
    return this.resultRepository.find({
      skip,
      take: limit,
      where: { deletedAt: null },
      relations: ['player'],
    });
  }

  findOne(id: number) {
    return this.resultRepository.findOne({
      where: { id },
      select: {
        id: true,
        score: true,
      },
    });
  }


   async findOneWithPlayer(id: number): Promise<Result> {
    const result = await this.resultRepository.findOne({
      where: { id },
      relations: ['player'],
    });

    if (!result) {
      throw new NotFoundException(`player con ID ${id} no encontrado`);
    }

    return result;
  }


  async findAllWithResults(): Promise<{ highestScore: Result; lowestScore: Result }> {
    // Obtener todos los resultados con el puntaje más alto
    const allResults = await this.resultRepository.find({
      relations: ['player'], // Incluir relación con el jugador
      order: { score: 'DESC' }, // Ordenar por puntaje en orden descendente (más alto primero)
    });

    // Obtener todos los resultados con el puntaje más bajo
    const allResultsLowest = await this.resultRepository.find({
      relations: ['player'], // Incluir relación con el jugador
      order: { score: 'ASC' }, // Ordenar por puntaje en orden ascendente (más bajo primero)
    });

    // Seleccionar la primera fila de cada conjunto de resultados
    const highestScore = allResults[0];
    const lowestScore = allResultsLowest[0];

    return {
      highestScore,
      lowestScore,
    };
  }


  async update(id: number, UpdateResultDto: UpdateResultDto): Promise<Result> {
    const result = await this.resultRepository.update(id, UpdateResultDto);
    if (result.affected === 0) {
      throw new NotFoundException(`result con ID ${id} no encontrado`);
    }

    const dataUpdated = this.resultRepository.findOneBy({ id })
    return dataUpdated
  }


  async remove(id: number) {
    const result = await this.resultRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('result not found');
    }

    
    await this.resultRepository.softRemove(result);

    await this.resultRepository.update(id, { deletedAt: new Date() });

    const player = await this.playerRepository.findOne({
      where: { id: result.id, deletedAt: null },
      relations: ['result']
    });

    console.log(player.result);
    
    if (player) {
      player.result = { ...player.result, deletedAt: new Date() };
      await this.resultRepository.save(player);
    }
    
  }
}
