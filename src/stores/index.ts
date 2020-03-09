import { AuthStore } from "./auth.store";
import { VotesStore } from "./votes.store";
import { TrialsStore } from "./trials.store";

export { AuthStore };
export { VotesStore };
export { TrialsStore };

export const authStore = new AuthStore();
export const trialsStore = new TrialsStore();
export const votesStore = new VotesStore(authStore);
