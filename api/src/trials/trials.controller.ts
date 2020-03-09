import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import cuid from 'cuid';

import { UpdateTrialDTO } from './dtos';
import { db } from 'src/db';
import { pause } from 'src/utils';

function Vote(trialId: string, voteType: 'downvote' | 'upvote') {
  return {
    id: cuid(),
    trialId: trialId,
    type: voteType,
  };
}

@Controller('trials')
export class TrialsController {
  @Get()
  public async onGetTrails() {
    await pause(3000);

    return db.trials;
  }

  @Post(':id/vote')
  public async onTrialVoted(@Param() params, @Body() dto: UpdateTrialDTO) {
    await pause(3000);

    const trialId: string = params.id;
    const { userId, voteType } = dto;

    /**
     * Create new user vote
     */
    const user = db.users.find(user => user.id === userId);
    const userIdx = db.users.findIndex(user => user.id === userId);

    const existingVote = user.votes.find(vote => vote.trialId === trialId);

    if (typeof existingVote !== 'undefined') {
      const updatedUser = {
        ...user,
        votes: user.votes.map(vote => {
          if (vote.id !== existingVote.id) {
            return vote;
          } else {
            return {
              ...vote,
              type: voteType,
            };
          }
        }),
      };

      db.users[userIdx] = updatedUser;
    } else {
      user.votes.push(Vote(trialId, voteType));
    }

    /**
     * Update trial
     */
    const trial = db.trials.find(trial => trial.id === trialId);
    const trialIdx = db.trials.findIndex(trial => trial.id === trialId);

    let updatedTrial: typeof trial;

    if (typeof existingVote === 'undefined') {
      if (voteType === 'upvote') {
        updatedTrial = {
          ...trial,
          upvotes: trial.upvotes + 1,
        };
      } else {
        updatedTrial = {
          ...trial,
          downvotes: trial.downvotes + 1,
        };
      }
    } else {
      const changedDownvoteToUpvote =
        existingVote.type === 'downvote' && voteType === 'upvote';

      const changedUpvoteToDownvote =
        existingVote.type === 'upvote' && voteType === 'downvote';

      if (changedDownvoteToUpvote) {
        updatedTrial = {
          ...trial,
          upvotes: trial.upvotes + 1,
          downvotes: trial.downvotes - 1,
        };
      } else if (changedUpvoteToDownvote) {
        updatedTrial = {
          ...trial,
          upvotes: trial.upvotes - 1,
          downvotes: trial.downvotes + 1,
        };
      } else {
        updatedTrial = db.trials[trialIdx];
      }
    }

    db.trials[trialIdx] = updatedTrial;
  }
}
