import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { Tournament } from 'src/tournaments/entities/tournament.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,

    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

  ) { }

  async create(CreatePlayerDto: CreatePlayerDto): Promise<Player> { 
    return this.playerRepository.save(CreatePlayerDto);
  }




  async findAll(page: number = 1, limit: number = +process.env.LIMIT): Promise<Player[]> {
    const skip = (page - 1) * limit;
    return this.playerRepository.find({
      skip,
      take: limit,
      where: { deletedAt: null },
      relations: ['tournament'],
    });
  }

  findOne(id: number) {
    return this.playerRepository.findOne({
      where: { id },
      select: {
        id: true,
        nombre: true,
      },
    });
  }
  
  async update(id: number, UpdatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const result = await this.playerRepository.update(id, UpdatePlayerDto);
    if (result.affected === 0) {
      throw new NotFoundException(`player con ID ${id} no encontrado`);
    }

    const dataUpdated = this.playerRepository.findOneBy({ id })
    return dataUpdated
  }


  async remove(id: number) {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('player not found');
    }

    
    await this.playerRepository.softRemove(player);

    await this.playerRepository.update(id, { deletedAt: new Date() });

    const tournament = await this.tournamentRepository.findOne({
      where: { id: player.id, deletedAt: null },
      relations: ['players']
    });

    
    if (tournament) {
      tournament.players = tournament.players.map(lib => lib.id === id ? { ...lib, deletedAt: new Date() } : lib);
      await this.playerRepository.save(tournament);
    }
  }
}
