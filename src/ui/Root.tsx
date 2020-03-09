import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Home } from "./home/Home";
import { Auth } from "./Auth";
import { ContactUs } from "./ContactUs";
import { HowItWorks } from "./HowItWorks";
import { NotFound } from "./NotFound";
import { PastTrials } from "./PastTrials";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsAndConditions } from "./TermsAndConditions";
import { Search } from "./Search";

export const Root: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/past-trials">
        <PastTrials />
      </Route>

      <Route path="/how-it-works">
        <HowItWorks />
      </Route>

      <Route path="/terms-and-conditions">
        <TermsAndConditions />
      </Route>

      <Route path="/privacy-policy">
        <PrivacyPolicy />
      </Route>

      <Route path="/contact-us">
        <ContactUs />
      </Route>

      <Route path="/auth">
        <Auth />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route path="/not-found">
        <NotFound />
      </Route>

      <Route path="/">
        <Home />
      </Route>

      <Route>
        <Redirect to="/not-found" />
      </Route>
    </Switch>
  </BrowserRouter>
);
