import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Player } from 'src/players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result,Player])],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
