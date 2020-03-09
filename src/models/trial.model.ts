import { observable } from "mobx";
import cuid from "cuid";
import { parse } from "date-fns";
import fetch from "cross-fetch";

import {
  Id,
  IServerTrial,
  IVoteType,
  Nullable,
  UICollectionItem
} from "../types";
import { Vote } from "./vote.model";
import { DATE_FORMAT } from "../constants";

interface SaveTrialOptions {
  userId: Id;
  voteType: IVoteType;
  vote: Nullable<Vote>;
}

export class Trial {
  public key: Id = cuid();
  public id: Id;
  public personName: string;
  public personPhoto: string;
  public topic: string;
  public topicURL: string;
  public category: string;
  @observable public upvotes: number;
  @observable public downvotes: number;
  @observable public createdAt: Date;
  @observable public endDate: Date;

  constructor(opts: UICollectionItem<IServerTrial>) {
    if (opts.key) {
      this.key = opts.key;
    }

    this.id = opts.id;
    this.personName = opts.person.name;
    this.personPhoto = opts.person.photo;
    this.topic = opts.topic;
    this.topicURL = opts.topicURL;
    this.upvotes = opts.upvotes;
    this.downvotes = opts.downvotes;
    this.category = opts.category;

    // TODO: I wonder why it's requiring a backupDate ?
    // @ts-ignore
    this.createdAt = parse(opts.createdAt, DATE_FORMAT);
    // TODO: I wonder why it's requiring a backupDate ?
    // @ts-ignore
    this.endDate = parse(opts.endDate, DATE_FORMAT);
  }

  public get liked() {
    return this.upvotes > this.downvotes;
  }

  public get disliked() {
    return this.downvotes > this.upvotes;
  }

  public async save(opts: SaveTrialOptions): Promise<void> {
    const { userId, voteType, vote } = opts;

    const response = await fetch(
      `http://localhost:3000/trials/${this.id}/vote`,
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          voteType
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Vote could not be saved");
    }

    const hasVotedAlready = vote !== null;
    if (!hasVotedAlready) {
      if (voteType === "upvote") {
        this.upvotes = this.upvotes + 1;
      } else {
        this.downvotes = this.downvotes + 1;
      }
    } else {
      const changedDownvoteToUpvote =
        (vote as Vote).type === "downvote" && voteType === "upvote";

      const changedUpvoteToDownvote =
        (vote as Vote).type === "upvote" && voteType === "downvote";

      if (changedDownvoteToUpvote) {
        this.upvotes = this.upvotes + 1;
        this.downvotes = this.downvotes - 1;
      } else if (changedUpvoteToDownvote) {
        this.upvotes = this.upvotes - 1;
        this.downvotes = this.downvotes + 1;
      }
    }
  }
}
