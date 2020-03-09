import cuid from "cuid";

import { Id, IServerVote, IVoteType, UICollectionItem } from "../types";

export class Vote {
  public key: Id = cuid();
  public id: Id;
  public userId: Id;
  public trialId: Id;
  public type: IVoteType;

  constructor(opts: UICollectionItem<IServerVote>) {
    if (opts.key) {
      this.key = opts.key;
    }

    this.id = opts.id;
    this.userId = opts.userId;
    this.trialId = opts.trialId;
    this.type = opts.type;
  }
}
