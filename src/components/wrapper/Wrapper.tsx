import React from "react";
import clsx from "clsx";

import "./Wrapper.css";

export const Wrapper: React.FC<JSX.IntrinsicElements["div"]> = ({
  className,
  ...rest
}) => <div className={clsx("Wrapper", className)} {...rest} />;
