import React, { useMemo, useContext } from "react";
import { observer } from "mobx-react-lite";
import { useMachine } from "@xstate/react";
import { Machine, assign, StateSchema } from "xstate";
// @ts-ignore
import ClickOutHandler from "react-onclickout";
import isNull from "lodash.isnull";

import "./TrialCard.css";
import { IVoteType, Nullable } from "../../types";
import { formatPastDate } from "../../utils";
import { Trial } from "../../models";
import { UpvoteIcon, DownvoteIcon, Progress } from "../../components";
import { HomeViewStoreContext } from "../../contexts";
import { HomeViewStore } from "../../view-stores";

interface VotingCardProps {
  trial: Trial;
}

interface MachineContext {
  trial: Trial;
  voteType: Nullable<IVoteType>;
}

interface MachineStates extends StateSchema {
  states: {
    prompt: {};
    savingVote: {};
    failedToSaveVote: {};
    thankYou: {};
  };
}

interface SelectedEvent {
  type: "VOTE";
  voteType: IVoteType;
}

type MachineEvent =
  | {
      type: "VOTE_AGAIN";
    }
  | SelectedEvent
  | {
      type: "SUBMIT";
    }
  | {
      type: "RETRY";
    }
  | {
      type: "CANCEL";
    };

export const createMachine = (store: HomeViewStore, trial: Trial) => {
  const hasVotedAlready = () => store.votedInTrial(trial.id);

  const initial = hasVotedAlready() ? "thankYou" : "prompt";

  return Machine<MachineContext, MachineStates, MachineEvent>(
    {
      id: "TrialCard",
      initial,
      context: {
        trial,
        voteType: null
      },
      states: {
        prompt: {
          on: {
            VOTE: {
              actions: ["setVote"]
            },
            SUBMIT: {
              target: "savingVote",
              cond: "hasVote"
            },
            CANCEL: [
              {
                target: "thankYou",
                actions: ["clearSelection"],
                cond: "hasVotedAlready"
              },
              {
                actions: ["clearSelection"]
              }
            ]
          }
        },
        savingVote: {
          invoke: {
            id: "saveVote",
            src: "saveVote",
            onDone: {
              target: "thankYou",
              actions: ["clearSelection"]
            },
            onError: "failedToSaveVote"
          }
        },
        failedToSaveVote: {
          on: {
            RETRY: "savingVote"
          }
        },
        thankYou: {
          on: {
            VOTE_AGAIN: "prompt"
          }
        }
      }
    },
    {
      actions: {
        setVote: assign<MachineContext, MachineEvent>({
          voteType: (_, e) => (e as SelectedEvent).voteType
        }),
        clearSelection: assign<MachineContext, MachineEvent>({
          voteType: null
        })
      },
      guards: {
        hasVote: ctx => !isNull(ctx.voteType),
        hasVotedAlready
      },
      services: {
        saveVote: async (ctx: MachineContext) => {
          await trial.save({
            userId: store.userId,
            voteType: ctx.voteType as IVoteType,
            vote: store.findVoteByTrialId(trial.id)
          });

          store.refreshVotesCache();
        }
      }
    }
  );
};

interface CommonProps {
  header: JSX.Element;
  upvotesVsDownvotes: JSX.Element;
  trial: Trial;
}

interface PromptProps extends CommonProps {
  voteType: Nullable<IVoteType>;
  onCancel: VoidFunction;
  canSubmit: boolean;
  onUpvote: VoidFunction;
  onDownvote: VoidFunction;
  onSubmit: VoidFunction;
}

