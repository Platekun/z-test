import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { TrialsModule } from './trials/trials.module';
import { VotesController } from './votes/votes.controller';

@Module({
  imports: [TrialsModule],
  controllers: [AppController, VotesController],
  providers: [],
})
export class AppModule {}
