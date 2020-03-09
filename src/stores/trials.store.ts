import { computed, observable } from "mobx";
import { interpret, assign, State, createMachine } from "xstate";
import isUndefined from "lodash.isundefined";

import { Nullable, IServerTrial } from "../types";
import { json } from "../utils";
import { Trial } from "../models";

interface MachineContext {
  data: Nullable<Array<Trial>>;
}

interface FetchedDataEvent {
  type: string;
  data: Array<Trial>;
}

type MachineEvent = { type: "FETCH" } | { type: "RETRY" };

type MachineState =
  | {
      value: "initial";
      context: {
        data: null;
      };
    }
  | {
      value: "fetching";
      context: {
        data: null;
      };
    }
  | {
      value: "success";
      context: {
        data: Array<Trial>;
      };
    }
  | {
      value: "failure";
      context: {
        data: null;
      };
    };

export class TrialsStore {
  @observable private current: State<MachineContext, MachineEvent, any>;

  private service = interpret(
    createMachine<MachineContext, MachineEvent, MachineState>(
      {
        id: "Trials Cache Machine",
        initial: "initial",
        context: {
          data: null
        },
        states: {
          initial: {
            on: {
              FETCH: "fetching"
            }
          },
          fetching: {
            invoke: {
              id: "fetchTodayTrials",
              src: "fetchTodayTrials",
              onDone: {
                target: "success",
                actions: ["saveData"]
              },
              onError: "failure"
            }
          },
          success: {
            on: {
              FETCH: "fetching"
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
          fetchTodayTrials: async () => {
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

  private static async load(): Promise<Array<IServerTrial>> {
    return await json<Array<IServerTrial>>("http://localhost:3000/trials");
  }

  private async doFetch(): Promise<Array<Trial>> {
    const response = await TrialsStore.load();

    return response.map(trial => new Trial(trial));
  }

  public fetch(): void {
    this.service.send({ type: "FETCH" });
  }

  public refetch(): void {
    this.service.send({ type: "RETRY" });
  }

  @computed
  public get cache(): Nullable<Array<Trial>> {
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

    return this.current.matches("fetching") || this.current.matches("initial");
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
