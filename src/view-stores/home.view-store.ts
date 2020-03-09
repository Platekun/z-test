import { Trial, Vote } from "../models";
import { TrialsStore, VotesStore, AuthStore } from "../stores";
import { computed } from "mobx";
import isNull from "lodash.isnull";

import { Id, Nullable } from "../types";
import { isUndefined } from "util";

export class HomeViewStore {
  constructor(
    private readonly authStore: AuthStore,
    private readonly trialsStore: TrialsStore,
    private readonly votesStore: VotesStore
  ) {}

  @computed get userId() {
    return this.authStore.user.id;
  }

  public fetchCache(): void {
    this.trialsStore.fetch();
    this.votesStore.fetch();
  }

  @computed get cacheReady(): boolean {
    return this.votesStore.fetched && this.trialsStore.fetched;
  }

  @computed get fetchingTrialsCache(): boolean {
    return this.trialsStore.fetching;
  }

  @computed public get failedToLoadTrialsCache(): boolean {
    return this.trialsStore.failure;
  }

  public refetchTrialsCache(): void {
    this.trialsStore.refetch();
  }

  @computed get fetchingVotesCache(): boolean {
    return this.votesStore.fetching;
  }

  @computed public get failedToLoadVotesCache(): boolean {
    return this.votesStore.failure;
  }

  public refreshVotesCache(): void {
    this.votesStore.refresh();
  }

  public refetchVotesCache(): void {
    this.votesStore.refetch();
  }

  @computed
  public get dailyTrial(): Nullable<Trial> {
    const trialsCache = this.trialsStore.cache;

    if (isNull(trialsCache)) {
      return null;
    }

    const [dailyTrial] = trialsCache;

    return dailyTrial;
  }

  @computed
  public get pastTrials(): Nullable<Array<Trial>> {
    const trialsCache = this.trialsStore.cache;

    if (isNull(trialsCache)) {
      return null;
    }

    const [, ...pastTrials] = trialsCache;

    return pastTrials;
  }

  public findVoteByTrialId(trialId: Id): Nullable<Vote> {
    const votesCache = this.votesStore.cache;

    if (isNull(votesCache)) {
      return null;
    }

    const vote = votesCache.find(vote => vote.trialId === trialId);

    return isUndefined(vote) ? null : vote;
  }

  public votedInTrial(trialId: Id): boolean {
    const vote = this.findVoteByTrialId(trialId);

    return !isNull(vote);
  }
}
