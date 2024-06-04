import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { AssignPlayerDto } from './dto/assignPlayer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) { }

  async create(CreateTournamentDto: CreateTournamentDto): Promise<Tournament> {
    return this.tournamentRepository.save(CreateTournamentDto);
  }


  async assignPlayer(assignPlayerDto: AssignPlayerDto): Promise<Player> { 
    const playerId = await this.playerRepository.findOneOrFail({
      where: { id: assignPlayerDto.playerId },
      relations: ['tournament'], 
    });
          
    if (!assignPlayerDto.tournamentId) {
      //logica por si no lo recibe
      const availableTournamentIds = await this.tournamentRepository.find({
        where: { deletedAt: null },
        select: ['id'],
      });
            
      if (availableTournamentIds.length === 0) {
        throw new NotFoundException('No available tournaments');
      }
            
      const randomIndex = Math.floor(Math.random() * availableTournamentIds.length);
      const randomTournamentId = availableTournamentIds[randomIndex].id;
            
      assignPlayerDto.tournamentId = randomTournamentId;

      const tournament = await this.tournamentRepository.findOneById(assignPlayerDto.tournamentId);
      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }
          
      playerId.tournament = tournament;
      await this.playerRepository.save(playerId); 
            
      return playerId;
    }

    //logica por si lo recibe
    const tournament = await this.tournamentRepository.findOneById(assignPlayerDto.tournamentId);
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
      
    playerId.tournament = tournament;
    await this.playerRepository.save(playerId);
    return playerId;
  }
    
  async findAll(page: number = 1, limit: number = +process.env.LIMIT): Promise<Tournament[]> {
    const skip = (page - 1) * limit;
    return this.tournamentRepository.find({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.tournamentRepository.findOne({
      where: { id },
      select: {
        id: true,
        nombre: true,
      },
    });
  }

  async findOneWithPlayers(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.createQueryBuilder('tournament',)
        .leftJoinAndSelect('tournament.players', 'player')
        .where('tournament.id = :id', { id })
        .andWhere('tournament.deletedAt IS NULL')
        .andWhere('player.deletedAt IS NULL')
        .getOne();

    if (!tournament) {
        throw new NotFoundException(`tournament con ID ${id} no encontrado`);
    }

    return tournament;
  } 

  async update(id: number, UpdateTournamentDto: UpdateTournamentDto): Promise<Tournament> {
    const result = await this.tournamentRepository.update(id, UpdateTournamentDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Autor con ID ${id} no encontrado`);
    }

    const dataUpdated = this.tournamentRepository.findOneBy({ id })
    return dataUpdated
  }

  // : Promise<{ message: String }>
  async remove(id: number) {
    const autor = await this.tournamentRepository.findOne({ where: { id } });
    if (!autor) {
      throw new NotFoundException('Author not found');
    }

    await this.tournamentRepository.softRemove(autor);

    await this.playerRepository.update({ tournament: { id } }, { deletedAt: new Date() });
  }
}
