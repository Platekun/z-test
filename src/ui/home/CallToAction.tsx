import React from "react";

import "./CallToAction.css";
import { Wrapper, CloseIcon } from "../../components";

export const CallToAction = () => {
  const [open, setOpen] = React.useState(true);

  if (!open) {
    return null;
  }

  return (
    <article className="CallToAction">
      <Wrapper>
        <div className="CallToAction__content">
          <Wrapper className="CallToAction__content-wrapper">
            <h2 className="CallToAction__title">
              <span>Speak out. Be heard.</span>
              <br />
              <strong>Be counted</strong>
            </h2>

            <p className="CallToAction__message">
              Rule of thumb is a crowd sourced court of public opinion where
              anyone and everyone can speak out and speak freely. It's easy: You
              share your opinion, we analyze and put the data in a public
              report.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="CallToAction__button"
            >
              <span className="visually-hidden">Close</span>
              <CloseIcon />
            </button>
          </Wrapper>
        </div>
      </Wrapper>
    </article>
  );
};
