import React from "react";
import clsx from "clsx";

import "./SafeAreaView.css";

export const SafeAreaView: React.FC<JSX.IntrinsicElements["div"]> = ({
  className,
  ...rest
}) => <div className={clsx(["SafeAreaView", className])} {...rest} />;
