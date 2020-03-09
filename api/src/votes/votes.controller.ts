import { Controller, Post, Body } from '@nestjs/common';

import { db } from 'src/db';
import { pause } from 'src/utils';

@Controller('votes')
export class VotesController {
  @Post()
  async onGetVotes(@Body('userId') userId: string) {
    await pause(3000);

    const user = db.users.find(user => user.id === userId);

    return user.votes.map(vote => ({ ...vote, userId }));
  }
}
