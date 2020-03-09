import React from "react";

export const SearchIcon: React.FC<JSX.IntrinsicElements["svg"]> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="26"
    viewBox="0 0 24 26"
    {...props}
  >
    <title>Search</title>
    <path
      fill="#fff"
      d="M10.262 1.591c4.4 0 8.683 2.88 8.683 8.626 0 5.746-4.283 8.625-8.683 8.625-4.4 0-8.683-2.88-8.683-8.625 0-5.747 4.282-8.626 8.683-8.626zm0-1.591C5.19 0 0 3.402 0 10.217s5.19 10.216 10.262 10.216c1.907 0 3.831-.48 5.49-1.443l6.67 7.01L24 24.409l-6.444-6.768c1.785-1.699 2.968-4.174 2.968-7.424C20.524 3.402 15.334 0 10.262 0z"
    />
  </svg>
);
