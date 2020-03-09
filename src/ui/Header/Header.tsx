import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import clsx from "clsx";

import "./Header.css";
import { Wrapper, CloseIcon } from "../../components";
import { ReactComponent as BarChart } from "./bar-chart.svg";
import { ReactComponent as Menu } from "./menu.svg";
import { ReactComponent as Search } from "./search.svg";

interface NavigationDrawerProps {
  collapsed: boolean;
  closeIconRef: React.RefObject<HTMLButtonElement>;
  onToggleMenu: VoidFunction;
  onLastItemBlurred: VoidFunction;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = props => {
  const { collapsed, closeIconRef, onToggleMenu, onLastItemBlurred } = props;

  return (
    <nav
      className={clsx([
        "NavigationDrawer",
        collapsed && `NavigationDrawer--collapsed`
      ])}
    >
      <Wrapper>
        <h2 className="visually-hidden">Navigation Menu</h2>

        <button
          ref={closeIconRef}
          onClick={onToggleMenu}
          className="NavigationDrawer-button"
        >
          <CloseIcon />
        </button>

        <ul>
          <li>
            <Link to="/past-trials" data-testid="[drawer] past-trials">
              Past Trials
            </Link>
          </li>
          <li>
            <Link to="/how-it-works" data-testid="[drawer] how-it-works">
              How It Works
            </Link>
          </li>
          <li>
            <Link to="/auth" data-testid="[drawer] auth">
              Log In / Sign Up
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              data-testid="[drawer] search"
              onBlur={onLastItemBlurred}
            >
              Search
            </Link>
          </li>
        </ul>
        <div></div>
      </Wrapper>
    </nav>
  );
};

interface AppBarProps {
  hamburguerIconRef: React.RefObject<HTMLButtonElement>;
  onToggleMenu: VoidFunction;
}

const AppBar: React.FC<AppBarProps> = props => {
  const { hamburguerIconRef, onToggleMenu } = props;

  return (
    <header className="Header">
      <Wrapper>
        <h1 className="Header__logo">
          <Link to="/">
            <BarChart /> Rule of Thumb
          </Link>
        </h1>

        <button
          ref={hamburguerIconRef}
          onClick={onToggleMenu}
          className="Header__menu-button"
          data-testid="[header] menu"
        >
          <Menu />
        </button>

        <nav className="Header__desktop-nav">
          <Wrapper>
            <h2 className="visually-hidden">Navigation Menu</h2>

            <ul>
              <li>
                <Link to="/past-trials" data-testid="[nav] past-trials">
                  Past Trials
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" data-testid="[nav] how-it-works">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/auth" data-testid="[nav] auth">
                  Log In / Sign Up
                </Link>
              </li>

              <li>
                <Link to="/search" data-testid="[nav] search">
                  <span className="visually-hidden">Search</span>

                  <Search />
                </Link>
              </li>
            </ul>
          </Wrapper>
        </nav>
      </Wrapper>
    </header>
  );
};

export const Header = () => {
  const [collapsed, setCollapsed] = useState(true);
  const hamburguerIconRef = useRef<HTMLButtonElement>(null);
  const closeIconRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const root = document.querySelector("#root");

    if (collapsed) {
      enableBodyScroll(root as Element);
    } else {
      disableBodyScroll(root as Element);
    }
  }, [collapsed]);

  const onToggleMenu = () => {
    setCollapsed(!collapsed);

    if (collapsed) {
      (hamburguerIconRef.current as HTMLButtonElement).blur();
      (closeIconRef.current as HTMLButtonElement).focus();
    } else {
      (closeIconRef.current as HTMLButtonElement).blur();
      (hamburguerIconRef.current as HTMLButtonElement).focus();
    }
  };

  const onLastItemBlurred = () => {
    (closeIconRef.current as HTMLButtonElement).focus();
  };

  return (
    <>
      <NavigationDrawer
        collapsed={collapsed}
        closeIconRef={closeIconRef}
        onToggleMenu={onToggleMenu}
        onLastItemBlurred={onLastItemBlurred}
      />

      <AppBar
        hamburguerIconRef={hamburguerIconRef}
        onToggleMenu={onToggleMenu}
      />
    </>
  );
};
