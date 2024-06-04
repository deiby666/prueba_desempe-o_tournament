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

  if (!CreatePlayerDto.tournamentId) {

    //logica por si no recibe id del torneo
    const availableTournamentIds = await this.tournamentRepository.find({
      where: { deletedAt: null },
      select: ['id'], 
    });

    if (availableTournamentIds.length === 0) {
      throw new NotFoundException('No available tournaments');
    }

    const randomIndex = Math.floor(Math.random() * availableTournamentIds.length);
    const randomTournamentId = availableTournamentIds[randomIndex].id;

    const randomTournament = await this.tournamentRepository.findOneById(randomTournamentId);
    console.log(randomTournament);
    if (!randomTournament) {
      throw new Error('Unexpected error: Retrieved invalid random tournament ID');
    }

    CreatePlayerDto.tournamentId = randomTournament.id;
            
    const tournament = await this.tournamentRepository.findOneBy({id: CreatePlayerDto.tournamentId, deletedAt: null });
        if (!tournament) {
          throw new NotFoundException('Tournament not found');
        }

          const player = this.playerRepository.create({
          ...CreatePlayerDto,
          tournament
        });

        return this.playerRepository.save(player); 
    }
      //logica por si lo recibe
    const tournament = await this.tournamentRepository.findOneBy({id: CreatePlayerDto.tournamentId, deletedAt: null });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const player = this.playerRepository.create({
      ...CreatePlayerDto,
      tournament
    });

    return this.playerRepository.save(player);
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

/*   async findResultsByPlayer(id: number): Promise<Player> {
    const autor = await this.playerRepository.findOne({
      where: { id },
      relations: ['ventas'],
    });

    console.log(autor);


    if (!autor) {
      throw new NotFoundException(`tournament con ID ${id} no encontrado`);
    }

    return autor;
  }
 */

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
