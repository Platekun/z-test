import React, { useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { StateSchema, Machine, assign, State } from "xstate";
import { useMachine } from "@xstate/react";
import isNull from "lodash.isnull";

import "./DailyTrial.css";
import { Nullable, IVoteType } from "../../types";
import { formatFutureDate } from "../../utils";
import {
  ExternalLink,
  Wrapper,
  UpvoteIcon,
  DownvoteIcon,
  Progress
} from "../../components";
import { HomeViewStoreContext } from "../../contexts";
import { Trial } from "../../models";
import { HomeViewStore } from "../../view-stores";
import { getDaysInMonth } from "date-fns";

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
      type: "RETRY";
    };

const createMachine = (store: HomeViewStore, trial: Trial) => {
  const hasVotedAlready = store.votedInTrial(trial.id);

  const initial = hasVotedAlready ? "thankYou" : "prompt";

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
              target: "savingVote",
              actions: ["setVote"]
            }
          }
        },
        savingVote: {
          invoke: {
            id: "saveVote",
            src: "saveVote",
            onDone: {
              target: "thankYou",
              actions: "clearSelection"
            },
            onError: {
              target: "failedToSaveVote"
            }
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

type DailyTrialState = State<MachineContext, MachineEvent>;

interface CommonProps {
  current: DailyTrialState;
  trial: Trial;
  articleBody: JSX.Element;
  closingIn: JSX.Element;
}

interface PromptProps extends CommonProps {
  closingIn: JSX.Element;
  onUpvote: VoidFunction;
  onDownvote: VoidFunction;
}

const Prompt: React.FC<PromptProps> = props => {
  const {
    current,
    trial,
    articleBody,
    closingIn,
    onUpvote,
    onDownvote
  } = props;

  return (
    <section
      data-state={current.value}
      className="DailyTrial"
      style={{ backgroundImage: `url(${trial.personPhoto})` }}
    >
      <h2 className="visually-hidden">Hero Section</h2>

      <Wrapper>
        <article className="DailyTrial__trial">
          <div className="DailyTrial__content-container">
            <div className="DailyTrial__content">
              <Wrapper className="DailyTrial__article-body-wrapper blurred">
                {articleBody}

                <p className="DailyTrial__verdict">What's Your Verdict?</p>
              </Wrapper>
            </div>
            <footer className="DailyTrial__footer">
              <div className="DailyTrial__voting-bar">
                <button
                  onClick={onUpvote}
                  className="DailyTrial__voting-button"
                  data-testid="[daily-trial] upvote-button"
                >
                  <span className="visually-hidden">Upvote</span>
                  <UpvoteIcon />
                </button>

                <button
                  onClick={onDownvote}
                  className="DailyTrial__voting-button"
                  data-testid="[daily-trial] downvote-button"
                >
                  <span className="visually-hidden">Downvote</span>
                  <DownvoteIcon />
                </button>
              </div>
            </footer>
          </div>
        </article>
      </Wrapper>

      {closingIn}
    </section>
  );
};

interface SavingVoteProps extends CommonProps {}

const SavingVote: React.FC<SavingVoteProps> = props => {
  const { current, trial, articleBody, closingIn } = props;

  return (
    <section
      data-state={current.value}
      className="DailyTrial"
      style={{ backgroundImage: `url(${trial.personPhoto})` }}
    >
      <h2 className="visually-hidden">Hero Section</h2>

      <Wrapper>
        <article className="DailyTrial__trial">
          <Progress />

          <div className="DailyTrial__content blurred">
            <Wrapper className="DailyTrial__article-body-wrapper">
              {articleBody}

              <p className="DailyTrial__verdict">What's Your Verdict?</p>
            </Wrapper>

            <footer className="DailyTrial__footer">
              <div className="DailyTrial__voting-bar">
                <button disabled className="DailyTrial__voting-button">
                  <span className="visually-hidden">Upvote</span>
                  <UpvoteIcon />
                </button>

                <button disabled className="DailyTrial__voting-button">
                  <span className="visually-hidden">Downvote</span>
                  <DownvoteIcon />
                </button>
              </div>
            </footer>
          </div>
        </article>
      </Wrapper>

      {closingIn}
    </section>
  );
};

interface FailedToSaveVoteProps extends CommonProps {
  onRetry: VoidFunction;
}

const FailedToSaveVote: React.FC<FailedToSaveVoteProps> = props => {
  const { current, trial, articleBody, closingIn, onRetry } = props;

  return (
    <section
      data-state={current.value}
      className="DailyTrial"
      style={{ backgroundImage: `url(${trial.personPhoto})` }}
    >
      <h2 className="visually-hidden">Hero Section</h2>

      <Wrapper>
        <article className="DailyTrial__trial">
          <div className="DailyTrial__content blurred">
            <Wrapper className="DailyTrial__article-body-wrapper">
              {articleBody}

              <p className="DailyTrial__verdict">What's Your Verdict?</p>

              <footer className="DailyTrial__footer">
                <button
                  onClick={onRetry}
                  className="DailyTrial__vote-again-button"
                  data-testid="[daily-trial] try-again-button"
                >
                  <span>Oops. Try again</span>
                </button>
              </footer>
            </Wrapper>
          </div>
        </article>
      </Wrapper>

      {closingIn}
    </section>
  );
};

interface ThankYouProps extends CommonProps {
  onVoteAgain: VoidFunction;
}

const ThankYou: React.FC<ThankYouProps> = props => {
  const { current, trial, articleBody, closingIn, onVoteAgain } = props;

  return (
    <section
      data-state={current.value}
      className="DailyTrial"
      style={{ backgroundImage: `url(${trial.personPhoto})` }}
    >
      <h2 className="visually-hidden">Hero Section</h2>

      <Wrapper>
        <article className="DailyTrial__trial">
          <div className="DailyTrial__content blurred">
            <Wrapper>
              {articleBody}

              <p
                className="DailyTrial__verdict"
                data-testid="[daily-trial] thank-you-message"
              >
                Thank you for voting!
              </p>

              <footer className="DailyTrial__footer">
                <button
                  onClick={onVoteAgain}
                  className="DailyTrial__vote-again-button"
                  data-testid="[daily-trial] vote-again-button"
                >
                  <span>Vote again</span>
                </button>
              </footer>
            </Wrapper>
          </div>
        </article>
      </Wrapper>

      {closingIn}
    </section>
  );
};

export const DailyTrial: React.FC = observer(() => {
  const store = useContext(HomeViewStoreContext);
  const trial = store.dailyTrial;

  if (isNull(trial)) {
    throw new Error("DailyTrial needs a trial object");
  }

  const machine = useMemo(() => {
    return createMachine(store, trial);
  }, [store, trial]);
  const [current, send] = useMachine(machine);

  const articleBody = (
    <>
      <h3 className="DailyTrial__title">
        <span className="DailyTrial__title--faded">What's your opinion on</span>{" "}
        <br />
        <span className="DailyTrial__person-name">{trial.personName}?</span>
      </h3>

      <p className="DailyTrial__topic">{trial.topic}</p>

      <p className="DailyTrial__more-info">
        <ExternalLink href={trial.topicURL}>More Information</ExternalLink>
      </p>
    </>
  );

  const daysInMonth = getDaysInMonth(new Date());
  const daysFromNow = formatFutureDate(trial.endDate);
  const percentagePassed = (daysFromNow * 100) / daysInMonth;
  const percentageLeft = 100 - percentagePassed;

  const closingIn = (
    <div className="DailyTrial__closing-in">
      <div
        className="DailyTrial__time-passed"
        style={{ width: `${percentageLeft}%` }}
      >
        <p>Closing In</p>
      </div>

      <div className="DailyTrial__time-left">
        <p>
          {daysFromNow}
          &nbsp;
          <span>days</span>
        </p>
      </div>
    </div>
  );

  if (current.matches("prompt")) {
    return (
      <Prompt
        current={current}
        trial={trial}
        articleBody={articleBody}
        closingIn={closingIn}
        onUpvote={() => send({ type: "VOTE", voteType: "upvote" })}
        onDownvote={() => send({ type: "VOTE", voteType: "downvote" })}
      />
    );
  } else if (current.matches("savingVote")) {
    return (
      <SavingVote
        current={current}
        trial={trial}
        articleBody={articleBody}
        closingIn={closingIn}
      />
    );
  } else if (current.matches("failedToSaveVote")) {
    return (
      <FailedToSaveVote
        current={current}
        trial={trial}
        articleBody={articleBody}
        closingIn={closingIn}
        onRetry={() => send({ type: "RETRY" })}
      />
    );
  } else if (current.matches("thankYou")) {
    return (
      <ThankYou
        current={current}
        trial={trial}
        articleBody={articleBody}
        closingIn={closingIn}
        onVoteAgain={() => send({ type: "VOTE_AGAIN" })}
      />
    );
  } else {
    return null;
  }
});
