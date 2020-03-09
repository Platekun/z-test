import { Module } from '@nestjs/common';
import { TrialsController } from './trials.controller';

@Module({
  controllers: [TrialsController]
})
export class TrialsModule {}
