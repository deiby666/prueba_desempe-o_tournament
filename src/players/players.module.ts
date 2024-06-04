import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player,Tournament])],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
