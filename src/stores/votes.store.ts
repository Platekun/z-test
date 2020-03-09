import { computed, observable } from "mobx";
import { interpret, assign, State, createMachine } from "xstate";
import isUndefined from "lodash.isundefined";

import { Nullable, Id, IVoteType, IServerVote } from "../types";
import { AuthStore } from "./auth.store";
import { Vote } from "../models";
import { json } from "../utils";

interface MachineContext {
  data: Nullable<Array<Vote>>;
}

interface FetchedDataEvent {
  type: string;
  data: Array<Vote>;
}

type VoteEvent = {
  type: "VOTE";
  voteId: Id;
  voteType: IVoteType;
};

type MachineEvent =
  | VoteEvent
  | {
      type: "FETCH";
    }
  | {
      type: "FETCH_ON_BACKGROUND";
    }
  | {
      type: "RETRY";
    };

type MachineState =
  | {
      value: "fetching";
      context: {
        data: null;
      };
    }
  | {
      value: "success";
      context: {
        data: Array<Vote>;
      };
    }
  | {
      value: "failure";
      context: {
        data: null;
      };
    };

export class VotesStore {
  constructor(private readonly authStore: AuthStore) {}

  @observable private current: State<
    MachineContext,
    MachineEvent,
    any,
    MachineState
  >;

  private service = interpret(
    createMachine<MachineContext, MachineEvent, MachineState>(
      {
        id: "Votes Cache Machine",
        initial: "fetching",
        context: {
          data: null
        },
        states: {
          fetching: {
            invoke: {
              id: "fetchUserVotes",
              src: "fetchUserVotes",
              onDone: {
                target: "success",
                actions: ["saveData"]
              },
              onError: "failure"
            }
          },
          /**
           * TODO: I could move this to an actor too but for the time being it is "OK" I guess
           */
          fetchingOnBackground: {
            invoke: {
              id: "fetchUserVotes",
              src: "fetchUserVotes",
              onDone: {
                target: "success",
                actions: ["saveData"]
              },
              onError: "failure"
            }
          },
          success: {
            on: {
              FETCH: "fetching",
              FETCH_ON_BACKGROUND: "fetchingOnBackground"
            }
          },
          failure: {
            on: {
              RETRY: "fetching"
            }
          }
        }
      },
      {
        actions: {
          saveData: assign<MachineContext, MachineEvent>({
            data: (_: MachineContext, e: MachineEvent) => {
              const { data } = e as FetchedDataEvent;

              return data;
            }
          })
        },
        services: {
          fetchUserVotes: async () => {
            return await this.doFetch();
          }
        }
      }
    )
  )
    .onTransition(
      (current: State<MachineContext, MachineEvent, any, MachineState>) => {
        this.current = current;
      }
    )
    .start();

  private async doFetch() {
    const userId = this.authStore.user.id;
    const response = await VotesStore.load(userId);

    return response.map(trial => new Vote(trial));
  }

  private static async load(userId: string): Promise<Array<IServerVote>> {
    return json<Array<IServerVote>>(`http://localhost:3000/votes`, {
      method: "POST",
      body: JSON.stringify({
        userId
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  public fetch(): void {
    this.service.send({ type: "FETCH" });
  }

  public refresh(): void {
    this.service.send({ type: "FETCH_ON_BACKGROUND" });
  }

  public refetch(): void {
    this.service.send({ type: "RETRY" });
  }

  @computed
  public get cache(): Nullable<Array<Vote>> {
    if (isUndefined(this.current)) {
      return null;
    }

    return this.current.context.data;
  }

  @computed
  public get fetching(): boolean {
    if (isUndefined(this.current)) {
      return false;
    }

    return this.current.matches("fetching");
  }

  @computed
  public get fetched(): boolean {
    if (isUndefined(this.current)) {
      return false;
    }

    return this.current.matches("success");
  }

  @computed
  public get failure(): boolean {
    if (isUndefined(this.current)) {
      return false;
    }

    return this.current.matches("failure");
  }
}
