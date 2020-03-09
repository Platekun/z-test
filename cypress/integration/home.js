/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

const makeSelector = prefix => s => `[${prefix}] ${s}`;
const dailyTrial = makeSelector("daily-trial");
const trialCard = makeSelector("trial-card");
const upvoteTrialCard = id => trialCard(`${id} upvote-button`);
const downvoteTrialCard = id => trialCard(`${id} downvote-button`);
const submitTrialCard = id => trialCard(`${id} submit-button`);
const thankYouMessageInTrialCard = id => trialCard(`${id} thank-you-message`);
const voteAgainTrialCard = id => trialCard(`${id} vote-again-button`);
const tryAgainTrialCard = id => trialCard(`${id} try-again-button`);
const upvoteCountInTrialCard = id => trialCard(`${id} upvote-count`);
const downCountInTrialCard = id => trialCard(`${id} down-count`);

const votes = [
  {
    id: "vote-1",
    userId: "john-doe-id",
    trialId: "trial-id",
    type: "downvote"
  }
];

const votesAlt = [
  {
    id: "vote-1",
    userId: "john-doe-id",
    trialId: "trial-id",
    type: "downvote"
  },
  {
    id: "vote-1",
    userId: "john-doe-id",
    trialId: "trial-id-2",
    type: "downvote"
  }
];

const trials = [
  {
    id: "trial-id",
    person: {
      id: "person-id",
      name: "John Doe",
      photo: "A person URL"
    },
    upvotes: 50,
    downvotes: 50,
    topic: "Loremp Ipsum",
    topicURL: "A topic URL",
    createdAt: "03/06/2020",
    endDate: "04/06/2020",
    category: "Religion"
  },
  {
    id: "trial-id-2",
    person: {
      id: "person-id-2",
      name: "John Doe 2",
      photo: "A person URL"
    },
    upvotes: 50,
    downvotes: 50,
    topic: "Loremp Ipsum",
    topicURL: "A topic URL",
    createdAt: "03/06/2020",
    endDate: "04/06/2020",
    category: "Politics"
  }
];

describe("Home Page", () => {
  it("shows failure state", () => {
    cy.server();

    cy.route({
      url: "http://localhost:3000/votes",
      method: "POST",
      response: [],
      status: 500
    });

    cy.route({
      url: "http://localhost:3000/trials",
      method: "GET",
      response: {},
      status: 500
    });

    cy.visit("http://localhost:8080", {
      onBeforeLoad(win) {
        delete win.fetch;
      }
    });

    cy.findByText(/error/i);
  });

  describe("Daily Trial", () => {
    it("upvotes", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: []
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[0].id}/vote`,
        method: "POST"
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(dailyTrial("upvote-button")).click();
      cy.findByTestId(dailyTrial("thank-you-message")).should(
        "include.text",
        "Thank you"
      );
    });

    it("downvotes", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: []
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[0].id}/vote`,
        method: "POST"
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(dailyTrial("upvote-button")).click();
      cy.findByTestId(dailyTrial("thank-you-message")).should(
        "include.text",
        "Thank you"
      );
    });

    it("can vote again", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: votes
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[0].id}/vote`,
        method: "POST",
        response: {}
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(dailyTrial("vote-again-button")).click();
      cy.findByTestId(dailyTrial("upvote-button")).click();
      cy.findByTestId(dailyTrial("thank-you-message")).should(
        "include.text",
        "Thank you"
      );
    });

    it("shows retry option if voting fails", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: []
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[0].id}/vote`,
        method: "POST",
        status: 500,
        response: {}
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(dailyTrial("upvote-button")).click();
      cy.findByTestId(dailyTrial("try-again-button"));
    });
  });

  describe("Previous Rulings", () => {
    it("upvotes", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: []
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[1].id}/vote`,
        method: "POST",
        response: {}
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(upvoteTrialCard(trials[1].id)).click();
      cy.findByTestId(submitTrialCard(trials[1].id)).click();
      cy.findByTestId(thankYouMessageInTrialCard(trials[1].id)).should(
        "include.text",
        "Thank you"
      );

      const totalOfVotes = trials[1].upvotes + 1 + trials[1].downvotes;
      const upvotesPercentage = Math.round(
        ((trials[1].upvotes + 1) / totalOfVotes) * 100
      );
      cy.findByTestId(upvoteCountInTrialCard(trials[1].id)).should(
        "include.text",
        upvotesPercentage
      );
    });

    it("downvotes", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: []
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[1].id}/vote`,
        method: "POST",
        response: {}
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(downvoteTrialCard(trials[1].id)).click();
      cy.findByTestId(submitTrialCard(trials[1].id)).click();
      cy.findByTestId(thankYouMessageInTrialCard(trials[1].id)).should(
        "include.text",
        "Thank you"
      );

      const totalOfVotes = trials[1].upvotes + (trials[1].downvotes + 1);
      const downvotesPercentage = Math.round(
        ((trials[1].downvotes + 1) / totalOfVotes) * 100
      );
      cy.findByTestId(upvoteCountInTrialCard(trials[1].id)).should(
        "include.text",
        downvotesPercentage
      );
    });

    it("can vote again", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: votesAlt
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[1].id}/vote`,
        method: "POST",
        response: {}
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(voteAgainTrialCard(trials[1].id)).click();
      cy.findByTestId(downvoteTrialCard(trials[1].id)).click();
      cy.findByTestId(submitTrialCard(trials[1].id)).click();
      cy.findByTestId(thankYouMessageInTrialCard(trials[1].id)).should(
        "include.text",
        "Thank you"
      );
    });

    it("shows retry option if voting fails", () => {
      cy.server();

      cy.route({
        url: "http://localhost:3000/votes",
        method: "POST",
        response: []
      });

      cy.route({
        url: "http://localhost:3000/trials",
        method: "GET",
        response: trials
      });

      cy.route({
        url: `http://localhost:3000/trials/${trials[1].id}/vote`,
        method: "POST",
        status: 500,
        response: {}
      });

      cy.visit("http://localhost:8080", {
        onBeforeLoad(win) {
          delete win.fetch;
        }
      });

      cy.findByTestId(upvoteTrialCard(trials[1].id)).click();
      cy.findByTestId(submitTrialCard(trials[1].id)).click();
      cy.findByTestId(tryAgainTrialCard(trials[1].id)).click();
    });
  });
});
