import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import isNull from "lodash.isnull";

import "./VotingSection.css";
import { Wrapper } from "../../components";
import { HomeViewStoreContext } from "../../contexts";
import { TrialCard } from "./TrialCard";

export const VotingSection: React.FC = observer(() => {
  const store = useContext(HomeViewStoreContext);

  const trials = store.pastTrials;

  if (isNull(trials)) {
    throw new Error("VotingSection needs an array of trial objects");
  }

  return (
    <section className="VotingSection">
      <Wrapper>
        <header>
          <h2 className="VotingSection__title">Previous Rulings</h2>
        </header>

        <ul className="VotingSection__trials">
          {trials.map(trial => (
            <li key={trial.key}>
              <TrialCard trial={trial} />
            </li>
          ))}
        </ul>

        <footer className="VotingSection__footer">
          <div className="VotingSection__footer-content">
            <p className="VotingSection__footer-message">
              Is there anyone else you would want us to add?
            </p>

            <button className="VotingSection__footer-button">
              <span>Submit a name</span>
            </button>
          </div>
        </footer>
      </Wrapper>
    </section>
  );
});
