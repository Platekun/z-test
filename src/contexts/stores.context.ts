import { createContext } from "react";

import { authStore, trialsStore, votesStore } from "../stores";
import { HomeViewStore } from "../view-stores";

export const AuthStoreContext = createContext(authStore);
export const TrialsStoreContext = createContext(trialsStore);
export const VotesStoreContext = createContext(votesStore);

export const HomeViewStoreContext = createContext(
  new HomeViewStore(authStore, trialsStore, votesStore)
);
