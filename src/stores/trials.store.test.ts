import { when } from "mobx";

import { UICollectionItem, IServerTrial } from "../types";
import { Trial } from "../models";
import { TrialsStore } from "./trials.store";

const response: Array<UICollectionItem<IServerTrial>> = [
  {
    key: "test-key",
    id: "trial-id",
    person: {
      id: "person-id",
      name: "John Doe",
      photo: "A person URL"
    },
    upvotes: 50,
    downvotes: 50,
    topic: "Loremp Ipsum",
    topicURL: "A topic URL",
    createdAt: "03/06/2020",
    endDate: "04/06/2020",
    category: "Religion"
  }
];

const expected: Array<Trial> = [new Trial({ key: "test-key", ...response[0] })];

const error = new Error("Test Error");

test("Cache loading", done => {
  (TrialsStore as any).load = jest.fn().mockResolvedValue(response);

  const store = new TrialsStore();

  store.fetch();

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
  (TrialsStore as any).load = jest.fn().mockRejectedValue(error);

  const store = new TrialsStore();

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
      expect(store.fetching).toBeFalsy();
      expect(store.fetched).toBeFalsy();
      expect(store.cache).toBeNull();

      done();
    }
  );
});

test("Loading failure and retry", done => {
  (TrialsStore as any).load = jest.fn().mockRejectedValue(error);

  const store = new TrialsStore();

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
      (TrialsStore as any).load = jest.fn().mockResolvedValue(response);

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
