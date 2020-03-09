import cuid from 'cuid';

import {
  popeFrancisTrial,
  kanyeWestTrial,
  markZuckerbergTrial,
  cristinaFernandezTrial,
  malalaYousafzaiTrial,
} from './seed';

export const db = {
  trials: [
    popeFrancisTrial,
    kanyeWestTrial,
    markZuckerbergTrial,
    cristinaFernandezTrial,
    malalaYousafzaiTrial,
  ],
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@email.com',
      votes: [
        {
          id: cuid(),
          trialId: markZuckerbergTrial.id,
          type: 'downvote',
        },
        {
          id: cuid(),
          trialId: cristinaFernandezTrial.id,
          type: 'downvote',
        },
      ],
    },
  ],
};
