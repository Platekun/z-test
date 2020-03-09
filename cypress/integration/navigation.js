/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

const makeSelector = prefix => s => `[${prefix}] ${s}`;
const nav = makeSelector("nav");
const drawer = makeSelector("drawer");
const header = makeSelector("header");
const footer = makeSelector("footer");

describe("Navigation", () => {
  describe("From Home", () => {
    it("navigates to /auth", () => {
      cy.visit("http://localhost:8080");
      cy.findByTestId(nav("auth")).click();
      cy.url().should("be", "/auth");
    });

    it("navigates to /auth [drawer]", () => {
      cy.viewport(320, 960);
      cy.visit("http://localhost:8080");
      cy.findByTestId(header("menu")).click();
      cy.findByTestId(drawer("auth")).click();
      cy.url().should("be", "/auth");
    });

    it("navigates to /past-trials", () => {
      cy.visit("http://localhost:8080");
      cy.findByTestId(nav("auth")).click();
      cy.url().should("be", "/past-trials");
    });

    it("navigates to /past-trials [drawer]", () => {
      cy.viewport(320, 960);
      cy.visit("http://localhost:8080");
      cy.findByTestId(header("menu")).click();
      cy.findByTestId(drawer("past-trials")).click();
      cy.url().should("be", "/past-trials");
    });

    it("navigates to /how-it-works", () => {
      cy.visit("http://localhost:8080");
      cy.findByTestId(nav("how-it-works")).click();
      cy.url().should("be", "/how-it-works");
    });

    it("navigates to /how-it-works [drawer]", () => {
      cy.viewport(320, 960);
      cy.visit("http://localhost:8080");
      cy.findByTestId(header("menu")).click();
      cy.findByTestId(drawer("how-it-works")).click();
      cy.url().should("be", "/how-it-works");
    });

    it("navigates to /search", () => {
      cy.visit("http://localhost:8080");
      cy.findByTestId(nav("search")).click();
      cy.url().should("be", "/search");
    });

    it("navigates to /search [drawer]", () => {
      cy.viewport(320, 960);
      cy.visit("http://localhost:8080");
      cy.findByTestId(header("menu")).click();
      cy.findByTestId(drawer("search")).click();
      cy.url().should("be", "/search");
    });

    it("navigates to /contact-us", () => {
      cy.visit("http://localhost:8080");
      cy.findByTestId(footer("contact-us")).click();
      cy.url().should("be", "/contact-us");
    });

    it("navigates to /privacy-policy", () => {
      cy.visit("http://localhost:8080");
      cy.findByTestId(footer("privacy-policy")).click();
      cy.url().should("be", "/privacy-policy");
    });

    it("navigates to /not-found", () => {
      cy.visit("http://localhost:8080/sdfghjkl");
      cy.url().should("be", "/not-found");
    });
  });
});
