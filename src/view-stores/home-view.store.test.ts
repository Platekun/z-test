import { when } from "mobx";

import { UICollectionItem, IServerTrial, IServerVote } from "../types";
import { Trial, Vote } from "../models";
import { HomeViewStore } from "./home.view-store";
import { AuthStore, TrialsStore, VotesStore } from "../stores";

const trialId = "trial-id-1";
const trial2Id = "trial-id-2";
const trial3Id = "trial-id-3";

const trialsResponse: Array<UICollectionItem<IServerTrial>> = [
  {
    key: "test-key",
    id: trialId,
    person: {
      id: "person-id-1",
      name: "John Doe 1",
      photo: "A person URL"
    },
    upvotes: 50,
    downvotes: 50,
    topic: "Loremp Ipsum",
    topicURL: "A topic URL",
    createdAt: "03/06/2020",
    endDate: "04/06/2020",
    category: "Religion"
  },
  {
    key: "test-key-2",
    id: trial2Id,
    person: {
      id: "person-id-2",
      name: "John Doe 2",
      photo: "A person URL"
    },
    upvotes: 50,
    downvotes: 50,
    topic: "Loremp Ipsum",
    topicURL: "A topic URL",
    createdAt: "03/06/2020",
    endDate: "04/06/2020",
    category: "Religion"
  },
  {
    key: "test-key-3",
    id: trial3Id,
    person: {
      id: "person-id-3",
      name: "John Doe 3",
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

const expectedTrials: Array<Trial> = [
  new Trial({ key: "test-key", ...trialsResponse[0] }),
  new Trial({ key: "test-key-2", ...trialsResponse[1] }),
  new Trial({ key: "test-key-3", ...trialsResponse[2] })
];

const votesResponse: Array<UICollectionItem<IServerVote>> = [
  {
    key: "test-key-1",
    id: "vote-1",
    userId: "jopn-doe-id",
    trialId: trialId,
    type: "downvote"
  },
  {
    key: "test-key-2",
    userId: "jopn-doe-id",
    id: "vote-2",
    trialId: trial2Id,
    type: "upvote"
  }
];

const expectedVotes: Array<Vote> = [
  new Vote({ key: "test-key-1", ...votesResponse[0] }),
  new Vote({ key: "test-key- 2", ...votesResponse[1] })
];

const error = new Error("Test Error");

test("Cache loading", done => {
  (VotesStore as any).load = jest.fn().mockResolvedValue(votesResponse);
  (TrialsStore as any).load = jest.fn().mockResolvedValue(trialsResponse);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.cacheReady,

    () => {
      expect(store.fetchingTrialsCache).toBeFalsy();
      expect(store.fetchingVotesCache).toBeFalsy();
      expect(store.failedToLoadTrialsCache).toBeFalsy();
      expect(store.failedToLoadVotesCache).toBeFalsy();

      expect(store.findVoteByTrialId(trialId)).toMatchObject(expectedVotes[0]);
      expect(store.findVoteByTrialId(trial2Id)).toMatchObject(expectedVotes[1]);

      expect(store.dailyTrial).toMatchObject(expectedTrials[0]);
      expect(store.pastTrials).toMatchObject([
        expectedTrials[1],
        expectedTrials[2]
      ]);

      expect(store.votedInTrial(trial3Id)).toBeFalsy();

      done();
    }
  );
});

test("Loading Trials failure", done => {
  (VotesStore as any).load = jest.fn().mockResolvedValue(votesResponse);
  (TrialsStore as any).load = jest.fn().mockRejectedValue(error);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.failedToLoadTrialsCache,

    () => {
      expect(store.cacheReady).toBeFalsy();
      expect(store.fetchingTrialsCache).toBeFalsy();
      expect(store.dailyTrial).toBeNull();
      expect(store.pastTrials).toBeNull();

      done();
    }
  );
});

test("Loading Trials failure and retry", done => {
  (VotesStore as any).load = jest.fn().mockResolvedValue(votesResponse);
  (TrialsStore as any).load = jest.fn().mockRejectedValue(error);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.failedToLoadTrialsCache,

    () => {
      (TrialsStore as any).load = jest.fn().mockResolvedValue(trialsResponse);

      store.refetchTrialsCache();
    }
  );

  when(
    () => store.cacheReady,
    () => {
      done();
    }
  );
});

test("Loading Votes failure", done => {
  (VotesStore as any).load = jest.fn().mockRejectedValue(error);
  (TrialsStore as any).load = jest.fn().mockResolvedValue(trialsResponse);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.failedToLoadVotesCache,

    () => {
      expect(store.cacheReady).toBeFalsy();
      expect(store.fetchingVotesCache).toBeFalsy();
      expect(store.findVoteByTrialId(trialId)).toBeNull();

      done();
    }
  );
});

test("Loading Votes failure and retry", done => {
  (VotesStore as any).load = jest.fn().mockRejectedValue(error);
  (TrialsStore as any).load = jest.fn().mockResolvedValue(trialsResponse);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.failedToLoadVotesCache,

    () => {
      (VotesStore as any).load = jest.fn().mockResolvedValue(votesResponse);

      store.refetchVotesCache();
    }
  );

  when(
    () => store.cacheReady,
    () => {
      done();
    }
  );
});

test("Loading failure", done => {
  (VotesStore as any).load = jest.fn().mockRejectedValue(error);
  (TrialsStore as any).load = jest.fn().mockRejectedValue(error);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.failedToLoadTrialsCache && store.failedToLoadVotesCache,

    () => {
      expect(store.cacheReady).toBeFalsy();
      expect(store.fetchingTrialsCache).toBeFalsy();
      expect(store.fetchingVotesCache).toBeFalsy();
      expect(store.votedInTrial(trialId)).toBeFalsy();

      done();
    }
  );
});

test("Loading failure and retry", done => {
  (VotesStore as any).load = jest.fn().mockRejectedValue(error);
  (TrialsStore as any).load = jest.fn().mockRejectedValue(error);

  const authStore = new AuthStore();
  const trialsStore = new TrialsStore();
  const votesStore = new VotesStore(authStore);

  const store = new HomeViewStore(authStore, trialsStore, votesStore);

  store.fetchCache();

  when(
    () => store.failedToLoadTrialsCache && store.failedToLoadVotesCache,

    () => {
      (VotesStore as any).load = jest.fn().mockResolvedValue(votesResponse);
      (TrialsStore as any).load = jest.fn().mockResolvedValue(trialsResponse);

      store.refetchVotesCache();
      store.refetchTrialsCache();
    }
  );

  when(
    () => store.cacheReady,

    () => {
      done();
    }
  );
});
