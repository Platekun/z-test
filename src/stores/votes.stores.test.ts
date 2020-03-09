import { when } from "mobx";

import { IServerVote, UICollectionItem } from "../types";
import { Vote } from "../models";
import { VotesStore } from "./votes.store";
import { AuthStore } from "./auth.store";

const response: Array<UICollectionItem<IServerVote>> = [
  {
    key: "test-key-1",
    id: "vote-1",
    userId: "jopn-doe-id",
    trialId: "1",
    type: "downvote"
  },
  {
    key: "test-key-2",
    userId: "jopn-doe-id",
    id: "vote-2",
    trialId: "2",
    type: "upvote"
  }
];

const expected: Array<Vote> = [
  new Vote({ key: "test-key-1", ...response[0] }),
  new Vote({ key: "test-key- 2", ...response[1] })
];

const error = new Error("Test Error");

test("Cache loading", done => {
  (VotesStore as any).load = jest.fn().mockResolvedValue(response);

  const store = new VotesStore(new AuthStore());

  when(
    () => store.fetching,

    () => {
      expect(store.cache).toBeNull();
    }
  );

  when(
    () => store.fetched,

    () => {
      expect(store.fetching).toBeFalsy();
      expect(store.failure).toBeFalsy();
      expect(store.cache).toMatchObject(expected);

      done();
    }
  );
});

test("Loading failure", done => {
  (VotesStore as any).load = jest.fn().mockRejectedValue(error);

  const store = new VotesStore(new AuthStore());

  when(
    () => store.fetching,

    () => {
      expect(store.cache).toBeNull();
    }
  );

  when(
    () => store.failure,

    () => {
      expect(store.fetching).toBeFalsy();
      expect(store.fetched).toBeFalsy();
      expect(store.cache).toBeNull();

      done();
    }
  );
});

test("Loading failure and retry", done => {
  (VotesStore as any).load = jest.fn().mockRejectedValue(error);

  const store = new VotesStore(new AuthStore());

  store.fetch();

  when(
    () => store.fetching,

    () => {
      expect(store.cache).toBeNull();
    }
  );

  when(
    () => store.failure,

    () => {
      (VotesStore as any).load = jest.fn().mockResolvedValue(response);

      store.refetch();
    }
  );

  when(
    () => store.fetched,

    () => {
      expect(store.fetching).toBeFalsy();
      expect(store.fetched).toBeTruthy();
      expect(store.cache).toMatchObject(expected);

      done();
    }
  );
});