const Prompt: React.FC<PromptProps> = props => {
  const {
    header,
    upvotesVsDownvotes,
    canSubmit,
    voteType,
    trial,
    onCancel,
    onUpvote,
    onDownvote,
    onSubmit
  } = props;

  return (
    <ClickOutHandler onClickOut={onCancel}>
      <div className="TrialCard">
        <div
          className="TrialCard__content"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.61) 0%, rgba(0, 0, 0, 0.61) 37%, rgba(0, 0, 0, 0) 74%, rgba(0, 0, 0, 0) 100%), url(${trial.personPhoto})`
          }}
        >
          {header}

          <p className="TrialCard__topic">{trial.topic}</p>

          <footer className="TrialCard__footer">
            <div className="TrialCard__voting-controls">
              <button
                onClick={onUpvote}
                className="TrialCard__voting-control TrialCard__voting-upvote-control"
                data-selected={voteType === "upvote"}
                data-testid={`[trial-card] ${trial.id} upvote-button`}
              >
                <span className="visually-hidden">Upvote</span>
                <UpvoteIcon />
              </button>

              <button
                onClick={onDownvote}
                className="TrialCard__voting-control TrialCard__voting-downvote-control"
                data-selected={voteType === "downvote"}
                data-testid={`[trial-card] ${trial.id} downvote-button`}
              >
                <span className="visually-hidden">Downvote</span>
                <DownvoteIcon />
              </button>

              <button
                onClick={onSubmit}
                disabled={canSubmit}
                className="TrialCard__voting-submit-control"
                data-vote={voteType}
                data-testid={`[trial-card] ${trial.id} submit-button`}
              >
                <span>Vote Now</span>
              </button>
            </div>
          </footer>
        </div>

        {upvotesVsDownvotes}
      </div>
    </ClickOutHandler>
  );
};

interface SavingVoteProps extends CommonProps {
  voteType: Nullable<IVoteType>;
}

const SavingVote: React.FC<SavingVoteProps> = props => {
  const { header, upvotesVsDownvotes, trial, voteType } = props;

  return (
    <div className="TrialCard">
      <Progress />

      <div
        className="TrialCard__content"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.61) 0%, rgba(0, 0, 0, 0.61) 37%, rgba(0, 0, 0, 0) 74%, rgba(0, 0, 0, 0) 100%), url(${trial.personPhoto})`
        }}
      >
        {header}

        <p className="TrialCard__topic">{trial.topic}</p>

        <footer className="TrialCard__footer">
          <div className="TrialCard__voting-controls">
            <button
              className="TrialCard__voting-control TrialCard__voting-upvote-control"
              data-selected={voteType === "upvote"}
            >
              <span className="visually-hidden">Upvote</span>
              <UpvoteIcon />
            </button>

            <button
              className="TrialCard__voting-control TrialCard__voting-downvote-control"
              data-selected={voteType === "downvote"}
            >
              <span className="visually-hidden">Downvote</span>
              <DownvoteIcon />
            </button>

            <button
              disabled
              className="TrialCard__voting-submit-control"
              data-vote={voteType}
            >
              <span>Vote Now</span>
            </button>
          </div>
        </footer>
      </div>

      {upvotesVsDownvotes}
    </div>
  );
};

interface FailedToSaveVoteProps extends CommonProps {
  onRetry: VoidFunction;
}

const FailedToSaveVote: React.FC<FailedToSaveVoteProps> = props => {
  const { header, upvotesVsDownvotes, trial, onRetry } = props;

  return (
    <div className="TrialCard">
      <div
        className="TrialCard__content"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.61) 0%, rgba(0, 0, 0, 0.61) 37%, rgba(0, 0, 0, 0) 74%, rgba(0, 0, 0, 0) 100%), url(${trial.personPhoto})`
        }}
      >
        {header}

        <p className="TrialCard__topic">{trial.topic}</p>

        <footer className="TrialCard__footer">
          <button
            onClick={onRetry}
            className="TrialCard__vote-again-button"
            data-testid={`[trial-card] ${trial.id} try-again-button`}
          >
            Oops! Try again
          </button>
        </footer>
      </div>

      {upvotesVsDownvotes}
    </div>
  );
};

interface ThankYouProps extends CommonProps {
  onVoteAgain: VoidFunction;
}

const ThankYou: React.FC<ThankYouProps> = props => {
  const { header, upvotesVsDownvotes, trial, onVoteAgain } = props;

  return (
    <div className="TrialCard">
      <div
        className="TrialCard__content"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.61) 0%, rgba(0, 0, 0, 0.61) 37%, rgba(0, 0, 0, 0) 74%, rgba(0, 0, 0, 0) 100%), url(${trial.personPhoto})`
        }}
      >
        {header}

        <p
          className="TrialCard__thank-you-message"
          data-testid={`[trial-card] ${trial.id} thank-you-message`}
        >
          Thank you for voting!
        </p>

        <footer className="TrialCard__footer">
          <button
            onClick={onVoteAgain}
            className="TrialCard__vote-again-button"
            data-testid={`[trial-card] ${trial.id} vote-again-button`}
          >
            Vote again
          </button>
        </footer>
      </div>

      {upvotesVsDownvotes}
    </div>
  );
};

