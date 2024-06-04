import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { Player } from 'src/players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament,Player])],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}
