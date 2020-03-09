export type Nullable<T> = T | null;

export type Id = string;

type Key = string;

type IterableInUI = { key?: Key };

export type UICollectionItem<T> = T & IterableInUI;

export interface IUser {
  id: Id;
  name: string;
  email: string;
}

export type IVoteType = "upvote" | "downvote";

export interface IServerVote {
  id: Id;
  userId: Id;
  trialId: Id;
  type: IVoteType;
}

export interface IServerTrial {
  id: Id;
  person: {
    id: Id;
    name: string;
    photo: string;
  };
  topic: string;
  topicURL: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  endDate: string;
  category: string;
}