export const TrialCard: React.FC<VotingCardProps> = observer(props => {
  const { trial } = props;
  const store = useContext(HomeViewStoreContext);

  const machine = useMemo(() => {
    return createMachine(store, trial);
  }, [store, trial]);
  const [current, send] = useMachine(machine);
  const { voteType } = current.context;

  const canSubmit = isNull(voteType);

  const totalOfVotes = trial.upvotes + trial.downvotes;
  const upvotesPercentage = Math.round((trial.upvotes / totalOfVotes) * 100);
  const downvotesPercentage = 100 - upvotesPercentage;

  const header = (
    <header className="TrialCard__header">
      {trial.liked && (
        <div className="TrialCard__upvoted">
          <UpvoteIcon />
        </div>
      )}

      {trial.disliked && (
        <div className="TrialCard__downvoted">
          <DownvoteIcon />
        </div>
      )}

      <h3 className="TrialCard__title">{trial.personName}</h3>

      <p className="TrialCard__category">
        <span>{formatPastDate(trial.createdAt)}</span> ago in {trial.category}
      </p>
    </header>
  );

  const upvotesVsDownvotes = (
    <div className="TrialCard__voting-bar">
      <div
        className="TrialCard__voting-bar-upvotes"
        style={{ width: `${trial.upvotes}%` }}
      >
        <span className="TrialCard__voting-bar-vote-icon-container">
          <UpvoteIcon />
        </span>

        <p
          className="TrialCard__vote-count"
          data-testid={`[trial-card] ${trial.id} upvote-count`}
        >
          {upvotesPercentage}%
        </p>
      </div>

      <div
        className="TrialCard__voting-bar-downvotes"
        style={{ width: `${trial.downvotes}%` }}
      >
        <span className="TrialCard__voting-bar-vote-icon-container">
          <DownvoteIcon />
        </span>

        <p
          className="TrialCard__vote-count"
          data-testid={`[trial-card] ${trial.id} downvote-count`}
        >
          {downvotesPercentage}%
        </p>
      </div>
    </div>
  );

  if (current.matches("prompt")) {
    return (
      <Prompt
        header={header}
        upvotesVsDownvotes={upvotesVsDownvotes}
        voteType={voteType}
        trial={trial}
        onCancel={() => send({ type: "CANCEL" })}
        onUpvote={() => send({ type: "VOTE", voteType: "upvote" })}
        onDownvote={() => send({ type: "VOTE", voteType: "downvote" })}
        canSubmit={canSubmit}
        onSubmit={() => send({ type: "SUBMIT" })}
      />
    );
  } else if (current.matches("savingVote")) {
    return (
      <SavingVote
        header={header}
        upvotesVsDownvotes={upvotesVsDownvotes}
        voteType={voteType}
        trial={trial}
      />
    );
  } else if (current.matches("failedToSaveVote")) {
    return (
      <FailedToSaveVote
        header={header}
        upvotesVsDownvotes={upvotesVsDownvotes}
        trial={trial}
        onRetry={() => send({ type: "RETRY" })}
      />
    );
  } else if (current.matches("thankYou")) {
    return (
      <ThankYou
        header={header}
        upvotesVsDownvotes={upvotesVsDownvotes}
        trial={trial}
        onVoteAgain={() => send({ type: "VOTE_AGAIN" })}
      />
    );
  } else {
    return null;
  }
});
