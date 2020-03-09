import React, { useContext, useMemo } from "react";
import { when } from "mobx";
import { observer } from "mobx-react-lite";
import { Machine, StateSchema } from "xstate";
import { useMachine } from "@xstate/react";

import "./Home.css";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { HomeViewStoreContext } from "../../contexts";
import { DailyTrial } from "./DailyTrial";
import { CallToAction } from "./CallToAction";
import { VotingSection } from "./VotingSection";
import { HomeViewStore } from "../../view-stores";
import { SafeAreaView, Progress } from "../../components";

interface MachineStates extends StateSchema {
  states: {
    waitingCache: {};
    idle: {};
    failedToLoadCache: {};
  };
}

type MachineEvent =
  | { type: "READY" }
  | { type: "CACHE_FAILURE" }
  | { type: "REFETCH_CACHE" };

export const createMachine = (store: HomeViewStore) => {
  return Machine<{}, MachineStates, MachineEvent>(
    {
      id: "Home",
      initial: "waitingCache",
      states: {
        waitingCache: {
          entry: ["fetchCache"],
          on: {
            READY: "idle",
            CACHE_FAILURE: "failedToLoadCache"
          },
          invoke: {
            id: "subscribeToCache",
            src: () => callback => {
              const readyDisposer = when(
                () => store.cacheReady,
                () => callback("READY")
              );

              const notReadyDisposer = when(
                () =>
                  store.failedToLoadVotesCache || store.failedToLoadVotesCache,
                () => callback("CACHE_FAILURE")
              );

              return () => {
                readyDisposer();
                notReadyDisposer();
              };
            }
          }
        },
        idle: {
          invoke: {
            id: "subscribeToCache",
            src: () => callback => {
              const notReadyDisposer = when(
                () =>
                  store.failedToLoadVotesCache || store.failedToLoadVotesCache,
                () => callback("CACHE_FAILURE")
              );

              return () => notReadyDisposer();
            }
          }
        },
        failedToLoadCache: {
          on: {
            REFETCH_CACHE: {
              actions: ["refetchCache"]
            },
            READY: "idle"
          },
          invoke: {
            id: "subscribeToCache",
            src: () => callback => {
              const readyDisposer = when(
                () => store.cacheReady,
                () => callback("READY")
              );

              return () => readyDisposer();
            }
          }
        }
      }
    },
    {
      actions: {
        fetchCache: () => {
          store.fetchCache();
        },
        refetchCache: () => {
          if (store.failedToLoadTrialsCache) {
            store.refetchTrialsCache();
          }

          if (store.failedToLoadVotesCache) {
            store.refetchVotesCache();
          }
        }
      }
    }
  );
};

interface WaitingCacheProps {}

const WaitingCache: React.FC<WaitingCacheProps> = () => {
  return (
    <main data-state="loading" className="Home Home--animate">
      <Progress variant="page-level" />
    </main>
  );
};

interface FailedToLoadCacheProps {
  onRefetchCache: VoidFunction;
}

const FailedToLoadCacheProps: React.FC<FailedToLoadCacheProps> = props => {
  const { onRefetchCache } = props;

  return (
    <main data-state="failure" className="Home Home--animate">
      <div>
        <h1 className="Home__error-message">
          An error prevented us from loading this page
        </h1>

        <div className="Home_error-button-container">
          <button onClick={onRefetchCache}>
            <span>Try again</span>
          </button>
        </div>
      </div>
    </main>
  );
};

interface ReadyProps {}

const Ready: React.FC<ReadyProps> = () => {
  return (
    <main className="Home Home--animate">
      <Header />

      <SafeAreaView>
        <DailyTrial />
        <CallToAction />
        <VotingSection />
        <Footer />
      </SafeAreaView>
    </main>
  );
};

export const Home: React.FC = observer(() => {
  const store = useContext(HomeViewStoreContext);

  const machine = useMemo(() => {
    return createMachine(store);
  }, [store]);
  const [current, send] = useMachine(machine);

  if (current.matches("waitingCache")) {
    return <WaitingCache />;
  } else if (current.matches("failedToLoadCache")) {
    return (
      <FailedToLoadCacheProps
        onRefetchCache={() => send({ type: "REFETCH_CACHE" })}
      />
    );
  } else {
    return <Ready />;
  }
});
