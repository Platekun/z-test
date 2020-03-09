# UI Test

## Client Instructions

Setup the client project by running:

```
yarn install
yarn start
```

Run the client tests with:

```
yarn test
```

## API Instructions

Setup the API project by running: (Please make sure to have the API running when using the client!)

```
cd api
yarn install
yarn start:dev
```

## API Notes

The API is kind-of dummy right now. The API provides 3 endpoints. An endpoint for getting trials, another for votes and another endpoint to create a vote for a given trial. At the moment I have a hardcoded user and votes are created only for that user.

## Front-end Tooling

The main front-end tools are:

- [Typescript](https://www.typescriptlang.org/) because types are ♥️
- [React](https://reactjs.org/) for simplicity and being my go-to library for building UIs.
- [XState](http://xstate.js.org/) to model my logic and control flows.
- [MobX](http://mobx.js.org/) because it allows me to decouple business logic from my view.
- Vanilla CSS, because I had a really short time to deliver the test and I feel comfortable using no preprocessors or post processors.
- [Cypress](https://www.cypress.io/) for E2E tests, I like the simple API it provides and it's faster than working with a Selenium-ish tool.

# Back-end Tooling

- [Nestjs](https://docs.nestjs.com/) Because I believe the "Angular" architecture makes more sense on back-end.
